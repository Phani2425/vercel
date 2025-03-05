import express from "express";
import cors from 'cors';
import simpleGit from 'simple-git';
import { Generate } from "./utils";
import path from "path";
import fs from 'fs-extra'
import { getAllFilePath } from "./files";
import { uploadFile } from "./aws";
import {createClient} from 'redis'
const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/deploy', async (req, resp) => {
    try {
        const repoUrl = req.body.repoUrl;
        console.log('Starting deployment with repo:', repoUrl);
        
        const id = Generate();
        const outputPath = path.join(__dirname, `output/${id}`);
        
        await simpleGit().clone(repoUrl, outputPath);
        
        const files = await getAllFilePath(outputPath);
        // console.log('Found files:', files);
        
        await Promise.all(
            files.map(async (file) => {
                console.log(`Uploading ${file}...`);
                try {
                    await uploadFile(file.split('dist/')[1], file);
                    console.log(`Successfully uploaded: ${file}`);
                } catch (error) {
                    console.error(` Failed to upload: ${file}`, error);
                }
            })
        );

        console.log(' All files uploaded successfully.');
        // removing file from local after upload
        fs.removeSync(outputPath);
        //publishing the id where the files are uploaded inside output folder of bucket in s3
        await publisher.lPush("build-queue",id);
        await publisher.hSet("status",id,"uploaded");
        resp.status(200).json({ id });
    } catch (err) {
        console.error('Deployment error:', err);
        resp.status(500).json({
            success: false,
            error: err || 'Unknown error occurred'
        });
    }
});

app.get('/status',async(req,resp) => {
     const id = req.query.id as string;
     if(!id){
        console.log('no id present in query');
        resp.status(400).json({
            success:false,
            message:'no id found'
        })
        return;
     }

     try{
        const status = await subscriber.hGet("status",id);
        if (!status) {
            resp.status(404).json({
               success: false,
               message: 'deployment not found'
           });
           return;
       }
       
        resp.status(200).json({
           success: true,
           status:status
       });
       return;
     }catch(err){
        console.error('Error fetching status:', err);
        resp.status(500).json({
            success: false,
            error: 'Failed to fetch deployment status'
        });
        return;
     }

})

app.get('/', (req,resp) =>{
    console.log('server is up and running')
    resp.send(`server is running at port 3000`)
})
app.listen(3000);
