import { query, getConnection } from '../config/database.js';
import { apiResponse, paginate, paginationMetadata } from '../utils/helpers.js';

// @desc    Obtenir toutes les ressources
// @route   GET /api/v1/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category_id, niveau, filiere, search } = req.query;
    const { limit: limitNum, offset } = paginate(page, limit);

    let sql = `
      SELECT r.*, u.nom as uploader_nom, u.prenom as uploader_prenom, c.nom as category_nom
      FROM resources r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.is_active = TRUE
    `;
    
    const params = [];

    if (type) {
      sql += ' AND r.type = ?';
      params.push(type);
    }
    if (category_id) {
      sql += ' AND r.category_id = ?';
      params.push(category_id);
    }
    if (niveau) {
      sql += ' AND r.niveau = ?';
      params.push(niveau);
    }
    if (filiere) {
      sql += ' AND r.filiere LIKE ?';
      params.push(`%${filiere}%`);
    }
    if (search) {
      sql += ' AND (r.titre LIKE ? OR r.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const resources = await query(sql, params);

    // Compter le total
    let countSql = 'SELECT COUNT(*) as total FROM resources r WHERE r.is_active = TRUE';
    const countParams = [];
    
    if (type) { countSql += ' AND r.type = ?'; countParams.push(type); }
    if (category_id) { countSql += ' AND r.category_id = ?'; countParams.push(category_id); }
    if (niveau) { countSql += ' AND r.niveau = ?'; countParams.push(niveau); }
    if (filiere) { countSql += ' AND r.filiere LIKE ?'; countParams.push(`%${filiere}%`); }
    if (search) { countSql += ' AND (r.titre LIKE ? OR r.description LIKE ?)'; countParams.push(`%${search}%`, `%${search}%`); }

    const totalResult = await query(countSql, countParams);
    const total = totalResult[0].total;

    return apiResponse(res, 200, true, 'Ressources récupérées', {
      resources,
      pagination: paginationMetadata(total, page, limit)
    });
  } catch (error) {
    console.error('Erreur récupération ressources:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la récupération des ressources');
  }
};

// @desc    Obtenir une ressource par ID
// @route   GET /api/v1/resources/:id
// @access  Public
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT r.*, u.nom as uploader_nom, u.prenom as uploader_prenom, c.nom as category_nom
      FROM resources r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.id = ? AND r.is_active = TRUE
    `;
    
    const resources = await query(sql, [id]);

    if (resources.length === 0) {
      return apiResponse(res, 404, false, 'Ressource non trouvée');
    }

    // Incrémenter le compteur de vues
    await query('UPDATE resources SET view_count = view_count + 1 WHERE id = ?', [id]);

    return apiResponse(res, 200, true, 'Ressource récupérée', resources[0]);
  } catch (error) {
    console.error('Erreur récupération ressource:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la récupération de la ressource');
  }
};

// @desc    Créer une ressource
// @route   POST /api/v1/resources
// @access  Private
export const createResource = async (req, res) => {
  try {
    const { titre, description, type, category_id, niveau, filiere, annee_academique, tags } = req.body;
    const userId = req.user.id;

    const sql = `
      INSERT INTO resources (titre, description, type, category_id, user_id, niveau, filiere, annee_academique, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      titre, description, type, category_id, userId, niveau, filiere, annee_academique, JSON.stringify(tags || [])
    ]);

    return apiResponse(res, 201, true, 'Ressource créée avec succès', {
      id: result.insertId
    });
  } catch (error) {
    console.error('Erreur création ressource:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la création de la ressource');
  }
};

// @desc    Mettre à jour une ressource
// @route   PUT /api/v1/resources/:id
// @access  Private
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, niveau, filiere, annee_academique, tags } = req.body;

    // Vérifier que la ressource appartient à l'utilisateur
    const checkSql = 'SELECT user_id FROM resources WHERE id = ?';
    const resources = await query(checkSql, [id]);

    if (resources.length === 0) {
      return apiResponse(res, 404, false, 'Ressource non trouvée');
    }

    if (resources[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse(res, 403, false, 'Non autorisé à modifier cette ressource');
    }

    const sql = `
      UPDATE resources 
      SET titre = ?, description = ?, niveau = ?, filiere = ?, annee_academique = ?, tags = ?
      WHERE id = ?
    `;
    
    await query(sql, [titre, description, niveau, filiere, annee_academique, JSON.stringify(tags || []), id]);

    return apiResponse(res, 200, true, 'Ressource mise à jour avec succès');
  } catch (error) {
    console.error('Erreur mise à jour ressource:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la mise à jour de la ressource');
  }
};

// @desc    Supprimer une ressource
// @route   DELETE /api/v1/resources/:id
// @access  Private
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la ressource appartient à l'utilisateur
    const checkSql = 'SELECT user_id FROM resources WHERE id = ?';
    const resources = await query(checkSql, [id]);

    if (resources.length === 0) {
      return apiResponse(res, 404, false, 'Ressource non trouvée');
    }

    if (resources[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse(res, 403, false, 'Non autorisé à supprimer cette ressource');
    }

    // Soft delete
    await query('UPDATE resources SET is_active = FALSE WHERE id = ?', [id]);

    return apiResponse(res, 200, true, 'Ressource supprimée avec succès');
  } catch (error) {
    console.error('Erreur suppression ressource:', error);
    return apiResponse(res, 500, false, 'Erreur lors de la suppression de la ressource');
  }
};

// @desc    Télécharger une ressource
// @route   POST /api/v1/resources/:id/download
// @access  Private
export const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Enregistrer le téléchargement
    const downloadSql = 'INSERT INTO downloads (user_id, resource_id, ip_address) VALUES (?, ?, ?)';
    await query(downloadSql, [userId, id, req.ip]);

    // Incrémenter le compteur
    await query('UPDATE resources SET download_count = download_count + 1 WHERE id = ?', [id]);

    // Ajouter des points à l'utilisateur (gamification)
    await query('UPDATE users SET points = points + 1 WHERE id = ?', [userId]);

    return apiResponse(res, 200, true, 'Téléchargement enregistré');
  } catch (error) {
    console.error('Erreur enregistrement téléchargement:', error);
    return apiResponse(res, 500, false, 'Erreur lors de l\'enregistrement du téléchargement');
  }
};
