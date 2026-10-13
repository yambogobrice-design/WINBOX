import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ============================================
// MOTS DE PASSE
// ============================================

// Hacher un mot de passe
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparer un mot de passe
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// ============================================
// JETONS
// ============================================

// Générer un token JWT
export const generateToken = (userId, role = 'etudiant') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Générer un jeton de réinitialisation de mot de passe.
// Seul le haché est stocké en base : le jeton en clair n'est envoyé qu'à l'utilisateur.
export const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, tokenHash: hashResetToken(token) };
};

export const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// ============================================
// RÉPONSES HTTP
// ============================================

// Formater une réponse API
export const apiResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Enveloppe les handlers async : toute exception part vers errorHandler
export const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================
// PAGINATION
// ============================================

// Calculer limit/offset en neutralisant les valeurs invalides
export const paginate = (page = 1, limit = 20, maxLimit = 100) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit, 10) || 20));

  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  };
};

// Calculer les métadonnées de pagination
export const paginationMetadata = (totalItems, page, limit) => {
  const total = Number(totalItems) || 0;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const totalPages = Math.ceil(total / limitNum);

  return {
    totalItems: total,
    totalPages,
    currentPage: pageNum,
    itemsPerPage: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1
  };
};

// Clause ORDER BY sûre : seules les colonnes de la liste blanche sont acceptées
export const buildOrderBy = (sort, colonnesAutorisees, defaut) => {
  if (!sort) return `ORDER BY ${defaut}`;

  const [champ, direction] = String(sort).split(':');
  if (!colonnesAutorisees[champ]) return `ORDER BY ${defaut}`;

  const sens = String(direction).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return `ORDER BY ${colonnesAutorisees[champ]} ${sens}`;
};

// ============================================
// DIVERS
// ============================================

// Générer un slug à partir d'un texte
export const generateSlug = (text) => {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Nettoyer un objet (supprimer les champs undefined/null/chaînes vides)
export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
};

// Extraire l'extension d'un fichier
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

// Formater la taille d'un fichier
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Nombre de jours d'une période (WinRank / Dashboard admin)
export const periodeEnJours = (periode, defaut = 30) => {
  const correspondances = {
    "aujourd'hui": 1,
    '1j': 1,
    '7j': 7,
    'cette semaine': 7,
    '30j': 30,
    'ce mois': 30,
    '90j': 90,
    'tout temps': null,
    'tout': null
  };

  const cle = String(periode || '').toLowerCase().trim();
  if (cle in correspondances) return correspondances[cle];
  return defaut;
};
