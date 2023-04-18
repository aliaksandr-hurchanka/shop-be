import { middyfy } from '@libs/lambda';
import * as AWS from "@aws-sdk/client-dynamodb";
import { formatJSONResponse } from '@libs/api-gateway';

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
};

export const main = middyfy(getProductsList);
