import express, { response } from "express";
import cors from 'cors';
import simpleGit from 'simple-git';
import { Generate } from "./utils";
import path from "path";
import { getAllFilePath } from "./files";

const app = express();
app.use(cors());
app.use(express.json());

app.post('/deploy', async (req,resp)=>{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = Generate();
    await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`));
    const files = await getAllFilePath(path.join(__dirname,`output/${id}`))
    console.log('files:-',files);
    // put this to s3 and whatever id you get from there then send that back to te user
    resp.status(200).json({
        success:true,
        id:id
    });
})

app.get('/', (req,resp) =>{
    console.log('server is up and running')
    resp.send(`server is running at port 3000`)
})
app.listen(3000);
