import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateContext = async (req, res) => {
  
  const text = `This report: ${req.body.report} analyzed this news article ${req.body.input} for misinformation, bias and inaccuracy. Please provide a numbered list of articles and reports with links that are neutral, informative peer reviewed and can help clarify and correct the misinformation or provide context:`;
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: text,
    temperature: 0.7,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateContext;