import { APIGatewayEvent } from 'aws-lambda';
import { throwError, formatResponseError, formatResponseOK } from '@helpers';
import { isUUID } from 'validator';
import { CartController } from 'src/cart/cart.controller';
import { Cart, CartService } from 'src/cart';
import { OrderService } from 'src/order';
import { AppRequest } from 'src/shared';

const validate = (data: Cart) => {
  const { id, items } = data;
  if (!id || !isUUID(id)) console.error('Something went wrong! Case data.id');
  if (!items || !items.length) console.error('Something went wrong! Case data.items');
  
  items.forEach(item => {
    const { product, count } = item;
    
    if (!product) console.error('Something went wrong! Case data.items.product');
    if (!count || typeof count !== 'number') console.error('Something went wrong! Case data items count');

    const { id: productId, title, description, price } = product;
    
    if (!productId || !isUUID(productId)) console.error('Something went wrong! Case product.id');
    if (!title || typeof title !== 'string') console.error('Something went wrong! Case product.title');
    if (!description || typeof description !== 'string') console.error('Something went wrong! Case description');
    if (!price || typeof price !== 'number') console.error('Something went wrong! Case price');
  });
};

export const updateUserCart = async (event: APIGatewayEvent) => {
  console.log(`Lambda updateUserCart is invoked!`, event);
  try {
    const { userId } = event.pathParameters;
    
    if (!isUUID(userId)) console.error('Something went wrong! Case userId');
    
    const data: Cart = JSON.parse(event.body);

    validate(data);

    const cartController = new CartController(
      new CartService(),
      new OrderService(),
    );

    const { data: res } = await cartController.updateUserCart(
      {
        user: {
          id: userId,
        },
      } as AppRequest,
      data,
    );

    return formatResponseOK(res);
  } catch (e) {
    return formatResponseError(e);
  }
};
