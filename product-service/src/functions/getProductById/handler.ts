import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { mockData } from '../mock';

import schema from '../schema';
import { IData } from '@functions/getProductsList/types';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters || {};
  // @ts-ignore
  return formatJSONResponse(mockData.find((item: IData) => item.id === productId) || { status: 200, message: 'Product is not found!' });
};

export const main = middyfy(getProductById);
