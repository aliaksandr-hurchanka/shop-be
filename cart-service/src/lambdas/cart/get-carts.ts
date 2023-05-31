import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseError, formatResponseOK } from '@helpers';
import { CartService } from 'src/cart';

export const getCarts = async (event: APIGatewayEvent) => {
  console.log(`Lambda getCarts was started`, event);
  
  try {
    const cartService = new CartService();
    const orders = await cartService.findAll();
    return formatResponseOK(orders);
  } catch (e) {
    return formatResponseError(e);
  }
};
