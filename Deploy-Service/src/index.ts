import {commandOptions, createClient} from 'redis'
import { downloadS3Folder, deployProject } from './aws';
import { buildProject } from './utils';
import path from 'path'
import fs from 'fs-extra'
import dotenv from "dotenv";
dotenv.config();

const subscriber = createClient();
subscriber.connect();

async function main(){
    while(1){
      try{
        const response = await subscriber.brPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        );
        console.log(response);
        const id = response?.element;
        await downloadS3Folder(`${id}`);
        await buildProject(path.join(__dirname,`output/${id}`));
        await deployProject(path.join(__dirname,`output/${id}/build`));
        // removing the folder from local
        // console.log(`removing the folder having path :- ${path.join(__dirname,`output/${id}`)} from local`)
        // fs.removeSync(path.join(__dirname,`output/${id}`));
        console.log(`deploy url:- http://${process.env.AWS_BUCKET_NAME}.s3-website-${process.env.AWS_REGION}.amazonaws.com/output/${id}/build/index.html`);
      }catch(err){
        if(err instanceof Error){
            console.log(err.message);
        }else{
            console.log('unknown error occured', err);
        }
      }
    }
}

main();