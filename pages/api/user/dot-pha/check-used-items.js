import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, usedItemIds } = req.query;

  if (!userId || !usedItemIds) {
    return res.status(400).json({ message: 'User ID and used item IDs are required' });
  }

  const usedItemIdArray = usedItemIds.split(',').map(id => parseInt(id.trim(), 10));

  try {
    const query = `
      SELECT vat_pham_id, so_luong FROM ruong_do 
      WHERE user_id = ? AND vat_pham_id IN (?) AND so_luong > 0
    `;
    db.query(query, [userId, usedItemIdArray], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }

      // Return the items that the user has
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}