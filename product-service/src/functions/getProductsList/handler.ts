import { middyfy } from '@libs/lambda';
import * as AWS from "@aws-sdk/client-dynamodb";
import { formatJSONResponse } from '@libs/api-gateway';




// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse } from '@libs/api-gateway';
// import { middyfy } from '@libs/lambda';
// // import { mockData } from '../mock'
// // import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// // import { DynamoDB } from 'aws-sdk';
// // import * as AWS from "@aws-sdk/client-dynamodb";
// import { ddbClient } from '../../libs/ddbClient';
// import schema from '../schema';

// import { DeleteItemCommand, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
// import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';


// const scan = async () => {
//   const scanResults = await dynamo.scan({
//       TableName: 'products'
//   }).promise();
  
//   return scanResults;
// }

// import { GetCommand } from "@aws-sdk/lib-dynamodb";
// import { ddbClient } from "../../libs/ddbClient";

// Set the parameters.
// export const params = {
//   TableName: "products",
//   /*
//   Convert the key JavaScript object you are retrieving to the
//   required Amazon DynamoDB record. The format of values specifies
//   the datatype. The following list demonstrates different
//   datatype formatting requirements:
//   String: "String",
//   NumAttribute: 1,
//   BoolAttribute: true,
//   ListAttribute: [1, "two", false],
//   MapAttribute: { foo: "bar" },
//   NullAttribute: null
//    */
//   Key: {
//     primaryKey: "id", // For example, 'Season': 2.
//     sortKey: "title", // For example,  'Episode': 1; (only required if table has sort key).
//   },
// };


// @ts-ignore
const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  
  const params = {
    TableName: 'products',
    Select: 'ALL_ATTRIBUTES',
  };

  const client = new AWS.DynamoDB({ region: 'eu-west-1' });

  // const results = await client.listTables({});

  const results = await client.scan(params);

  return formatJSONResponse(results.Items.map((item: any) => ({
    id: item.id.S,
    title: item.title.S,
    description: item.description.S,
    price: item.price.S,
  })));





  // const client = new AWS.DynamoDB({ region: 'eu-west-1' });
  
  // const scanResults = await dynamo.scan({
  //   TableName: process.env.TABLE_NAME
  // }).promise();

  // const results = await client.listTables({});
  
  // return formatJSONResponse(results);

    // const data = await client.send(new GetCommand(params));
    // console.log("Success :", data);
    // console.log("Success :", data.Item);
    // return data;
    // return formatJSONResponse({ id: 'test' });
    
    

    // // const getAllProducts = async () => {
    //   try {
    //     const params = {
    //       TableName: process.env.TABLE_NAME
    //     };
      
    //   const { Items } = await ddbClient.send(new ScanCommand(params));

    //   return formatJSONResponse(Items); // (Items) ? Items.map((item) => unmarshall(item)) : {};
    //  } catch(e) {
    //   console.error(e);
    //   throw e;
    //   }
    // }



};

export const main = middyfy(getProductsList);


  // const scanResults = scan();
  
  // return scanResults;
  // return formatJSONResponse(mockData);
