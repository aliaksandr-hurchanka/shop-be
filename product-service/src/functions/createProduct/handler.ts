import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
// import { ApiError } from 'src/utils/apiErrors';
import { create } from '../../utils/validatiuon';
import { v4 } from 'uuid';
// import { StatusCode } from '../../utils/enums/statusCode.enum'
import * as AWS from 'aws-sdk';

AWS.config.update({ region: 'eu-west-1' });

const ddbDocumentClient = new AWS.DynamoDB.DocumentClient();

const createProduct = async (event) => {
  try {

    console.log(event.body);

    await create.body.validateAsync(event.body);
  }
  catch (err) {
    return null // new ApiError(err, StatusCode.BAD_REQUEST)
  }

  const resultData = await createProductItem(event.body);

  return formatJSONResponse(resultData);
};

const createProductItem = async (body) => {
  const productId = v4();

  try {
    await ddbDocumentClient.transactWrite({
      TransactItems: [
        {
          Put: {
            Item: {
              id: productId,
              title: body.title,
              price: body.price,
              description: body.description
            },
            TableName: 'products'
          },
        },
        {
          Put: {
            Item: {
              product_id: productId,
              count: body.count
            },
            TableName: 'stock'
          },
        }
      ],
    }).promise();

    return { ...body, id: productId };

  } catch (error) {
    return error;
  }
}

export const main = middyfy(createProduct);
