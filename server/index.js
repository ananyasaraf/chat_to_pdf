import express from 'express'
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";

import path from 'path';
import { json } from 'stream/consumers';
const app = express();

const client = new GoogleGenerativeAI({apiKey:'AIzaSyC6XegVLncmX_BL9TbtekPkpDy1RXtBVBo'});
const model = client.getGenerativeModel({model:"gemini-001"});
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
    const userQuery = "what skill are there in this pdf";//req.query.messsage;
    const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey:'AIzaSyC6XegVLncmX_BL9TbtekPkpDy1RXtBVBo',
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
${JSON.stringify(result)}
If you don't know the answer, just say that you don't know, don't try to make up an answer.`;


const chatResult  =  model.startChat({
    messages: [
        {
            role: "user",
            parts: userQuery,
        }],
        systemInstruction: SYSTEM_PROMPT,
});

    const chatResponse = await chat.sendMessage(userQuery);
    const replyText = chatResponse.response.text();

    return res.json({ message: replyText, docs });
}
catch(err){
        console.error("Error in /chat:", err.message);
    return res.status(500).json({ error: err.message });
}
});
app.listen(8000, () => {
    console.log(`Server is running on http://localhost:8000`);
});