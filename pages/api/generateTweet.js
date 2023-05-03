import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateTweet = async (req, res) => {
  const basePromptPrefix = `Does the following tweet posted by ${req.body.user} potentially contain potential biases or inaccuracies? If not, why not? If so, please describe what they could be:`;
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.input}`,
    temperature: 0.7,
    max_tokens: 400,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateTweet;