import { query } from '../config/database.js';

/**
 * Créer une notification utilisateur.
 * Volontairement non bloquant : une notification qui échoue ne doit pas faire
 * échouer l'action métier qui l'a déclenchée.
 */
export const creerNotification = async (userId, { type, titre, message, link = null }) => {
  try {
    await query(
      `INSERT INTO notifications (user_id, type, titre, message, link)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, type, titre, message, link]
    );
  } catch (error) {
    console.error('Erreur création notification:', error.message);
  }
};
