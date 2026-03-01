import { Client, Events, EmbedBuilder, PermissionFlags } from "@fluxerjs/core";
import {} from "dotenv/config";

const client = new Client({ intents: 0 });
const logs = process.env.LOGS_CHANNEL_ID;

client.on(Events.Ready, async () => {
  if (logs) {
    await client.channels.send(
      logs,
      `<@&1477711796422300999> [LOG|ready] Bot has started and is ready for use`,
    );
  } else {
    console.log(`[LOG|ready] Bot has started and is ready for use`);
  }
});

async function getMemberPerms(message) {
  const guild =
    message.guild ?? (await message.client.guilds.resolve(message.guildId));
  if (!guild) return null;
  const member =
    guild.members.get(message.author.id) ??
    (await guild.fetchMember(message.author.id));
  return member?.permissions ?? null;
}

client.on(Events.MessageCreate, async (message) => {
  const perms = await getMemberPerms(message);
  if (
    message.content === "-verify" &&
    perms.has(PermissionFlags.Administrator)
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Verification")
      .setDescription(
        "React to the ✅ to get verified and access to all our channels.",
      )
      .setColor("#FF4747")
      .setFooter({ text: "Phrolova" })
      .setTimestamp();

    const reply = await message.reply({ embeds: [embed] });
    await reply.react("✅");
  } else {
    return;
  }
});

client.on(
  Events.MessageReactionAdd,
  async (reaction, user, messageId, channelId, emoji, userId) => {
    if (
      reaction.emoji.name === "✅" &&
      reaction.channelId === process.env.VERIFY_CHANNEL_ID
    ) {
      const roleId = process.env.VERIFY_ROLE_ID;
      if (!roleId) return;

      const guild = client.guilds.get(reaction.guildId);
      const member = await guild.fetchMember(reaction._data.user_id);
      if (member && !member.roles.cache.has(roleId)) {
        await member.roles.add(roleId);
        if (logs) {
          await client.channels.send(
            logs,
            `<@&1477711796422300999> [LOG|verify] User <@${reaction._data.user_id}> verified`,
          );
        } else {
          console.log(
            `[LOG|verify] User <@${reaction._data.user_id}> verified`,
          );
        }
      }
    }
  },
);

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Error: Set BOT_TOKEN");
  process.exit(1);
}

client.login(token).catch((err) => {
  console.error("Login failed:", err);
  process.exit(1);
});
