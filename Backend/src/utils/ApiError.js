/**
 * Erreur applicative : porte un code HTTP et, éventuellement, le détail des
 * champs invalides. Les contrôleurs la lèvent, `errorHandler` la formate.
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message = 'Requête invalide', errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Authentification requise') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Accès refusé') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Ressource non trouvée') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflit de données') {
    return new ApiError(409, message);
  }
}

export default ApiError;
