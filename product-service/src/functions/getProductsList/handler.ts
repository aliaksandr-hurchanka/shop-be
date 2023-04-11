import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
// import { mockData } from '../mock'
import { DynamoDB } from 'aws-sdk';
import schema from '../schema';


// const scan = async () => {
//   const scanResults = await dynamo.scan({
//       TableName: 'products'
//   }).promise();
  
//   return scanResults;
// }

// @ts-ignore
const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  
  const dynamo = new DynamoDB.DocumentClient();
  
  const scanResults = await dynamo.scan({
    TableName: process.env.TABLE_NAME
  }).promise();
  
  return scanResults.Items;
  
  // const scanResults = scan();
  
  // return scanResults;
  // return formatJSONResponse(mockData);
};

export const main = middyfy(getProductsList);
