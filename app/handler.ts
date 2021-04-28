
import { Handler, Context } from 'aws-lambda';
import { MessageUtil } from './utils/message';
import { Configuration, UsersApi, ChannelsApi } from '@cotalker/cotalker-api';
import dotenv from 'dotenv';
import path from 'path';
const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

export async function sendMessage (event: any, context: Context) {
  const config = new Configuration({ accessToken: process.env.TOKEN });
  const channelApi = new ChannelsApi(config, process.env.BASE_URL);
  const usersApi = new UsersApi(config, process.env.BASE_URL);

  console.log('ENVIRONMENT: ', JSON.stringify(process.env, null, 2));
  console.log('EVENT: ', event);
  console.log('CONTEXT: ', context);

  const channels = await channelApi.getChannelsId({ id: event.body });
  const users = await usersApi.getUsers({ id: channels.data.data.userIds});    

  return MessageUtil.success(users.data.data.users.map(x => `${x.name.names} ${x.name.lastName} !`));
};
