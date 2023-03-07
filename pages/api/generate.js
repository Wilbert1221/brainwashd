import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Q:
  1. source? 
  2. title? 
  3. author? 
  4. Can you tell me if the link contains potential biases or inaccuracies?: https://edition.cnn.com/2023/03/07/politics/trump-desantis-ukraine-2024-campaign CNN|Trump and DeSantis discussed possible 2024 campaign help from Ukraine|Eric Bradner|This article does not contain any obvious potential biases or inaccuracies. It provides a factual account of the alleged call between then-President Donald Trump and then-Governor Ron DeSantis discussing possible 2024 campaign help from Ukraine. The article does not contain any opinionated language or subjective judgments. CNN is typically a reputable news source and this article cites multiple other sources. The article also provides opposing opinions and other sources that could provide a more balanced perspective. Therefore, it is unlikely that the article contains potential biases or inaccuracies.
  Q:
  1. source? 
  2. title? 
  3. author? 
  4. Can you tell me if the link contains potential biases or inaccuracies?:`;

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 400,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;