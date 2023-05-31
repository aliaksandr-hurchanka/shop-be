import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseOK, formatResponseError } from '@helpers';
import { UsersService } from 'src/users';
import { isEmail } from 'validator';

export const createUser = async (event: APIGatewayEvent) => {
  console.log(`Lambda createUser was started!`, event);
  try {
    const data = JSON.parse(event.body);
    const { name, email, password } = data;

    if (!name || typeof name !== 'string') console.error('Something went wrong! Case not valid name');
    if (!password || typeof password !== 'string') console.error('Something went wrong! Case not valid password');
    if (email && !isEmail(email)) console.error('Something went wrong! Case not valid email');

    const usersService = new UsersService();
    const userId = await usersService.createOne({ name, email, password });
    return formatResponseOK({ message: `User ${userId} was created` }, 201);
  } catch (e) {
    return formatResponseError(e);
  }
};