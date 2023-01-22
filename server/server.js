import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Touristea!'
  })
})

app.post('/', async (req, res) => {
  try {
    const {message,currentModel} = req.body;
    console.log(currentModel);
    const response = await openai.createCompletion({
      model: `${currentModel}`,
      prompt: `${message}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1, 
      frequency_penalty: 0.5, 
      presence_penalty: 0, 
    });
    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})
app.get('/models',async (req,res)=> {
    const response = await openai.listEngines();
    res.json({
        models: response.data.data
    })
} )
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))