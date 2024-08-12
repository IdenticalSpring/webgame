import db from '../../lib/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're handling file uploads
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(process.cwd(), 'public/avatar');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const userId = req.body.userId;
      cb(null, `${userId}.png`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  upload.single('avatar')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { userId, username, bio, dateOfBirth, gender, ngoai_hieu, danh_hao, tai_san } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const updates = [];
    const values = [];

    if (username !== undefined) {
      updates.push('name = ?');
      values.push(username);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }
    if (dateOfBirth !== undefined) {
      updates.push('dateOfBirth = ?');
      values.push(dateOfBirth);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      values.push(gender);
    }
    if (req.file) {
      const imagePath = `/avatar/${userId}.png`; // Set image path
      updates.push('image = ?');
      values.push(imagePath);
    }
    if (ngoai_hieu !== undefined) {
      updates.push('ngoai_hieu = ?');
      values.push(ngoai_hieu);
    }
    if (danh_hao !== undefined) {
      updates.push('danh_hao = ?');
      values.push(danh_hao);
    }
    if (tai_san !== undefined) {
      updates.push('tai_san = ?');
      values.push(tai_san);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(userId);

    try {
      db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values,
        (error, results) => {
          if (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
          }

          res.status(200).json({ message: 'Profile updated successfully', imagePath: req.file ? `/avatar/${userId}.png` : undefined });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
}
