import { Client, Events } from "@fluxerjs/core";
import {} from "dotenv/config";

const client = new Client({ intents: 0 });

client.on(Events.Ready, () => console.log("Ready!"));
client.on(Events.MessageCreate, async (m) => {
  if (m.content === "!ping") await m.reply("Pong");
});

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("Error: Set BOT_TOKEN");
  process.exit(1);
}

client.login(token).catch((err) => {
  console.error("Login failed:", err);
  process.exit(1);
});
