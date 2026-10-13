import { query } from '../config/database.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateResetToken,
  hashResetToken,
  apiResponse,
  asyncHandler,
  cleanObject
} from '../utils/helpers.js';
import { ajouterPoints, BAREME } from '../utils/gamification.js';
import { creerNotification } from '../utils/notifications.js';
import ApiError from '../utils/ApiError.js';

// Champs renvoyés au client (jamais password_hash)
export const CHAMPS_PUBLICS = `
  id, nom, prenom, email, telephone, niveau, filiere, specialite,
  institution, bio, role, status, points, preferences, is_verified,
  created_at, updated_at, last_login
`;

// Statistiques agrégées d'un utilisateur (utilisées par /auth/me et le profil)
export const statistiquesUtilisateur = async (userId) => {
  const rows = await query(
    `SELECT
       (SELECT COUNT(*) FROM resources r
         WHERE r.user_id = u.id AND r.status = 'validee' AND r.is_active = TRUE) AS contributions,
       (SELECT COUNT(*) FROM resources r WHERE r.user_id = u.id AND r.status = 'en_attente') AS contributions_en_attente,
       (SELECT COUNT(*) FROM downloads d WHERE d.user_id = u.id) AS telechargements,
       (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS quiz_completes,
       (SELECT ROUND(AVG(qa.percentage), 0) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS taux_reussite,
       (SELECT COUNT(*) FROM user_badges ub WHERE ub.user_id = u.id) AS badges,
       (SELECT COUNT(*) FROM favorites f WHERE f.user_id = u.id) AS favoris,
       (SELECT COALESCE(SUM(ss.duree_minutes), 0) FROM study_sessions ss WHERE ss.user_id = u.id) AS minutes_etude,
       (SELECT COUNT(*) + 1 FROM users u2
         WHERE u2.status = 'actif' AND u2.points > u.points) AS rang
     FROM users u
     WHERE u.id = ?`,
    [userId]
  );

  return rows[0] || null;
};

