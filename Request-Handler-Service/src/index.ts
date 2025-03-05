import express from 'express'
import {S3} from 'aws-sdk'
import dotenv from 'dotenv'
import { getContentType } from './utils';
dotenv.config();
import cors from 'cors'

const app = express();
app.use(cors({
    credentials:true
}))

const s3 = new S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY ,
    region:process.env.AWS_REGION
})

app.get('/*/index.html', async (req,resp) => {
    console.log('req path:-', req.path)
    const id = req.path.split('/')[1];
    const filepath = req.path.split(`/${id}`)[1];
    
    const params = {
        Bucket:process.env.AWS_BUCKET_NAME!,
        Key:`output/${id}/build${filepath}`
    }

    try{
        console.log('trrying to access file from key:- ', `output/${id}/build${filepath}`)

        const data = await s3.getObject(params).promise();
    
        // if we send the response without setting proper header then browser will download the file instead of required action such as rendering for html file,rendering for css file ,execution for js file and proper linking of assets like images etc
        resp.setHeader('content-type', getContentType(filepath));
        resp.send(data.Body);
    }catch (error) {
        console.error('Error retrieving file:', error);
        resp.status(404).send('File not found');
    }
})

app.get('/*', async (req, resp): Promise<void> => {
    // Serve a generic manifest or try to determine the session from the Referer header
    const referer = req.headers.referer;
    console.log('referer:- ',referer)
    let id;
    
    if (referer) {
        const match = referer.match(/\/([^\/]+)\/index\.html/);
        id = match && match[1];
    }
    
    if (!id) {
        resp.status(404).send('Not found');
        return;
    }
    let filepath = req.path;
    const params = {
        Bucket:process.env.AWS_BUCKET_NAME!,
        Key:`output/${id}/build${filepath}`
    }
    
    try {
        console.log('trying to access file from key:- ', `output/${id}/build${filepath}`)
        const data = await s3.getObject(params).promise();
        resp.setHeader('content-type', getContentType(filepath));
        resp.send(data.Body);
    } catch (error) {
        console.error('Error retrieving file:', error);
        resp.status(404).send('File not found');
    }
    

});

app.listen(3001);