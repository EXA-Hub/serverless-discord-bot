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
  if (!command) return { content: "Unknown command!" };
  return command.execute(interaction);
};

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Only POST requests are accepted",
    };
  }

  // Get the signature and timestamp from the headers
  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const body = event.body;

  if (!signature || !timestamp || !body) {
    return {
      statusCode: 401,
      body: "Missing signature or timestamp",
    };
  }

  // Verify the request
  try {
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(process.env.DISCORD_PUBLIC_KEY, "hex"),
    );

    if (!isVerified) {
      return {
        statusCode: 401,
        body: "Invalid signature",
      };
    }
  } catch (err) {
    console.error("Verification error:", err);
    return {
      statusCode: 401,
      body: "Invalid signature",
    };
  }

  // Parse the request body
  const interaction = JSON.parse(body);

  // Handle PING from Discord
  if (interaction.type === 1) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: 1 }),
    };
  }

  // Handle slash commands (type 2)
  if (interaction.type === 2) {
    const response = handleCommand(interaction);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: 4,
        data: response,
      }),
    };
  }

  return { statusCode: 400, body: "Unknown interaction type" };
};
