import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// Middleware d'authentification
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token du header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur
    const sql = 'SELECT id, nom, prenom, email, role, is_active FROM users WHERE id = ? AND is_active = TRUE';
    const users = await query(sql, [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou inactif'
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
      error: error.message
    });
  }
};

// Middleware pour vérifier les rôles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Permissions insuffisantes.'
      });
    }

    next();
  };
};

// Middleware optionnel (ne bloque pas si pas de token)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const sql = 'SELECT id, nom, prenom, email, role FROM users WHERE id = ? AND is_active = TRUE';
      const users = await query(sql, [decoded.userId]);
      
      if (users.length > 0) {
        req.user = users[0];
      }
    }
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur
    next();
  }
};