// ============================================
// INSCRIPTION
// @route POST /api/v1/auth/register
// @access Public
// ============================================
export const register = asyncHandler(async (req, res) => {
  const {
    nom,
    prenom,
    email,
    password,
    telephone = null,
    niveau = null,
    filiere = null,
    specialite = null,
    institution = null
  } = req.body;

  const emailNormalise = String(email).trim().toLowerCase();

  const existant = await query('SELECT id FROM users WHERE email = ?', [emailNormalise]);
  if (existant.length > 0) {
    throw ApiError.conflict('Cet email est déjà utilisé');
  }

  const password_hash = await hashPassword(password);

  const resultat = await query(
    `INSERT INTO users (nom, prenom, email, password_hash, telephone, niveau, filiere, specialite, institution)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nom.trim(), prenom.trim(), emailNormalise, password_hash, telephone, niveau, filiere, specialite, institution]
  );

  const userId = resultat.insertId;

  // Points de bienvenue + fil d'activité
  await ajouterPoints(userId, {
    type: 'inscription',
    titre: 'Inscription sur WinBox',
    points: BAREME.inscription
  });

  await creerNotification(userId, {
    type: 'bienvenue',
    titre: 'Bienvenue sur WinBox !',
    message: 'Votre compte est créé. Explorez les ressources ou partagez vos propres documents.',
    link: '/Recherche'
  });

  const utilisateurs = await query(`SELECT ${CHAMPS_PUBLICS} FROM users WHERE id = ?`, [userId]);
  const user = utilisateurs[0];

  return apiResponse(res, 201, true, 'Inscription réussie', {
    user,
    token: generateToken(user.id, user.role)
  });
});

// ============================================
// CONNEXION
// @route POST /api/v1/auth/login
// @access Public
// ============================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const emailNormalise = String(email).trim().toLowerCase();

  const rows = await query(
    `SELECT ${CHAMPS_PUBLICS}, password_hash FROM users WHERE email = ?`,
    [emailNormalise]
  );

  if (rows.length === 0) {
    throw ApiError.unauthorized('Email ou mot de passe incorrect');
  }

  const user = rows[0];

  if (user.status === 'suspendu') {
    throw ApiError.forbidden('Ce compte est suspendu. Contactez l\'administration.');
  }

  if (user.status === 'inactif') {
    throw ApiError.forbidden('Ce compte est inactif.');
  }

  const motDePasseValide = await comparePassword(password, user.password_hash);
  if (!motDePasseValide) {
    throw ApiError.unauthorized('Email ou mot de passe incorrect');
  }

  await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

  delete user.password_hash;
  user.last_login = new Date().toISOString();

  return apiResponse(res, 200, true, 'Connexion réussie', {
    user,
    token: generateToken(user.id, user.role),
    stats: await statistiquesUtilisateur(user.id)
  });
});

// ============================================
// PROFIL CONNECTÉ
// @route GET /api/v1/auth/me
// @access Private
// ============================================
export const getMe = asyncHandler(async (req, res) => {
  const rows = await query(`SELECT ${CHAMPS_PUBLICS} FROM users WHERE id = ?`, [req.user.id]);

  if (rows.length === 0) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  return apiResponse(res, 200, true, 'Profil récupéré', {
    user: rows[0],
    stats: await statistiquesUtilisateur(req.user.id)
  });
});

// ============================================
// MISE À JOUR DU PROFIL
// @route PUT /api/v1/auth/profile
// @access Private
// ============================================
export const updateProfile = asyncHandler(async (req, res) => {
  const { nom, prenom, email, telephone, niveau, filiere, specialite, institution, bio, preferences } = req.body;

  const champs = cleanObject({
    nom,
    prenom,
    telephone,
    niveau,
    filiere,
    specialite,
    institution,
    bio
  });

  // L'email est unique : on le traite à part
  if (email !== undefined) {
    const emailNormalise = String(email).trim().toLowerCase();
    const existant = await query('SELECT id FROM users WHERE email = ? AND id <> ?', [emailNormalise, req.user.id]);

    if (existant.length > 0) {
      throw ApiError.conflict('Cet email est déjà utilisé par un autre compte');
    }

    champs.email = emailNormalise;
  }

  if (preferences !== undefined) {
    if (typeof preferences !== 'object' || preferences === null || Array.isArray(preferences)) {
      throw ApiError.badRequest('Le champ « preferences » doit être un objet');
    }
    champs.preferences = JSON.stringify(preferences);
  }

  if (Object.keys(champs).length === 0) {
    throw ApiError.badRequest('Aucun champ à mettre à jour');
  }

  const set = Object.keys(champs).map((champ) => `${champ} = ?`).join(', ');
  const valeurs = [...Object.values(champs), req.user.id];

  await query(`UPDATE users SET ${set} WHERE id = ?`, valeurs);

  const rows = await query(`SELECT ${CHAMPS_PUBLICS} FROM users WHERE id = ?`, [req.user.id]);

  return apiResponse(res, 200, true, 'Profil mis à jour avec succès', { user: rows[0] });
});

// ============================================
// CHANGEMENT DE MOT DE PASSE
// @route PUT /api/v1/auth/change-password
// @access Private
// ============================================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const rows = await query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  const valide = await comparePassword(currentPassword, rows[0].password_hash);
  if (!valide) {
    throw ApiError.badRequest('Mot de passe actuel incorrect');
  }

  if (await comparePassword(newPassword, rows[0].password_hash)) {
    throw ApiError.badRequest('Le nouveau mot de passe doit être différent de l\'actuel');
  }

  const password_hash = await hashPassword(newPassword);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, req.user.id]);

  await creerNotification(req.user.id, {
    type: 'securite',
    titre: 'Mot de passe modifié',
    message: 'Votre mot de passe a été changé avec succès.',
    link: '/Profil'
  });

  return apiResponse(res, 200, true, 'Mot de passe changé avec succès');
});

// ============================================
// MOT DE PASSE OUBLIÉ
// @route POST /api/v1/auth/forgot-password
// @access Public
// ============================================
export const forgotPassword = asyncHandler(async (req, res) => {
  const emailNormalise = String(req.body.email).trim().toLowerCase();

  const rows = await query('SELECT id, prenom, email FROM users WHERE email = ?', [emailNormalise]);

  // Réponse identique que l'email existe ou non (pas d'énumération de comptes)
  const message = 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.';

  if (rows.length === 0) {
    return apiResponse(res, 200, true, message);
  }

  const user = rows[0];
  const { token, tokenHash } = generateResetToken();
  const validiteMinutes = parseInt(process.env.RESET_TOKEN_EXPIRE_MINUTES, 10) || 60;

  // Invalider les jetons précédents encore valides
  await query('UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL', [user.id]);

  await query(
    `INSERT INTO password_resets (user_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
    [user.id, tokenHash, validiteMinutes]
  );

  const lien = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/MotDePasseOublie?token=${token}`;

  // Aucun transport email n'est configuré : on journalise le lien côté serveur.
  // En développement, le jeton est aussi renvoyé pour permettre les tests.
  console.log(`🔑 Réinitialisation de mot de passe pour ${user.email} : ${lien}`);

  const donnees = { expireDansMinutes: validiteMinutes };
  if (process.env.NODE_ENV !== 'production' && process.env.EXPOSE_RESET_TOKEN === 'true') {
    donnees.token = token;
    donnees.lien = lien;
  }

  return apiResponse(res, 200, true, message, donnees);
});

// ============================================
// RÉINITIALISATION DU MOT DE PASSE
// @route POST /api/v1/auth/reset-password
// @access Public
// ============================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const tokenHash = hashResetToken(token);

  const rows = await query(
    `SELECT id, user_id
     FROM password_resets
     WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
     ORDER BY id DESC
     LIMIT 1`,
    [tokenHash]
  );

  if (rows.length === 0) {
    throw ApiError.badRequest('Lien de réinitialisation invalide ou expiré');
  }

  const reinitialisation = rows[0];
  const password_hash = await hashPassword(password);

  await query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, reinitialisation.user_id]);
  await query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [reinitialisation.id]);

  await creerNotification(reinitialisation.user_id, {
    type: 'securite',
    titre: 'Mot de passe réinitialisé',
    message: 'Votre mot de passe a été réinitialisé depuis la page « Mot de passe oublié ».',
    link: '/Connexion'
  });

  return apiResponse(res, 200, true, 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.');
});

// ============================================
// DÉCONNEXION (information)
// @route POST /api/v1/auth/logout
// @access Private
// ============================================
export const logout = asyncHandler(async (req, res) => {
  // Les jetons JWT sont sans état : la déconnexion consiste à supprimer le
  // jeton côté client. L'endpoint existe pour que le frontend ait un point
  // d'appel unique et pourra porter une liste de révocation plus tard.
  return apiResponse(res, 200, true, 'Déconnexion réussie');
});
