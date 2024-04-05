# coverLetterGenerator

Generates a unique new cover letter using the openAI api.

## Files needed

Requires a .env with your OPENAI_API_KEY

Requires three docs an existing cover letter, resume and job specification

./localFiles/existingCoverLetter.txt'
'./localFiles/resume.pdf'
'./localFiles/jobspec.txt'

These files are included in the gitignore so as not to leak these to the repo.

## Index

Run:
$ node index.js $

This will generate a new cover letter based on the three files above.
Both a txt and a pdf file are generated.

## Chat

Run:
$ node chat.js $

This will generate a chat where the AI will answer based on the three files above.

## RegenPDF

Used if manually tweaking the output from openAI. I.e. after a manual change to newCoverLetter.txt

Run:
$ node regenPDF.js $

This will regenerate the pdf file based on the ./localFiles/newCoverLetter.txt file.

## FrontEnd Masters

This project was inspired by the openAI course on Front End Masters. Great course would recommend!
