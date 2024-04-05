import 'dotenv/config';
import readline from 'node:readline';
import { openai } from './openai.js';
import {
  loadExistingDocuments,
  createContextString,
} from './utilities/coverLetterUtils.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message;
};

const formatMessage = (userInput) => ({ role: 'user', content: userInput });

const commonInstructions = `
Responses should be formulated using information from the candidate's resume. 
Focus on recent experiences and skills relevant to the job specifications. 
Ensure that the responses directly address the questions asked, emphasizing any skills mentioned in the resume that are pertinent to the inquiry.`;

export const chat = (context) => {
  const history = [
    {
      role: 'system',
      content: `You are a helpful AI assistant that helps candidates during an interview process.'
          All of the files to be used are in the following context.
          Context: ${context}
          ${commonInstructions}
          `,
    },
    {
      role: 'user',
      content: `Hi, please answer my (the candidate) questions.`,
    },
  ];
  const start = () => {
    rl.question('You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      const userMessage = formatMessage(userInput);
      const response = await newMessage(history, userMessage);

      history.push(userMessage, response);
      console.log(`\n\nAI: ${response.content}\n\n`);
      start();
    });
  };

  start();
  console.log('\n\nAI: How can I help you today?\n\n');
};

const main = async () => {
  console.log("Chatbot initialized. Type 'exit' to end the chat.");
  try {
    const { coverLetterText, resumeText, jobSpecText } =
      await loadExistingDocuments();

    const context = createContextString(
      coverLetterText,
      resumeText,
      jobSpecText
    );
    return chat(context);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
