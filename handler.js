"use strict";
import S3 from "aws-sdk/clients/s3.js";
import fetch from "node-fetch";

export async function picture(event) { 

const response = {
isBase64Encoded: false,
statusCode: 200,
body: JSON.stringify({message: "Success"}),

}
  try {
    const parsedBody = JSON.parse(event.body.image_url)
    const data = await fetch(parsedBody);
    const buffer = await data.arrayBuffer();
    const stringifiedBuffer = Buffer.from(buffer).toString("base64");
    const contentType = data.headers.get("content-type");
    const imageBas64 = `data:image/${contentType};base64,${stringifiedBuffer}`;
    await S3
      .putObject({
        Bucket: process.env.BUCKET,
        Key: event.key,
        Body: imageBas64,
      })
      .promise();

    response.body = { message: "Successfully uploaded file to S3" };
  } catch (e) {
    console.error(e);
    response.body = { message: "File failed to upload", errorMessage: e };
    response.statusCode = 500;
  }

  return response;
}
