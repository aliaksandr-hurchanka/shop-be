import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseError, formatResponseOK } from '@helpers';
import { isUUID } from 'validator';
import { OrderService } from 'src/order';

export const getOrder = async (event: APIGatewayEvent) => {
  console.log(`Lambda getOrder was started!`, event);
  try {
    const { id } = event.pathParameters;
    if (!isUUID(id)) console.error('Something went wrong! Case not valid Id');

    const orderService = new OrderService();
    const user = await orderService.findById(id);

    return formatResponseOK(user);
  } catch (e) {
    return formatResponseError(e);
  }
};