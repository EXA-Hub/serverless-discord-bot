#!/bin/bash
# Enhanced Discord Command Manager in Bash with Fixed Token Prompt

# Define color variables using $'…' syntax.
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
BLUE=$'\033[0;34m'
NC=$'\033[0m' # No Color

# Check for required dependencies.
command -v curl > /dev/null 2>&1 || {
  echo -e "${RED}curl مطلوب لكنه غير متوفر. إلغاء.${NC}" >&2
  exit 1
}
command -v jq > /dev/null 2>&1 || {
  echo -e "${RED}jq مطلوب لكنه غير متوفر. إلغاء.${NC}" >&2
  exit 1
}

# Startup message.
echo -e "${BLUE}بدأ واجهة التحكم لأوامر البوت...${NC}"

# Prompt for the bot token (masked) and app ID (visible).
read -rp "أدخل توكن البوت: " TOKEN
echo -e "${GREEN}توكن البوت: ${TOKEN}${NC}"
read -rp "أدخل أيدي البوت: " APP_ID
echo -e "${GREEN}أيدي البوت: ${APP_ID}${NC}"

# Function to create a new slash command.
create_command() {
  local name description payload response http_code body options_json add_opt opt_name opt_desc opt_type

  echo -e "\n${BLUE}دعنا ننشيء أمر جديد للبوت!${NC}"
  read -rp "أدخل اسم الامر: " name
  read -rp "أدخل وصف الامر: " description

  if [[ -z "$name" || -z "$description" ]]; then
    echo -e "${RED}خطأ: ادخل اسم ووصف الامر. لا تترك الحقول فارغة.${NC}"
    return 1
  fi

  read -rp "هل تريد اضافة خيارات أخرى للأمر? (نعم/لا): " add_opt
  options_json="[]"
  if [[ "$add_opt" == "نعم" ]]; then
    while true; do
      read -rp "أدخل اسم الخيار (أو إضغط إنتر لإلغاء العملية): " opt_name
      [[ -z "$opt_name" ]] && break
      read -rp "أدخل وصف الخيار: " opt_desc
      echo "الرجاء إدخال نوع الخيار الذي ترغب في استخدامه:"
      echo "1 - نصوص (مثل: اسم، رسالة)"
      echo "2 - أرقام (مثل: عدد، قيمة)"
      echo "3 - نصوص افتراضية (مثل: نعم أو لا)"
      echo "4 - رسالة (نوع الرسالة)"
      echo "5 - قناة (نوع القناة)"
      echo "6 - مستخدم (نوع مستخدم)"
      echo "7 - منطقي (Boolean) (مثل: نعم أو لا)"
      read -rp "أدخل نوع الخيار (الافتراضي 3 للنصوص): " opt_type
      opt_type=${opt_type:-3}
      options_json=$(echo "$options_json" | jq --arg name "$opt_name" --arg desc "$opt_desc" --argjson type "$opt_type" '. + [{name: $name, description: $desc, type: $type}]')
    done
  fi

  if [[ "$options_json" != "[]" ]]; then
    payload=$(jq -n --arg name "$name" --arg description "$description" --argjson options "$options_json" \
      '{name: $name, description: $description, options: $options}')
  else
    payload=$(jq -n --arg name "$name" --arg description "$description" \
      '{name: $name, description: $description}')
  fi

  echo -e "${YELLOW}Creating command '$name'...${NC}"
  response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bot $TOKEN" \
    -d "$payload" \
    "https://discord.com/api/v10/applications/$APP_ID/commands")

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [[ "$http_code" -eq 200 || "$http_code" -eq 201 ]]; then
    echo -e "${GREEN}الأمر '$name' تم انشاؤه بنجاح!${NC}"
    echo -e "${GREEN}المعلومات:${NC} $body"
  else
    echo -e "${RED}فشل في انشاء الأمر. HTTP code: $http_code${NC}"
    echo -e "${RED}المعلومات:${NC} $body"
  fi
}

# Function to retrieve all commands from Discord.
get_commands() {
  echo -e "\n${BLUE}جلب جميع الاوامر...${NC}"

  response=$(curl -s -X GET \
    -H "Content-Type: application/json" \
    -H "Authorization: Bot $TOKEN" \
    "https://discord.com/api/v10/applications/$APP_ID/commands")

  echo "$response" | jq .
}

# Function to delete a command from Discord.
delete_command() {
  echo -e "\n${YELLOW}جلب جميع الاوامر...${NC}"
  local commands cmd_id del_response
  commands=$(curl -s -X GET -H "Content-Type: application/json" -H "Authorization: Bot $TOKEN" \
    "https://discord.com/api/v10/applications/$APP_ID/commands")
  echo -e "${BLUE}معرف الأمر - إسم الأمر:${NC}"
  echo "$commands" | jq -r '.[] | "\(.id) - \(.name)"'
  read -rp "أدخل معرف الأمر لحذفه: " cmd_id
  if [[ -z "$cmd_id" ]]; then
    echo -e "${RED}معرف الأمر غير صحيح.${NC}"
    return 1
  fi
  del_response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
    -H "Content-Type: application/json" \
    -H "Authorization: Bot $TOKEN" \
    "https://discord.com/api/v10/applications/$APP_ID/commands/$cmd_id")
  if [[ "$del_response" -eq 204 ]]; then
    echo -e "${GREEN}تم حذف الأمر بنجاح.${NC}"
  else
    echo -e "${RED}فشل في حذف الأمر. HTTP code: $del_response${NC}"
  fi
}

# Main menu loop with extended options.
while true; do
  echo -e "\n${YELLOW}قائمة الخيارات:${NC}"
  echo -e "${BLUE}1. إنشاء أمر جديد"
  echo -e "2. جلب معلومات جميع الاوامر"
  echo -e "3. حذف أمر"
  echo -e "4. للخروج${NC}"
  read -rp "إختر أحد الخيارات: " option

  case $option in
    1)
      create_command
      ;;
    2)
      get_commands
      ;;
    3)
      delete_command
      ;;
    4)
      echo -e "${BLUE}جاري الخروج...${NC}"
      break
      ;;
    *)
      echo -e "${RED}خيار غير صحيح, أدخل رقم صحيح.${NC}"
      ;;
  esac
done
