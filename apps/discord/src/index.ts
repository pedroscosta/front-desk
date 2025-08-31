import "./env";

import { Client, GatewayIntentBits } from "discord.js";
import { ulid } from "ulid";
import { store } from "./lib/live-state";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
  ],
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("DISCORD_TOKEN is not defined in environment variables");
  process.exit(1);
}

store.message.subscribe(() => {
  console.info(store.message.get());
});

// client.once("ready", async () => {
//   if (!client.user) return;
//   console.log(`Logged in as ${client.user.tag}`);

//   // Set up webhooks for all text channels in all guilds
//   for (const [guildId, guild] of client.guilds.cache) {
//     try {
//       console.log(`Setting up webhooks for server: ${guild.name} (${guildId})`);

//       // Get all text channels
//       const channels = guild.channels.cache.filter(
//         (c): c is TextChannel =>
//           c.type === ChannelType.GuildText &&
//           c.viewable &&
//           guild.members.me?.permissionsIn(c).has("ManageWebhooks") === true
//       );

//       // Create webhooks for each channel
//       for (const channel of channels.values()) {
//         try {
//           await getOrCreateWebhook(channel);
//           console.log(`  ✓ Webhook ready for #${channel.name}`);
//         } catch (error) {
//           console.error(
//             `  ✗ Failed to set up webhook for #${channel.name}:`,
//             error
//           );
//         }
//       }
//     } catch (error) {
//       console.error(`Error setting up webhooks for guild ${guildId}:`, error);
//     }
//   }
// });

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

const THREAD_CREATION_THRESHOLD_MS = 1000;

client.on("messageCreate", async (message) => {
  // Skip if message is not in a thread or from a bot
  if (!message.channel.isThread() || message.author.bot) return;

  const isFirstMessage =
    Math.abs(
      (message.channel.createdTimestamp ?? 0) - (message.createdTimestamp ?? 0)
    ) < THREAD_CREATION_THRESHOLD_MS;

  let threadId: string | null = null;

  if (isFirstMessage) {
    threadId = ulid().toLowerCase();
    store.thread.insert({
      id: threadId,
      organizationId: "01k32j4wwzyh3v6q56wr255jy7",
      name: message.channel.name,
      createdAt: new Date(),
      discordChannelId: message.channel.id,
    });
  }

  // Example: Respond to a specific message using webhook

  // try {
  // const webhookClient = await getOrCreateWebhook(message.channel);
  // await webhookClient.send({
  //   content: `Pong! 🏓 (from ${message.author.username})`,
  //   threadId: message.channel.isThread() ? message.channel.id : undefined,
  //   username: message.author.username,
  //   avatarURL: message.author.displayAvatarURL(),
  // });
  // } catch (error) {
  //   console.error("Error sending webhook message:", error);
  //   // Fallback to regular message if webhook fails
  //   await message.reply(`Pong! 🏓 (from ${message.author.username})`);
  // }

  if (!threadId) return;

  store.message.insert({
    id: ulid().toLowerCase(),
    threadId,
    author: message.author.username,
    content: message.content,
    createdAt: message.createdAt,
    origin: "discord",
    originalMessageId: message.id,
  });
});

client.login(token).catch(console.error);
