import { COVER_LETTER_PATH, RESUME_PATH, JOB_SPEC_PATH } from './filePaths.js';
import { loadPDF, loadText } from './general.js';

export const loadExistingDocuments = async () => {
  const coverLetterText = await loadText(COVER_LETTER_PATH);
  const resumeText = await loadPDF(RESUME_PATH);
  const jobSpecText = await loadText(JOB_SPEC_PATH);
  return { coverLetterText, resumeText, jobSpecText };
};

export const createContextString = (coverLetterText, resumeText, jobSpec) => {
  const stringifyObject = (obj) => JSON.stringify(obj[0]);
  const contextComponents = [
    `Existing Cover Letter: ${stringifyObject(coverLetterText)}`,
    `Resume: ${stringifyObject(resumeText)}`,
    `Job Specification: ${stringifyObject(jobSpec)}`,
  ];
  return contextComponents.join('\n');
};
