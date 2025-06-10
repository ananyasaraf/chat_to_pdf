import express from 'express'
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { OpenAI } from 'openai';
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import 'dotenv/config';
const app = express();

const client = new OpenAI({ 
  baseURL: 'https://openrouter.ai/api/v1',
  
  apiKey:process.env.openrouter_apiKey,
  configuration: {
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:8000',
      'X-Title': 'PDF-RAG',
    },
  },
});
console.log("hello",client);
const queue = new Queue('file-upload-queue',{
    connection: { host: 'localhost', port: 6379 }});


    
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null ,`${uniqueSuffix}-${file.originalname}`);
        },
    });


const upload = multer({storage:storage});


app.use(cors());
app.get('/',(req,res)=>{
    return res.json({status:'All Good!!'});
});

app.post('/upload/pdf',upload.single('pdf'),(req,res)=>{
    queue.add('file-ready',JSON.stringify({
        filename: req.file.originalname,
        destination: req.file.destination,
        path: req.file.path,
    }

    ));
    return res.json({message :'uploaded'});
});



app.get('/chat', async(req,res)=>{
    try{
      console.log(req.query.message);
    const userQuery = req.query.message;
    const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey:process.env.gemini_apiKey
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
              url: "http://localhost:6333",
              collectionName: "gemini-test",
              embeddings,
            });
    const ret =vectorStore.asRetriever({k:2});
const docs = await ret.invoke(userQuery);
const  SYSTEM_PROMPT = `You are a helpful assistant who answer the user query based on available context from the PDF file. 
Context:
${JSON.stringify(docs)}
If you don't know the answer, just say that you don't know, don't try to make up an answer.`;


const chatResult  =  await client.chat?.completions?.create({
  model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
  messages: [
    
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userQuery },
  ],
});
    console.log("AI response",chatResult);
  const chatResponse = chatResult.choices?.[0]?.message?.content|| "No response from AI";
  console.log(chatResponse);
    const replyText = chatResponse;
    
    return res.json({ message: replyText, chatResponse });
}
catch(err){
        console.error("Error in /chat:", err.message);
    return res.status(500).json({ error: err.message });
}
});
app.listen(8000, () => {
    console.log(`Server is running on http://localhost:8000`);
});