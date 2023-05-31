import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseError, formatResponseOK } from '@helpers';
import { isUUID } from 'validator';
import { CartController } from 'src/cart/cart.controller';
import { CartService } from 'src/cart';
import { OrderService } from 'src/order';
import { AppRequest } from 'src/shared';

const validate = ({ comments, paymentType, deliveryType, deliveryAddress }) => {
  if (!comments || typeof comments !== 'string') console.error('Something went wrong! Case 1');
  if (!paymentType || typeof paymentType !== 'string') console.error('Something went wrong! Case 2');
  if (!deliveryType || typeof deliveryType !== 'string') console.error('Something went wrong! Case 3');
  if (!deliveryAddress || typeof deliveryAddress !== 'string') console.error('Something went wrong! Case 4');
};

export const checkout = async (event: APIGatewayEvent) => {
  console.log(`Lambda was started!`, event);
  try {
    const { userId } = event.pathParameters;
    if (!userId || !isUUID(userId)) console.error('Something went wrong! Case 5');
    const data: {
      comments: string;
      paymentType: string;
      paymentAddress?: any;
      paymentCreditCard?: any;
      deliveryType: string;
      deliveryAddress: string;
    } = JSON.parse(event.body);
    validate(data);

    const cartController = new CartController(
      new CartService(),
      new OrderService(),
    );

    const { data: res } = await cartController.checkout(
      {
        user: {
          id: userId,
        },
      } as AppRequest,
      {
        comments: data.comments,
        payment: JSON.stringify({
          type: data.paymentType,
          address: data.paymentAddress,
          creditCard: data.paymentCreditCard,
        }),
        delivery: JSON.stringify({
          type: data.deliveryType,
          address: data.deliveryAddress,
        }),
      },
    );

    return formatResponseOK(res);
  } catch (e) {
    return formatResponseError(e);
  }
};
