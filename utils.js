import fs from 'fs';
import PDFDocument from 'pdfkit';
import { TextLoader } from 'langchain/document_loaders/fs/text';

export const COVER_LETTER_PATH = './localFiles/existingCoverLetter.txt';
export const RESUME_PATH = './localFiles/resume.pdf';
export const JOB_SPEC_PATH = './localFiles/jobspec.txt';
export const NEW_COVER_LETTER_PATH = './localFiles/newCoverLetter.txt';

export const loadText = async (filePath) => {
  const loader = new TextLoader(filePath);
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
