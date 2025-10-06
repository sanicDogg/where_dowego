import { getCommandCallback, startButtons } from './commands.ts';
import { Bot, Context } from './deps.ts';
import { addRestaurant, removeRestaurant, stringifyRestaurants } from './restaurants.ts';
import { setUserState, userStates } from './userState.ts';
import { getKeyboard, getUserId, replyMessage, RETURN_BTN_TEXT } from './utils.ts';

function handleIdle(ctx: Context) {
  const text = String(ctx.message?.text);

  const runCommand = getCommandCallback(text);

  if (runCommand !== null) {
    runCommand(ctx);
    return;
  }

  replyMessage(ctx, 'Я пока не умею отвечать на такие сообщения');
}

function handleRemoving(ctx: Context) {
  const id = getUserId(ctx);
  const text = String(ctx.message?.text);

  if (checkIfReturn(ctx)) return;

  removeRestaurant(text);

  ctx.reply(`Удален ${text}.\nНовый список: ${stringifyRestaurants()}`, {
    reply_markup: getKeyboard(startButtons),
  });

  setUserState(id, 'idle');
}

function handleAdding(ctx: Context) {
  const id = getUserId(ctx);

  const rest = String(ctx.message?.text);
  addRestaurant(rest);
  ctx.reply(`Добавлен ${rest}.\nНовый список: ${stringifyRestaurants()}`, {
    reply_markup: getKeyboard(startButtons),
  });
  setUserState(id, 'idle');
}

function handleDefault(ctx: Context) {
  ctx.reply('Начните общаться с ботом с помощью /start');
}

export function setupHandlers(bot: Bot) {
  bot.on('message:text', (ctx) => {
    const state = userStates.get(getUserId(ctx));
    switch (state) {
      case 'idle':
        handleIdle(ctx);
        break;
      case 'removing': {
        handleRemoving(ctx);
        break;
      }
      case 'adding': {
        handleAdding(ctx);
        break;
      }
      default:
        handleDefault(ctx);
    }
  });
  bot.on('message:photo', (ctx) => ctx.reply('Nice photo! Is that you?'));
  bot.on(
    'edited_message',
    (ctx) =>
      ctx.reply('Ha! Gotcha! You just edited this!', {
        reply_parameters: { message_id: ctx.editedMessage.message_id },
      }),
  );
}

function checkIfReturn(ctx: Context): boolean {
  const id = getUserId(ctx);
  const text = String(ctx.message?.text);

  if (text === RETURN_BTN_TEXT) {
    setUserState(id, 'idle');
    ctx.reply('Ок. Оставим как есть', {
      reply_markup: getKeyboard(startButtons),
    });
    return true;
  }
  return false;
}
