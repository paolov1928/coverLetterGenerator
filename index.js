import fs from 'fs';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { openai } from './openai.js';
import {
  NEW_COVER_LETTER_PATH,
  COVER_LETTER_PATH,
  RESUME_PATH,
  JOB_SPEC_PATH,
  loadText,
  saveContentToPDF,
} from './utils.js';

const loadPDF = async (filePath) => {
  const loader = new PDFLoader(filePath);
  return await loader.load();
};

const loadExistingDocuments = async () => {
  const coverLetterText = await loadText(COVER_LETTER_PATH);
  const resumeText = await loadPDF(RESUME_PATH);
  const jobSpecText = await loadText(JOB_SPEC_PATH);
  return { coverLetterText, resumeText, jobSpecText };
};

const createContextString = (coverLetterText, resumeText, jobSpec) => {
  const stringifyObject = (obj) => JSON.stringify(obj[0]);
  const contextComponents = [
    `Existing Cover Letter: ${stringifyObject(coverLetterText)}`,
    `Resume: ${stringifyObject(resumeText)}`,
    `Job Specification: ${stringifyObject(jobSpec)}`,
  ];
  return contextComponents.join('\n');
};

const generateCoverLetterText = async (
  coverLetterText,
  resumeText,
  jobSpec
) => {
  const context = createContextString(coverLetterText, resumeText, jobSpec);
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a helpful AI assistant that generates personalized cover letters.'
          All of the files to be used are in the following context.
          Context: ${context}
          `,
      },
      {
        role: 'user',
        content: `Hi, please generate me a new cover letter that has the same format as Existing Cover Letter.
          It can use information from the Resume. Please prioritise recent experience. 
          It should be relevant to Job Specification using the information from there. Emphasise any skills mentioned in the resume that are also in the job specification.`,
      },
    ],
  });
  return response.choices[0].message.content;
};

const saveCoverLetterToFile = (content, filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('Existing file deleted:', filePath);
  }

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing new cover letter:', err);
    } else {
      console.log(`New cover letter written to ${filePath}`);
    }
  });

  saveContentToPDF(filePath, content);
};

const main = async () => {
  try {
    const { coverLetterText, resumeText, jobSpecText } =
      await loadExistingDocuments();

    const newCoverLetterText = await generateCoverLetterText(
      coverLetterText,
      resumeText,
      jobSpecText
    );

    console.log('New Cover Letter:\n\n', newCoverLetterText);

    saveCoverLetterToFile(newCoverLetterText, NEW_COVER_LETTER_PATH);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
