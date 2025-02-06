curl -X POST \
-H "Authorization: Bot {{{{{{{{{{{{{{YOUR_BOT_TOKEN}}}}}}}}}}}}}}" \
-H "Content-Type: application/json" \
https://discord.com/api/v10/applications/YOUR_APP_ID/commands \
-d '{
  "name": "ping",
  "description": "Replies with Pong!",
  "type": 1
}'