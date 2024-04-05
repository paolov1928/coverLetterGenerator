import { NEW_COVER_LETTER_PATH } from './utilities/filePaths.js';
import { loadText, saveContentToPDF } from './utilities/general.js';

const main = async () => {
  try {
    const txt = await loadText(NEW_COVER_LETTER_PATH);
    const { pageContent } = txt[0];
    saveContentToPDF(NEW_COVER_LETTER_PATH, pageContent);
  } catch (error) {
    console.error('Error in PDF regen:', error);
  }
};

main();
