import { createHandyClient } from 'handy-redis';
import Logger from '../Logger';

const LOG = new Logger('redis.ts');

const { REDIS_HOST = 'localhost', REDIS_PORT = '6379' } = process.env;

const RedisClient = createHandyClient({
  host: REDIS_HOST,
  port: +REDIS_PORT
});

RedisClient.redis.on('connect', () => LOG.info('Redis is connected'));

export enum RedisKeyType {
  AUTHENTICATION_LIST,
  AUTHENTICATION_SET
}

export const getRedisKey = (type: RedisKeyType, uniqueIdentifier: string | number) => {
  switch (type) {
    case RedisKeyType.AUTHENTICATION_LIST:
      return `${uniqueIdentifier}-authentication-list`;
    case RedisKeyType.AUTHENTICATION_SET:
      return `${uniqueIdentifier}-authentication-set`;
    default:
      return uniqueIdentifier.toString();
  }
};

export default RedisClient;
