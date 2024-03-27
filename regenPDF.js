import { NEW_COVER_LETTER_PATH, loadText, saveContentToPDF } from './utils.js';

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
