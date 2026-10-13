import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ApiError from '../utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dossier de destination (UPLOAD_PATH peut être relatif au dossier Backend/)
export const dossierUploads = path.resolve(
  __dirname,
  '../../',
  process.env.UPLOAD_PATH || './uploads'
);

if (!fs.existsSync(dossierUploads)) {
  fs.mkdirSync(dossierUploads, { recursive: true });
}

// Extensions autorisées (aligné sur l'attribut accept du formulaire Contribuer)
export const EXTENSIONS_AUTORISEES = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.zip'];

const stockage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dossierUploads),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, extension)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 60);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${base || 'fichier'}-${unique}${extension}`);
  }
});

const filtreFichier = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!EXTENSIONS_AUTORISEES.includes(extension)) {
    return cb(ApiError.badRequest(
      `Format de fichier non autorisé. Formats acceptés : ${EXTENSIONS_AUTORISEES.join(', ')}`
    ));
  }

  return cb(null, true);
};

export const upload = multer({
  storage: stockage,
  fileFilter: filtreFichier,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024, // 50 Mo
    files: 1
  }
});

// Champ unique attendu : `fichier` (formulaire Contribuer)
export const uploadRessource = upload.single('fichier');

// Supprimer un fichier du disque (ignoré s'il n'existe plus)
export const supprimerFichier = (urlPublique) => {
  if (!urlPublique) return;

  const nom = path.basename(urlPublique);
  const chemin = path.join(dossierUploads, nom);

  if (chemin.startsWith(dossierUploads) && fs.existsSync(chemin)) {
    fs.unlinkSync(chemin);
  }
};

export default upload;
