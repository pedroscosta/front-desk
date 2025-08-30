import { Client, GatewayIntentBits } from "discord.js";
import "./env";
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

store.message.subscribe(() => {
  console.info(store.message.get());
});

// // Map to store webhook clients for each channel
// const webhookClients = new Map<string, WebhookClient>();

// /**
//  * Gets or creates a webhook for a specific channel
//  */
// async function getOrCreateWebhook(
//   channel: TextChannel | ThreadChannel
// ): Promise<WebhookClient> {
//   // Check if we already have a webhook client for this channel
//   const existingWebhook = webhookClients.get(channel.id);
//   if (existingWebhook) {
//     return existingWebhook;
//   }

//   try {
//     // For threads, get the parent channel
//     const targetChannel = "parent" in channel ? channel.parent : channel;
//     if (!targetChannel || !(targetChannel instanceof TextChannel)) {
//       throw new Error("Could not get parent text channel for thread");
//     }

//     // Check if there's a webhook we can use
//     const webhooks = await targetChannel.fetchWebhooks();
//     let webhook = webhooks.find((w) => w.owner?.id === channel.client.user?.id);

//     // If no webhook exists, create one
//     if (!webhook) {
//       webhook = await targetChannel.createWebhook({
//         name: "Front Desk Bot",
//         avatar: channel.client.user?.displayAvatarURL(),
//         reason: "Auto-created webhook for thread management",
//       });
//     }

//     const webhookClient = new WebhookClient({ url: webhook.url });
//     webhookClients.set(channel.id, webhookClient);
//     return webhookClient;
//   } catch (error) {
//     console.error(
//       `Error getting/creating webhook for channel ${channel.id}:`,
//       error
//     );
//     throw error;
//   }
// }

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

// client.on("error", (error) => {
//   console.error("Discord client error:", error);
// });

// // Login to Discord with your client's token
//
// if (!token) {
//   console.error("DISCORD_TOKEN is not defined in environment variables");
//   process.exit(1);
// }

// // Listen for new threads
// client.on("threadCreate", async (thread) => {
//   console.log(`New thread created: ${thread.name} (${thread.id})`);
//   // Join the thread automatically
//   await thread.join();
//   console.log(`Joined thread: ${thread.name}`);
// });

// // Listen for messages in threads
// client.on("messageCreate", async (message) => {
//   // Skip if message is not in a thread or from a bot
//   if (!message.channel.isThread() || message.author.bot) return;

//   console.log(
//     `New message in thread ${message.channel.name} (${message.channel.id}):`
//   );
//   console.log(`  Author: ${message.author.tag}`);
//   console.log(`  Content: ${message.content}`);

//   // Example: Respond to a specific message using webhook
//   if (message.content.toLowerCase() === "ping") {
//     try {
//       const webhookClient = await getOrCreateWebhook(message.channel);
//       await webhookClient.send({
//         content: `Pong! 🏓 (from ${message.author.username})`,
//         threadId: message.channel.isThread() ? message.channel.id : undefined,
//         username: message.author.username,
//         avatarURL: message.author.displayAvatarURL(),
//       });
//     } catch (error) {
//       console.error("Error sending webhook message:", error);
//       // Fallback to regular message if webhook fails
//       await message.reply(`Pong! 🏓 (from ${message.author.username})`);
//     }
//   }
// });

client.login(token).catch(console.error);
