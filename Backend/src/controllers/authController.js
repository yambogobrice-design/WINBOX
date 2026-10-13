import { query } from '../config/database.js';
import { hashPassword, comparePassword, generateToken, apiResponse } from '../utils/helpers.js';

// @desc    Inscription d'un utilisateur
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, niveau, filiere, institution } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return apiResponse(res, 400, false, 'Cet email est déjà utilisé');
    }

    // Hacher le mot de passe
    const password_hash = await hashPassword(password);

    // Insérer l'utilisateur
    const sql = `
      INSERT INTO users (nom, prenom, email, password_hash, telephone, niveau, filiere, institution)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [nom, prenom, email, password_hash, telephone, niveau, filiere, institution]);
    
    // Générer le token
    const token = generateToken(result.insertId);

    return apiResponse(res, 201, true, 'Inscription réussie', {
      user: {
        id: result.insertId,
        nom,
        prenom,
        email,
        telephone,
        niveau,
        filiere,
        institution
      },
      token
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return apiResponse(res, 500, false, 'Erreur lors de l\'inscription');
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Récupérer l'utilisateur
    const sql = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const users = await query(sql, [email]);

    if (users.length === 0) {
      return apiResponse(res, 401, false, 'Email ou mot de passe incorrect');
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return apiResponse(res, 401, false, 'Email ou mot de passe incorrect');
    }

    // Mettre à jour le last_login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Générer le token
    const token = generateToken(user.id, user.role);

    // Supprimer le password_hash de la réponse
    delete user.password_hash;

    return apiResponse(res, 200, true, 'Connexion réussie', {
      user,
      token
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la connexion');
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const sql = `
      SELECT id, nom, prenom, email, telephone, niveau, filiere, institution, 
             avatar_url, role, points, is_verified, created_at, last_login
      FROM users WHERE id = ?
    `;
    
    const users = await query(sql, [req.user.id]);
    
    if (users.length === 0) {
      return apiResponse(res, 404, false, 'Utilisateur non trouvé');
    }

    return apiResponse(res, 200, true, 'Profil récupéré', users[0]);
  } catch (error) {
    console.error('Erreur profil:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la récupération du profil');
  }
};

// @desc    Mettre à jour le profil
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, niveau, filiere, institution } = req.body;
    
    const sql = `
      UPDATE users 
      SET nom = ?, prenom = ?, telephone = ?, niveau = ?, filiere = ?, institution = ?
      WHERE id = ?
    `;
    
    await query(sql, [nom, prenom, telephone, niveau, filiere, institution, req.user.id]);

    return apiResponse(res, 200, true, 'Profil mis à jour avec succès');
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la mise à jour du profil');
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur avec le mot de passe
    const users = await query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    // Vérifier le mot de passe actuel
    const isValid = await comparePassword(currentPassword, user.password_hash);
    
    if (!isValid) {
      return apiResponse(res, 400, false, 'Mot de passe actuel incorrect');
    }

    // Hacher le nouveau mot de passe
    const newPasswordHash = await hashPassword(newPassword);

    // Mettre à jour
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.id]);

    return apiResponse(res, 200, true, 'Mot de passe changé avec succès');
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    return apiResponse(res, 500, false, 'Erreur lors du changement de mot de passe');
  }
};
