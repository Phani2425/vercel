import express, { response } from "express";
import cors from 'cors';
import simpleGit from 'simple-git';
import { Generate } from "./utils";
import path from "path";
import { getAllFilePath } from "./files";
import { uploadFile } from "./aws";
import {createClient} from 'redis'
const publisher = createClient();
publisher.connect();

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
                    await uploadFile(file.split('output/')[1], file);
                    console.log(`Successfully uploaded: ${file}`);
                } catch (error) {
                    console.error(` Failed to upload: ${file}`, error);
                }
            })
        );

        console.log(' All files uploaded successfully.');

        publisher.lPush("build-queue",id);

        resp.status(200).json({ id });
    } catch (err) {
        console.error('Deployment error:', err);
        resp.status(500).json({
            success: false,
            error: err || 'Unknown error occurred'
        });
    }
});

app.get('/', (req,resp) =>{
    console.log('server is up and running')
    resp.send(`server is running at port 3000`)
})
app.listen(3000);
