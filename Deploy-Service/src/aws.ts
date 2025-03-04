import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs-extra";
import dotenv from "dotenv";
import { getContentType } from "./utils";
dotenv.config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function downloadS3Folder(prefix: string) {
  try {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Prefix: `output/${prefix}`,
    };
    const data = await s3.listObjectsV2(params).promise();

    // console.log(`data we got form listing the folder: -${prefix}`, data);

    if (data.Contents && data.Contents.length > 0) {
      for (const file of data.Contents) {
        if (file.Key) {
          await downloadFile(file.Key);
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log("error occured while fetching folder:- ", err.message);
    } else {
      console.log("unknown error occured while fetching object list", err);
    }
  }
}

const downloadFile = async (key: string) => {
  try {
    const localFilePath = path.join(__dirname, key);
    // console.log("we will download the file into path:-", localFilePath);

    //but before downloading we need to ensure that the dir path exist for thee file otherwise where will we save it
    // because when we do createWriteSync then we pass the :- the path where the file will get saved as first argument and the data as the second argumanet
    // and if the file is already there then the content will get overwritten but if the file is not there then the file will get cerated first then data will get saved
    // but issue arises if the folder itself is not there so we will ensure that first

    await fs.ensureDir(path.dirname(localFilePath)); //ensures that the dir present as path.dirname gives the dir path of a path

    const params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    };
    const data = await s3.getObject(params).promise();

    fs.writeFileSync(localFilePath, data.Body as Buffer);
    // console.log(`Downloaded: ${localFilePath}`);
  } catch (err) {
    if (err instanceof Error) {
      console.log("error occured while downloading file:- ", err.message);
    } else {
      console.log("unknown error occured", err);
    }
  }
};

export const deployProject = async (buildPath: string) => {
  try{
    const files = fs.readdirSync(buildPath);
    for (const file of files) {
      const absPath = path.join(buildPath, file);
      if (fs.statSync(absPath).isDirectory()) {
        deployProject(absPath);
      } else {
        const fileContent = fs.readFileSync(absPath);
        const params = {
          Bucket:process.env.AWS_BUCKET_NAME! ,
          Key:absPath.split('dist/')[1],
          Body:fileContent,
          ContentType:getContentType(file)
        }

        const data = await s3.upload(params).promise();
        console.log('upload successfull:- ',data);
      }
    }
  }catch (err) {
    if (err instanceof Error) {
      console.log("error occured while uploading build file:- ", err.message);
    } else {
      console.log("unknown error occured while uploading build file", err);
    }
  }
};
