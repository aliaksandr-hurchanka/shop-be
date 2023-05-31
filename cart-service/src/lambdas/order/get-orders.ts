import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseError, formatResponseOK } from '@helpers';
import { OrderService } from 'src/order';

export const getOrders = async (event: APIGatewayEvent) => {
  console.log(`Lambda getOrders was started!`, event);
  
  try {
    const orderService = new OrderService();
    const orders = await orderService.findAll();
    return formatResponseOK(orders);
  } catch (e) {
    return formatResponseError(e);
  }
};
