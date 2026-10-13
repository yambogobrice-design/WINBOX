import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hacher un mot de passe
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparer un mot de passe
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Générer un token JWT
export const generateToken = (userId, role = 'student') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Générer un slug à partir d'un texte
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Formater une réponse API
export const apiResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message
  };
  
  if (data) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

// Pagination
export const paginate = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  return {
    limit: limitNum,
    offset,
    page: pageNum
  };
};

// Calculer les métadonnées de pagination
export const paginationMetadata = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    totalItems,
    totalPages,
    currentPage: parseInt(page),
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Nettoyer un objet (supprimer les champs undefined/null)
export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
  );
};

// Extraire l'extension d'un fichier
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Formater la taille d'un fichier
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
