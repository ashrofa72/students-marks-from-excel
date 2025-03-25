import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const publicDirectory = path.join(process.cwd(), 'public');
    const excelFiles = fs.readdirSync(publicDirectory).filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'));
    res.status(200).json({ files: excelFiles });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
