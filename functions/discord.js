const nacl = require("tweetnacl");
const axios = require("axios");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405 };

  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const body = event.body;

  try {
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(process.env.DISCORD_PUBLIC_KEY, "hex"),
    );

    if (!isVerified) {
      return { statusCode: 401, body: "Invalid signature" };
    }
  } catch (err) {
    console.error("Verification error:", err);
    return { statusCode: 401, body: "Invalid signature" };
  }

  const interaction = JSON.parse(body);

  // Handle commands with deferred response
  if (interaction.type === 2) {
    axios
      .post(event.rawUrl.replace("discord", "followup"), {
        interaction,
      })
      .catch(console.error);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: 5, // Deferred response with "thinking" state
      }),
    };
  }

  // Handle PING
  if (interaction.type === 1)
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: 1 }),
    };

  return { statusCode: 400, body: "Unknown interaction type" };
};
