import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    S3Client,
  } from "@aws-sdk/client-s3";
  import { S3Event } from "aws-lambda";
  import { parse } from "csv-parse";
  import { Readable } from "stream";
  import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from "@libs/api-gateway";

const processObject = async (client: S3Client, bucketName: string, record: any) => {
    const results = [];

    const objectName = record.s3.object.key;
    const pathToObject = `${bucketName}/${objectName}`;
    const newObjectPath = objectName.replace("uploaded", "parsed");

    const command = { Bucket: bucketName, Key: objectName };
    const copyCommand = { Bucket: bucketName, CopySource: pathToObject, Key: newObjectPath };
    const readableStream = (await client.send(new GetObjectCommand(command))).Body as Readable;

    readableStream
        .pipe(parse())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            console.log("results: ", results);
        });

    await client.send(new CopyObjectCommand(copyCommand));
    await client.send(new DeleteObjectCommand(command));
}

const importFileParser = async (event: S3Event) => {
    try {
        console.log(`Parser invoked with event: ${JSON.stringify(event)}`);

        const records = event.Records;
        const bucketName = process.env.S3_BUCKET_NAME;
        const client = new S3Client({ region: 'eu-west-1' });

        await Promise.all(records.map(record => processObject(client, bucketName, record)));

        return formatJSONResponse(200, { message: "File was parsed and uploaded to folder" });
    } catch (error) {
        return formatJSONResponse(500, { error });
    }

};
  
export const main = middyfy(importFileParser);