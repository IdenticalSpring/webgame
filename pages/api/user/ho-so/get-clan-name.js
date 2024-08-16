import db from '@/lib/db';

export default async function handler(req, res) {
  const { clanId } = req.query;

  if (!clanId) {
    return res.status(400).json({ message: "Clan ID is required" });
  }

  try {
    const query = 'SELECT * FROM clans WHERE id = ?';
    db.query(query, [clanId], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Clan not found' });
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}