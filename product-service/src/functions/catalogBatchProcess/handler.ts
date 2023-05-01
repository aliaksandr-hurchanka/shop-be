// import * as AWS from "@aws-sdk/client-dynamodb";
import * as AWS from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';

interface CatalogBatchProcessEvent extends APIGatewayEvent {
    Records: {
        body: string;
    }[];
}

const catalogBatchProcess = async (event: CatalogBatchProcessEvent): Promise<void> => {
    const DynamoDBClient = new AWS.DynamoDB.DocumentClient();
    
    const SNSClient = new AWS.SNS({
        region: 'eu-west-1',
    });

    try {
        await Promise.all(
            event.Records.map(async record => {
                const product = JSON.parse(record.body);

                const {
                    id,
                    title,
                    description,
                    price,
                    count
                } = product;

                await DynamoDBClient.put({
                    TableName: 'products',
                    Item: {
                        id: Number(id),
                        title: String(title),
                        description: String(description),
                        price: Number(price)
                    },
                }).promise();

                await DynamoDBClient.put({
                    TableName: 'stock',
                    Item: {
                        product_id: Number(id),
                        count: Number(count)
                    },
                }).promise();

                await SNSClient.publish({
                    Subject: 'New product was created',
                    Message: JSON.stringify(product),
                    TopicArn: process.env.SNS_TOPIC_CREATE_PRODUCT,
                }).promise();
            })
        )
    } catch(error) {
        console.error(error);
    }

  // @ts-ignore
//   return formatJSONResponse({ status: 200, message: 'Success!' });
};

export const main = middyfy(catalogBatchProcess);
