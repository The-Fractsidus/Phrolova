import { Client, Events } from "@fluxerjs/core";

const client = new Client({ intents: 0 });

client.on(Events.Ready, () => console.log("Ready!"));
client.on(Events.MessageCreate, async (m) => {
  if (m.content === "!ping") await m.reply("Pong");
});

await client.login(process.env.BOT_TOKEN);
