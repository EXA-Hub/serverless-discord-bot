# بوت ديسكورد بدون خادم

بوت ديسكورد يعمل على منصة Netlify باستخدام الدوال بدون خادم (Serverless Functions).

## المميزات

- أوامر بسيطة (`ping`, `hello`, `roll`)
- تكامل مع منصة Netlify
- تحقق من صحة طلبات Discord
- تنفيذ سريع وموثوق

## المتطلبات الأساسية

- حساب Discord Developer
- حساب Netlify
- Node.js مثبت على جهازك

## خطوات الإعداد

### 1. إعداد تطبيق Discord

1. انتقل إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. أنشئ تطبيقاً جديداً
3. احفظ `APPLICATION_ID` و `BOT_TOKEN`
4. قم بتمكين "MESSAGE CONTENT INTENT"
5. احصل على `PUBLIC_KEY` من قسم الأمان

### 2. إعداد المشروع محلياً

```bash
git clone https://github.com/EXA-Hub/serverless-discord-bot-netlify.git
cd serverless-discord-bot-netlify
npm install
```

### 3. نشر المشروع على Netlify

1. قم بربط المستودع مع Netlify
2. أضف المتغيرات البيئية التالية:
   - `DISCORD_PUBLIC_KEY`
   - `DISCORD_TOKEN`

### 4. تسجيل أوامر البوت

1. عدّل ملف `setupCommands.sh`:
   - استبدل `YOUR_BOT_TOKEN`
   - استبدل `YOUR_APP_ID`
2. نفذ الأمر:

```bash
chmod +x setupCommands.sh
./setupCommands.sh
```

### 5. تكوين Discord Interactions Endpoint

1. انسخ رابط وظيفة Netlify (`https://[your-site].netlify.app/.netlify/functions/discord`)
2. الصق الرابط في "Interactions Endpoint URL" في إعدادات تطبيق Discord

## الأوامر المتاحة

- `/ping` - يرد البوت بـ "Pong! 🏓"
- `/hello` - يرحب البوت بالمستخدم
- `/roll` - يرمي نرد افتراضي (1-6)

## هيكل المشروع

```
.
├── functions/
│   └── discord.js      # معالج الأوامر الرئيسي
├── setupCommands.sh    # سكريبت تسجيل الأوامر
└── netlify.toml       # إعدادات Netlify
```

## المساهمة

نرحب بالمساهمات! يرجى إنشاء fork للمشروع وتقديم pull request.

## الترخيص

هذا المشروع مرخص تحت MIT.
