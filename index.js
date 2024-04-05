import fs from 'fs';
import { openai } from './openai.js';
import {
  createContextString,
  loadExistingDocuments,
} from './utilities/coverLetterUtils.js';
import { NEW_COVER_LETTER_PATH } from './utilities/filePaths.js';
import { saveContentToPDF } from './utilities/general.js';

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
