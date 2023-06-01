import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseOK, formatResponseError } from '@helpers';
import { OrderService, OrderStatusEnum } from 'src/order';
import { isUUID } from 'validator';

export const updateOrder = async (event: APIGatewayEvent) => {
  console.log(`Lambda updateOrder is invoked!`, event);
  try {
    const data: {
      delivery?: {
        type: string;
        address: any;
      };
      comments?: string;
      status?: OrderStatusEnum;
    } = JSON.parse(event.body);
    const { id: orderId } = event.pathParameters;
    const { delivery, comments, status } = data;

    if (!orderId || !isUUID(orderId)) console.error('Something went wrong! Case order id');
    if (delivery && delivery.type && typeof delivery.type !== 'string') console.error('Something went wrong! Case delivery type');
    if (comments && typeof comments !== 'string') console.error('Something went wrong! Case comments');
    if (status && !Object.keys(OrderStatusEnum).includes(status)) console.error('Something went wrong! Case status');
    if (!delivery && !comments && !status) console.error('Something went wrong! Case all data is not valid');

    const orderService = new OrderService();

    const order = await orderService.findById(orderId);
    if (!order) console.error('Something went wrong! Case does not exist');

    await orderService.update(orderId, {
      delivery: delivery ? JSON.stringify(delivery) : undefined,
      comments: comments || undefined,
      status: status || undefined,
    });

    return formatResponseOK();
  } catch (e) {
    return formatResponseError(e);
  }
};
