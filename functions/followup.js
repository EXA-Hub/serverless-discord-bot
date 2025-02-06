const axios = require("axios");

// Simulate a heavy task
const simulateHeavyTask = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return "Task completed!";
};

// Command definitions
const commands = {
  ping: {
    name: "ping",
    execute: async () => {
      await simulateHeavyTask();
      return { content: "بينج بونج! 🏓" };
    },
  },
  hello: {
    name: "hello",
    execute: async (interaction) => {
      await simulateHeavyTask();
      return {
        content: `مرحبا ${interaction.member.user.username}! 👋`,
      };
    },
  },
  // roll: {
  //   name: "roll",
  //   execute: async () => {
  //     await simulateHeavyTask();
  //     return {
  //       content: `🎲 لعبت دورك: ${Math.floor(Math.random() * 6) + 1}`,
  //     };
  //   },
  // },
};

// Send a follow-up message to Discord
const sendFollowUp = async (application_id, token, response) => {
  const webhookUrl = `https://discord.com/api/v10/webhooks/${application_id}/${token}`;

  try {
    await axios.post(webhookUrl, response, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  } catch (error) {
    console.error(
      "Error sending follow-up:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Command handler
const handleCommand = async (interaction) => {
  const command = commands[interaction.data.name];
  if (!command) return { content: "أمر غير معروف!" };
  return await command.execute(interaction);
};

// Process the command asynchronously
const processCommand = async ({ interaction }) => {
  try {
    const response = await handleCommand(interaction);
    await sendFollowUp(interaction.application_id, interaction.token, {
      ...response,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing command:", error);
    await sendFollowUp(interaction.application_id, interaction.token, {
      headers: {
        "Content-Type": "application/json",
      },
      content: "An error occurred while processing your command.",
    });
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };
  const interaction = JSON.parse(event.body);
  console.log("Received interaction:", interaction);
  try {
    await processCommand(interaction);
    return { statusCode: 200 };
  } catch (error) {
    console.error("Error processing command:", error);
    return { statusCode: 500 };
  }
};
