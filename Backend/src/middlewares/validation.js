import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware de validation générique.
 * À placer en dernier dans une chaîne de règles express-validator.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(ApiError.badRequest(
      'Erreur de validation',
      errors.array().map((err) => ({ field: err.path, message: err.msg }))
    ));
  }

  return next();
};

/**
 * Vérifie que le paramètre d'URL `:id` est un entier positif.
 * Évite les requêtes SQL inutiles et les réponses 500 sur un id fantaisiste.
 */
export const idValide = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return next(ApiError.badRequest('Identifiant invalide'));
  }

  return next();
};

export default validate;
