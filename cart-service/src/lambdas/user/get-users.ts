import { APIGatewayEvent } from 'aws-lambda';
import { formatResponseError, formatResponseOK } from '@helpers';
import { UsersService } from 'src/users';

export const getUsers = async (event: APIGatewayEvent) => {
  console.log(`Lambda getUsers is invoked!`, event);
  try {
    const usersService = new UsersService();
    const users = await usersService.findAll();
    return formatResponseOK(users);
  } catch (e) {
    return formatResponseError(e);
  }
};
