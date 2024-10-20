import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { KMSClient, EncryptCommand } from "@aws-sdk/client-kms";
import { APIGatewayProxyHandler } from "aws-lambda";

const ddbClient = new DynamoDBClient({});
const kmsClient = new KMSClient({});
const tableName = process.env.TABLE_NAME!;
const kmsKeyId = process.env.KMS_KEY_ID!;

export const lambdaHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { id, sensitiveData } = body;

    if (!id || !sensitiveData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "id and sensitiveData are required" }),
      };
    }

    // Encrypt sensitive data using KMS
    const encryptCommand = new EncryptCommand({
      KeyId: kmsKeyId,
      Plaintext: Buffer.from(sensitiveData),
    });
    const encryptResponse = await kmsClient.send(encryptCommand);

    // Store encrypted data in DynamoDB
    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: id },
        encryptedData: { B: encryptResponse.CiphertextBlob! },
      },
    });
    await ddbClient.send(putItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data stored successfully" }),
    };
  } catch (error) {
    console.error("Error storing data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to store data" }),
    };
  }
};

import {GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DecryptCommand } from "@aws-sdk/client-kms";
// import { APIGatewayProxyHandler } from "aws-lambda";

// const ddbClient = new DynamoDBClient({});
// const kmsClient = new KMSClient({});
// const tableName = process.env.TABLE_NAME!;

export const decryptHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "id is required" }),
      };
    }

    // Retrieve the encrypted data from DynamoDB
    const getItemCommand = new GetItemCommand({
      TableName: tableName,
      Key: {
        id: { S: id },
      },
    });
    const getItemResponse = await ddbClient.send(getItemCommand);

    if (!getItemResponse.Item || !getItemResponse.Item.encryptedData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Data not found" }),
      };
    }

    // Decrypt the encrypted data using KMS
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: getItemResponse.Item.encryptedData.B as Uint8Array,
    });
    const decryptResponse = await kmsClient.send(decryptCommand);
    // const decryptedData = decryptResponse.Plaintext?.toString("utf-8");
    const decryptedData = new TextDecoder("utf-8").decode(decryptResponse.Plaintext);

    return {
      statusCode: 200,
      body: JSON.stringify({ id, sensitiveData: decryptedData }),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch data" }),
    };
  }
};
