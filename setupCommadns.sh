#!/bin/bash
TOKEN="YOUR_BOT_TOKEN"
APP_ID="YOUR_APP_ID"

###########################
#  لا تنسى حذفهم قبل الرفع  #
###########################

curl -X POST \
-H "Content-Type: application/json" \
-H "Authorization: Bot $TOKEN" \
"https://discord.com/api/v10/applications/$APP_ID/commands" \
-d '{
  "name": "ping",
  "description": "Replies with Pong!"
}'