import { query } from '../config/database.js';
import { apiResponse, asyncHandler, paginate, paginationMetadata } from '../utils/helpers.js';
import ApiError from '../utils/ApiError.js';

// ============================================
// MES NOTIFICATIONS
// @route GET /api/v1/notifications
// @access Private
// ============================================
export const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query.page, req.query.limit, 50);

  const conditions = ['user_id = ?'];
  const params = [req.user.id];

  if (req.query.unread === 'true') {
    conditions.push('is_read = FALSE');
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const notifications = await query(
    `SELECT id, type, titre, message, link, is_read, created_at
     FROM notifications
     ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const totalRows = await query(`SELECT COUNT(*) AS total FROM notifications ${where}`, params);
  const nonLues = await query(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = FALSE',
    [req.user.id]
  );

  return apiResponse(res, 200, true, 'Notifications récupérées', {
    notifications,
    non_lues: Number(nonLues[0]?.total) || 0,
    pagination: paginationMetadata(totalRows[0].total, page, limit)
  });
});

// ============================================
// MARQUER UNE NOTIFICATION COMME LUE
// @route PATCH /api/v1/notifications/:id/read
// @access Private
// ============================================
export const markAsRead = asyncHandler(async (req, res) => {
  const resultat = await query(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );

  if (resultat.affectedRows === 0) {
    throw ApiError.notFound('Notification non trouvée');
  }

  return apiResponse(res, 200, true, 'Notification marquée comme lue');
});

// ============================================
// TOUT MARQUER COMME LU
// @route PATCH /api/v1/notifications/read-all
// @access Private
// ============================================
export const markAllAsRead = asyncHandler(async (req, res) => {
  const resultat = await query(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
    [req.user.id]
  );

  return apiResponse(res, 200, true, 'Notifications marquées comme lues', {
    mises_a_jour: resultat.affectedRows
  });
});

// ============================================
// SUPPRIMER UNE NOTIFICATION
// @route DELETE /api/v1/notifications/:id
// @access Private
// ============================================
export const deleteNotification = asyncHandler(async (req, res) => {
  const resultat = await query('DELETE FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

  if (resultat.affectedRows === 0) {
    throw ApiError.notFound('Notification non trouvée');
  }

  return apiResponse(res, 200, true, 'Notification supprimée');
});

export default { getNotifications, markAsRead, markAllAsRead, deleteNotification };
