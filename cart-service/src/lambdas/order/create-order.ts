import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseOK, formatResponseError } from '@helpers';
import { isUUID } from 'validator';
import { OrderRequest, OrderService, OrderStatusEnum } from 'src/order';

export const createOrder = async (event: APIGatewayEvent) => {
  console.log(`Lambda createOrder was started!`, event);
  
  try {
    const data: OrderRequest = JSON.parse(event.body);
    const { userId, cartId, payment, delivery, comments, status, total } = data;

    if (!userId || !isUUID(userId)) console.error('Something went wrong! Case userId');
    if (!cartId || !isUUID(cartId)) console.error('Something went wrong! Case cartId');
    if (!payment) console.error('Something went wrong! Case payment');
    if (!payment.type || typeof payment.type !== 'string') console.error('Something went wrong! Case payment type');
    if (!delivery) console.error('Something went wrong! Case delivery');
    if (!delivery.type || typeof delivery.type !== 'string') console.error('Something went wrong! Case delivery type');
    if (!delivery.address) console.error('Something went wrong! Case delivery address');
    if (!comments || typeof comments !== 'string') console.error('Something went wrong! Case comments');
    if (!status || !Object.keys(OrderStatusEnum).includes(status)) console.error('Something went wrong! Case status');
    if (!total || typeof total !== 'number') console.error('Something went wrong! Case total');

    const orderService = new OrderService();
    const order = await orderService.create({
      user_id: userId,
      cart_id: cartId,
      payment: JSON.stringify(payment),
      delivery: JSON.stringify(delivery),
      comments,
      status,
      total,
    });

    return formatResponseOK({ order }, 201);
  } catch (e) {
    return formatResponseError(e);
  }
};
