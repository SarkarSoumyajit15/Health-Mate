import Redis from "ioredis"
import dotenv from "dotenv"
dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_NODE_URL);
export default redis;
// redis.set('foo', 'bar');