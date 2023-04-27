import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { getSignedUrl } from "../../helpers";

// @ts-ignore
const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: APIGatewayProxyEvent) => {
  const { name } = event.queryStringParameters;

  try {
    const url = await getSignedUrl(name);

    return formatJSONResponse(200, { url });
  } catch (err) {
    return formatJSONResponse(500, err);
  }
};

export const main = middyfy(importProductsFile);
