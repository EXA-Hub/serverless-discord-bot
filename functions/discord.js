// functions/discord.js
const nacl = require("tweetnacl");

// Command definitions
const commands = {
  ping: {
    name: "ping",
    execute: () => ({ content: "Pong! 🏓" }),
  },
  hello: {
    name: "hello",
    execute: (interaction) => ({
      content: `Hello ${interaction.member.user.username}! 👋`,
    }),
  },
  roll: {
    name: "roll",
    execute: () => ({
      content: `🎲 You rolled: ${Math.floor(Math.random() * 6) + 1}`,
    }),
  },
};

// Command handler
const handleCommand = (interaction) => {
  const command = commands[interaction.data.name];
  console.log(interaction);
  if (!command) return { content: "Unknown command!" };
  return command.execute(interaction);
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const body = event.body;

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, "hex"),
    Buffer.from(process.env.DISCORD_PUBLIC_KEY, "hex")
  );

  if (!isVerified) return { statusCode: 401 };

  const interaction = JSON.parse(body);

  // Handle PING
  if (interaction.type === 1) {
    console.log("PING received");
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
    };
  }

  // Handle commands
  if (interaction.type === 2) {
    const response = handleCommand(interaction);
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 4,
        data: response,
      }),
    };
  }

  return { statusCode: 400 };
};
