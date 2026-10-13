import { query } from '../config/database.js';
import ApiError from './ApiError.js';

/**
 * Les « matières » de la plateforme sont les catégories (table `categories`).
 * L'API accepte indifféremment le slug (« mathematiques ») ou le libellé
 * (« Mathématiques »), envoyé par les formulaires du frontend.
 *
 * @returns {Promise<number|null>} l'identifiant de la catégorie, ou null si non fourni
 */
export const resoudreCategorie = async (matiere) => {
  if (matiere === undefined || matiere === null || matiere === '') return null;

  const valeur = String(matiere).trim();

  const rows = await query(
    `SELECT id
     FROM categories
     WHERE is_active = TRUE AND (slug = ? OR nom = ?)
     LIMIT 1`,
    [valeur.toLowerCase(), valeur]
  );

  if (rows.length === 0) {
    const disponibles = await query('SELECT nom, slug FROM categories WHERE is_active = TRUE ORDER BY ordre ASC');

    throw ApiError.badRequest(`Matière inconnue : « ${matiere} »`, [
      {
        field: 'matiere',
        message: `Valeurs acceptées : ${disponibles.map((c) => `${c.nom} (${c.slug})`).join(', ')}`
      }
    ]);
  }

  return rows[0].id;
};

export default resoudreCategorie;
