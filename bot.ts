import { Bot } from './deps.ts';
import { logger } from './logger.ts';
import { setupCommands } from './commands.ts';
import { setupHandlers } from './handlers.ts';
import { setupScheduler } from './utils.ts';
import { config } from './config.ts';

const chat_id = config.CHAT_ID;
const token = config.BOT_TOKEN;

// Create bot object
const bot = new Bot(token);

setupCommands(bot);
setupHandlers(bot);

logger.info('Холодный старт:');
// Launch!
await bot.init();
bot.start();
logger.info(bot.botInfo);

setupScheduler(bot, chat_id);
