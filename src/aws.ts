import {S3} from 'aws-sdk'
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config();

const s3 = new S3({
region:process.env.AWS_REGION,
accessKeyId:process.env.AWS_ACCESS_KEY_ID,
secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
}) 

export const uploadFile = async (fileName:string, localPath:string) => {
    if (!process.env.AWS_BUCKET_NAME) {
        console.log("AWS_BUCKET_NAME is not defined in environment variables.")
        throw new Error("AWS_BUCKET_NAME is not defined in environment variables.");
      }

      console.log(`Uploading: ${localPath} → S3 Bucket: ${process.env.AWS_BUCKET_NAME}, Key: ${fileName}`);
    const uploadParams = {
        Body:fs.createReadStream(localPath),
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:fileName
    }

    try {
        const data = await s3.upload(uploadParams).promise();
        console.log("Upload successful:", data.Location);
        return data.Location;
      } catch (err) {
        console.error("Upload failed:", err);
        throw err;
      }
}