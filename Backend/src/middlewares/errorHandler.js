// Middleware de gestion des erreurs
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  // Erreur MySQL
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      success: false,
      message: 'Erreur de base de données',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur s\'est produite'
    });
  }

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.errors
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Middleware pour les routes non trouvées
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
};
