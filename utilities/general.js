import fs from 'fs';
import PDFDocument from 'pdfkit';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

export const loadText = async (filePath) => {
  const loader = new TextLoader(filePath);
  return await loader.load();
};

export const loadPDF = async (filePath) => {
  const loader = new PDFLoader(filePath);
  return await loader.load();
};

export const saveContentToPDF = (filePath, content) => {
  if (fs.existsSync(filePath + '.pdf')) {
    fs.unlinkSync(filePath + '.pdf');
    console.log('Existing PDF file deleted:', filePath + '.pdf');
  }

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath + '.pdf'));
  doc.text(content);
  doc.end();

  console.log(`New cover letter written to ${filePath}.pdf`);
};
