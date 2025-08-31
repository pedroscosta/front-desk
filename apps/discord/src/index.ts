import "./env";

import type { InferLiveObject } from "@live-state/sync";
import type { schema } from "api/schema";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { ulid } from "ulid";
import { store } from "./lib/live-state";
import { getOrCreateWebhook } from "./utils";

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
    await new Promise((resolve) => setTimeout(resolve, 150)); // TODO debug this issue
  } else {
    const thread = Object.values((store.thread as any).get()).find(
      (t: any) => t.discordChannelId === message.channel.id
    ) as InferLiveObject<(typeof schema)["thread"]> | undefined;

    if (!thread) return;
    threadId = thread.id;
  }

  console.info("Thread ID:", threadId);
  if (!threadId) return;

  store.message.insert({
    id: ulid().toLowerCase(),
    threadId,
    author: message.author.username,
    content: message.content,
    createdAt: message.createdAt,
    origin: "discord",
    externalMessageId: message.id,
  });
  console.info("Message inserted:", message);
});

store.message.subscribe(async () => {
  const threads = store.thread.get() as Record<
    string,
    InferLiveObject<typeof schema.thread>
  >;

  const messages = Object.values(
    store.message.get() as Record<
      string,
      InferLiveObject<typeof schema.message>
    >
  ).filter(
    (m) => threads[m.threadId]?.discordChannelId && !m.externalMessageId
  );

  console.info("Messages to send:", messages);

  for (const message of messages) {
    const channelId = threads[message.threadId]!.discordChannelId!;

    console.info("Channel ID:", channelId);

    if (!channelId) continue;

    const channel = client.guilds.cache
      .values()
      .next()
      ?.value?.channels.cache.get(channelId);
    console.info("Channel:", channel);
    if (!channel) continue;

    try {
      const webhookClient = await getOrCreateWebhook(channel as TextChannel);
      const webhookMessage = await webhookClient.send({
        content: message.content,
        threadId: channel.id,
        username: message.author,
        // avatarURL: message.author.displayAvatarURL(),
      });
      store.message.update(message.id, {
        externalMessageId: webhookMessage.id,
      });
    } catch (error) {
      console.error("Error sending webhook message:", error);
    }
  }
});

client.login(token).catch(console.error);
