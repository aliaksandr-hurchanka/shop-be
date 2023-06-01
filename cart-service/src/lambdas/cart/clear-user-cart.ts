import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseError, formatResponseOK } from '@helpers';
import { isUUID } from 'validator';
import { CartController } from 'src/cart/cart.controller';
import { CartService } from 'src/cart';
import { OrderService } from 'src/order';
import { AppRequest } from 'src/shared';

export const clearUserCart = async (event: APIGatewayEvent) => {
  console.log(`Lambda clearUserCart was started!`, event);
  
  try {
    const { userId } = event.pathParameters;
    if (!isUUID(userId)) console.error('Something went wrong! Case userId');

    const cartController = new CartController(
      new CartService(),
      new OrderService(),
    );

    await cartController.clearUserCart({
      user: {
        id: userId,
      },
    } as AppRequest);

    return formatResponseOK();
  } catch (e) {
    return formatResponseError(e);
  }
};
