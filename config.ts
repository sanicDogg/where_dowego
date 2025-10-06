import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';

const env = await load();

interface Config {
  BOT_TOKEN: string;
  CHAT_ID: number;
  DAILY_HOUR: number;
  DAILY_MINUTE: number;
}

export const config: Config = {
  BOT_TOKEN: env.BOT_TOKEN ?? (() => {
    throw new Error('BOT_TOKEN не задан');
  })(),
  CHAT_ID: env.CHAT_ID ? Number(env.CHAT_ID) : (() => {
    throw new Error('GROUP_ID не задан');
  })(),
  DAILY_HOUR: env.DAILY_HOUR ? Number(env.DAILY_HOUR) : 11,
  DAILY_MINUTE: env.DAILY_MINUTE ? Number(env.DAILY_MINUTE) : 55,
};
