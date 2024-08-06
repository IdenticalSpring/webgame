import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, levelId } = req.body;

    if (!userId || !levelId) {
      return res.status(400).json({ message: 'User ID and Level ID are required' });
    }

    try {
      const results = await db.query('UPDATE users SET level = ?, exp = 0 WHERE id = ?', [levelId, userId]);
      res.status(200).json({ message: 'Level updated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}