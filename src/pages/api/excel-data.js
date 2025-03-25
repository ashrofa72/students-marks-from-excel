import * as ExcelJS from 'exceljs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { file } = req.query;

    if (!file) {
      return res.status(400).json({ error: 'File name is required' });
    }

    const filePath = path.join(process.cwd(), 'public', file);

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.getWorksheet(1);
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          // Skip header row
          return;
        }

        const rowData = {};
        worksheet.getRow(1).eachCell((headerCell, colNumber) => {
          const header = headerCell.value;
          rowData[header] = row.getCell(colNumber).value;
        });
        data.push(rowData);
      });

      res.status(200).json({ data: data });
    } catch (error) {
      console.error('Error reading Excel file:', error);
      res.status(500).json({ error: 'Failed to read Excel file' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
