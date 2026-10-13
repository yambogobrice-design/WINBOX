import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import ApiError from '../utils/ApiError.js';

/**
 * Rôles de la plateforme, alignés sur le frontend :
 *   etudiant | contributeur | admin
 * Les comptes `suspendu` ou `inactif` ne peuvent pas s'authentifier.
 */

// Récupère l'utilisateur porteur du token (ou null)
const chargerUtilisateur = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const rows = await query(
    `SELECT id, nom, prenom, email, role, status, niveau, filiere, points
     FROM users
     WHERE id = ? AND status = 'actif'`,
    [decoded.userId]
  );

  return rows.length > 0 ? rows[0] : null;
};

// Extrait le token du header Authorization: Bearer <token>
const extraireToken = (req) => {
  const header = req.headers.authorization || '';
  const [schema, token] = header.split(' ');
  return schema === 'Bearer' && token ? token : null;
};

// Traduit les erreurs JWT en ApiError
const erreurJwt = (error) => {
  if (error.name === 'TokenExpiredError') return ApiError.unauthorized('Token expiré');
  if (error.name === 'JsonWebTokenError') return ApiError.unauthorized('Token invalide');
  return error;
};

// ============================================
// AUTHENTIFICATION OBLIGATOIRE
// ============================================
export const authenticate = async (req, res, next) => {
  try {
    const token = extraireToken(req);

    if (!token) {
      throw ApiError.unauthorized('Token d\'authentification manquant');
    }

    const utilisateur = await chargerUtilisateur(token);

    if (!utilisateur) {
      throw ApiError.unauthorized('Utilisateur non trouvé ou compte inactif');
    }

    req.user = utilisateur;
    return next();
  } catch (error) {
    return next(erreurJwt(error));
  }
};

// ============================================
// AUTHENTIFICATION OPTIONNELLE
// ============================================
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extraireToken(req);

    if (token) {
      const utilisateur = await chargerUtilisateur(token);
      if (utilisateur) req.user = utilisateur;
    }
  } catch {
    // Token absent/invalide : on continue en visiteur anonyme
  }

  return next();
};

// ============================================
// AUTORISATION PAR RÔLE
// ============================================
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Non authentifié'));
  }

  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden('Accès refusé. Permissions insuffisantes.'));
  }

  return next();
};

// Raccourcis lisibles dans les routes
export const estAdmin = authorize('admin');
export const estContributeur = authorize('contributeur', 'admin');

export default { authenticate, optionalAuth, authorize, estAdmin, estContributeur };
