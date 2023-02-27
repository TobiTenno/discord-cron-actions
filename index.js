import { Client, Intents } from 'discord.js';
import { CronJob } from 'cron';

// until assertions work
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let crons = require('./crons.json');
if (!crons) {
  crons = require('./config/crons.json')
}

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', console.error);

client.on('debug', (message) => {
  if (!/(Sending a heartbeat|Latency of|voice)/i.test(message)) {
    console.log(message);
  }
});

const makeJob = async ({ time, action, target, value }) => {
  const job = new CronJob(time, async () => {
    const channel = await client.channels.fetch(target);
    try {
      switch (action) {
        case 'clear':
          const messages = await channel.messages.fetch();
          console.info(`clearing ${target} :: ${channel.messages.cache.size}`);
          messages.forEach(message => {
            channel.messages.delete(message.id);
          });
          break;
        case 'message':
          console.info(`sending '${value}' to ${target}`);
          if (channel.type === 'GUILD_TEXT') await channel.send({ content: value });
          break;
        default:
          console.error(`no such action ${action}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, null, true, 'UTC');
  job.start();
  return job;
};

crons.forEach(makeJob);

client.login(process.env.TOKEN);
