import { logger } from './logger.ts';
import { Bot, Context, Keyboard } from './deps.ts';
import { getRandomRestaurant } from './restaurants.ts';
import { config } from './config.ts';

export const RETURN_BTN_TEXT = 'Назад';

function replyError(ctx: Context, errorMessage?: string): void {
  const defaultErrorMessage = 'Произошла неизвестная ошибка. Попробуйте еще раз';
  const text = errorMessage || defaultErrorMessage;
  ctx.reply(text);
}

export function replyMessage(ctx: Context, message: string): void {
  ctx.reply(message);
}

export function getUserId(ctx: Context): number {
  const invalidId = -1;
  const id = ctx.message?.from.id;
  if (!id) {
    replyError(ctx);
    return invalidId;
  }
  return id;
}

export function getChatId(ctx: Context): number {
  const invalidId = -1;
  const id = ctx.chat?.id;
  if (!id) {
    replyError(ctx);
    return invalidId;
  }
  return id;
}

export function reportMessage(text: string, ctx: Context): void {
  if (!ctx.message || !ctx.message.from) {
    return;
  }
  const { id, first_name, last_name, username } = ctx.message.from;
  logger.debug(
    `${id} ${first_name} ${last_name} @${username}: ${text}`,
  );
}

export function getKeyboard(entities: string[]): Keyboard {
  const keyboard = new Keyboard();

  entities.forEach((ent, i) => {
    keyboard.text(ent);

    if ((i + 1) % 2 === 0) {
      keyboard.row();
    }
  });

  return keyboard;
}

function runAtMoscowTime(hour: number, minute: number, callback: () => void) {
  const MSK_OFFSET = 3 * 60; // UTC+3 → 180 минут
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;

  const target = new Date(utc + MSK_OFFSET * 60_000);
  target.setHours(hour, minute, 0, 0);

  // если уже прошло сегодня — переносим на завтра
  if (target.getTime() < utc + MSK_OFFSET * 60_000) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - (utc + MSK_OFFSET * 60_000);
  logger.info(
    `Следующий запуск через ${(delay / 1000 / 60).toFixed(1)} минут (${target})`,
  );

  setTimeout(() => {
    callback();
    runAtMoscowTime(hour, minute, callback);
  }, delay);
}

export function setupScheduler(bot: Bot, chatId: number) {
  logger.info('Установка таймера...');
  const hours = config.DAILY_HOUR;
  const minutes = config.DAILY_MINUTE;

  runAtMoscowTime(hours, minutes, () => {
    bot.api.sendMessage(chatId, getRandomRestaurant());
  });
}
