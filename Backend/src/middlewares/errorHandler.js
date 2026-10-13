import multer from 'multer';
import ApiError from '../utils/ApiError.js';

/**
 * Gestion centralisée des erreurs.
 * Tous les contrôleurs délèguent ici (via next(error) ou asyncHandler).
 */
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const estDeveloppement = process.env.NODE_ENV !== 'production';

  // --- Erreurs applicatives (ApiError) ---
  if (err instanceof ApiError) {
    const corps = { success: false, message: err.message };
    if (err.errors) corps.errors = err.errors;
    return res.status(err.statusCode).json(corps);
  }

  // --- Erreurs d'upload (multer) ---
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxMo = Math.round((parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024) / (1024 * 1024));
      return res.status(400).json({
        success: false,
        message: `Fichier trop volumineux (maximum ${maxMo} Mo)`
      });
    }

    return res.status(400).json({ success: false, message: `Erreur d'upload : ${err.message}` });
  }

  // --- Erreurs MySQL ---
  if (err.code && String(err.code).startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Cet enregistrement existe déjà'
      });
    }

    if (['ER_NO_REFERENCED_ROW', 'ER_NO_REFERENCED_ROW_2', 'ER_ROW_IS_REFERENCED_2'].includes(err.code)) {
      return res.status(400).json({
        success: false,
        message: 'Référence invalide : la ressource liée n\'existe pas ou est utilisée'
      });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
      console.error('❌ Schéma de base de données obsolète :', err.sqlMessage || err.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur de base de données',
        error: estDeveloppement ? (err.sqlMessage || err.message) : undefined
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur de base de données',
      error: estDeveloppement ? (err.sqlMessage || err.message) : undefined
    });
  }

  // --- Erreurs JWT non traduites en amont ---
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expiré' });
  }

  // --- Erreur de syntaxe JSON du body parser ---
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Corps de requête JSON invalide' });
  }

  // --- Erreur inattendue ---
  console.error('❌ Erreur non gérée:', err);

  return res.status(err.status || 500).json({
    success: false,
    message: estDeveloppement ? err.message : 'Erreur serveur',
    error: estDeveloppement ? err.stack : undefined
  });
};

// Route inconnue
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
};

export default { errorHandler, notFound };
