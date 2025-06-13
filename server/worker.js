import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {CharacterTextSplitter} from "langchain/text_splitter";
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import 'dotenv/config';
const worker = new Worker(
    'file-upload-queue', 
    async(job)=>{
         console.log(`job:`,job.data);
        const data = JSON.parse(job.data);
        
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
         console.log(`docs`,docs);
   const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey:process.env.GEMINI_KEY
});
    const splitter = new CharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
    });
        
        const splitDocs = await splitter.splitDocuments(docs);
        console.log("splitDocs length:", splitDocs.length);
       try {
        const test = await embeddings.embedQuery("Hello world");
        console.log("Embedding success:", test.length);
        } catch (err) {
            console.error("Embedding failed:", err);
        }
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "gemini-test",
        }
        );

    await vectorStore.addDocuments(splitDocs);
     console.log("vectorstore added");
    },
    {concurrency:100 , connection: { host: 'localhost', port: 6379 }}
);

