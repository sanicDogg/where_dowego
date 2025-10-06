import { Bot, Context, Keyboard } from './deps.ts';
import { getRandomRestaurant, restaurants, stringifyRestaurants } from './restaurants.ts';
import { setUserState } from './userState.ts';
import { getChatId, getKeyboard, getUserId, reportMessage, RETURN_BTN_TEXT } from './utils.ts';

type BotCommand = {
  id: string;
  callback: CommandCallback;
  buttonText?: string;
};

const botCommands: BotCommand[] = [
  {
    id: 'start',
    callback: startCommand,
  },
  {
    id: 'get',
    callback: getCommand,
    buttonText: 'Получить заведение',
  },
  {
    id: 'list',
    callback: listCommand,
    buttonText: 'Список заведений',
  },
  {
    id: 'add',
    callback: addCommand,
    buttonText: 'Добавить заведение',
  },
  {
    id: 'remove',
    callback: removeCommand,
    buttonText: 'Удалить заведение',
  },
  {
    id: 'poll',
    callback: pollCommand,
    buttonText: 'Создать опрос',
  },
];

export function getCommandById(id: string): CommandCallback | null {
  const command = botCommands.find((cmd) => cmd.id === id);
  if (command) {
    return command.callback;
  }
  return null;
}

export function getCommandCallback(buttonText: string): CommandCallback | null {
  const command = botCommands.find((cmd) => cmd.buttonText === buttonText);
  if (command) {
    return command.callback;
  }
  return null;
}

export const startButtons = botCommands.filter((cmd) => cmd.buttonText).map((cmd) =>
  cmd.buttonText as string
);

type CommandCallback = (ctx: Context) => void;

const commandMap = new Map<string, CommandCallback>(
  botCommands.map((cmd) => [cmd.id, cmd.callback]),
);

export function startCommand(ctx: Context) {
  reportMessage('/start', ctx);
  const id = getUserId(ctx);
  setUserState(id, 'idle');
  ctx.reply('На сегодня у нас: ' + getRandomRestaurant(), {
    reply_markup: getKeyboard(startButtons),
  });
}

export function listCommand(ctx: Context) {
  reportMessage('/list', ctx);
  ctx.reply('Заведения в базе: ' + stringifyRestaurants());
}

export function addCommand(ctx: Context) {
  reportMessage('/add', ctx);
  const id = getUserId(ctx);
  ctx.reply('Укажите название заведения', {
    reply_markup: new Keyboard().add(RETURN_BTN_TEXT),
  });
  setUserState(id, 'adding');
}

export function removeCommand(ctx: Context) {
  reportMessage('/remove', ctx);
  const id = getUserId(ctx);

  ctx.reply('Что будем исключать?', {
    reply_markup: getKeyboard(restaurants).add(RETURN_BTN_TEXT),
  });
  setUserState(id, 'removing');
}

export function pollCommand(ctx: Context) {
  const id = getChatId(ctx);
  ctx.api.sendPoll(
    id,
    'Куда пойдем сегодня:',
    restaurants,
    {
      is_anonymous: false,
      allows_multiple_answers: true,
      type: 'regular',
    },
  );
}

export function getCommand(ctx: Context) {
  reportMessage('/get', ctx);
  const id = getUserId(ctx);

  setUserState(id, 'idle');
  ctx.reply(getRandomRestaurant(), {
    reply_markup: getKeyboard(startButtons),
  });
}

export function setupCommands(bot: Bot) {
  for (const [command, callback] of commandMap) {
    bot.command(command, callback);
  }
}
