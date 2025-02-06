# بوت ديسكورد بدون خادم

بوت ديسكورد يعمل على منصة Netlify باستخدام الدوال بدون خادم (Serverless Functions).

## المميزات

- أوامر بسيطة (`ping`, `hello`, `roll`)
- تكامل مع منصة Netlify
- تحقق من صحة طلبات Discord
- تنفيذ سريع وموثوق
- نشر تلقائي مع كل تحديث للكود

## المتطلبات الأساسية

- حساب Discord Developer
- حساب Netlify
- Node.js v16 أو أحدث
- npm v7 أو أحدث

## خطوات الإعداد

### 1. إعداد تطبيق Discord

1. انتقل إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. أنشئ تطبيقاً جديداً
3. احفظ `APPLICATION_ID` و `BOT_TOKEN`
4. قم بتمكين "MESSAGE CONTENT INTENT"
5. احصل على `PUBLIC_KEY` من قسم الأمان

### 2. إعداد المشروع محلياً

```bash
# استنساخ المشروع
git clone https://github.com/EXA-Hub/serverless-discord-bot-netlify.git
cd serverless-discord-bot-netlify

# تثبيت اعتماديات المشروع
npm install

# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول إلى Netlify
netlify login

# ربط المشروع بموقع Netlify
netlify init

# تشغيل المشروع محلياً للتطوير
netlify dev
```

### 3. نشر المشروع على Netlify

```bash
# نشر المشروع يدوياً
netlify deploy --prod

# إعداد المتغيرات البيئية
netlify env:set DISCORD_PUBLIC_KEY your-public-key
netlify env:set DISCORD_TOKEN your-bot-token

# عرض المتغيرات البيئية الحالية
netlify env:list
```

يمكنك أيضاً إعداد المتغيرات البيئية من لوحة تحكم Netlify:

1. انتقل إلى إعدادات المشروع
2. اختر "Build & deploy" > "Environment"
3. أضف المتغيرات التالية:
   - `DISCORD_PUBLIC_KEY`
   - `DISCORD_TOKEN`

### 4. تسجيل أوامر البوت

1. نفذ الأمر:

```bash
bash ./setupCommadns.sh
```

2. إتبع التعليمات لإضافة الأوامر للبوت

### 5. تكوين Discord Interactions Endpoint

1. احصل على رابط وظيفة Netlify:

```bash
netlify sites:list
```

2. الصق الرابط (`https://[your-site].netlify.app/.netlify/functions/discord`) في "Interactions Endpoint URL" في إعدادات تطبيق Discord

## أوامر Netlify المفيدة

```bash
# عرض سجلات الوظائف
netlify functions:logs

# اختبار الوظائف محلياً
netlify functions:serve

# نشر وظيفة محددة
netlify functions:deploy discord

# عرض معلومات المشروع
netlify status

# فتح لوحة تحكم المشروع في المتصفح
netlify open
```

## هيكل المشروع

```shell
.
├── functions/
│   └── discord.js      # معالج الأوامر الرئيسي
├── setupCommands.sh    # سكريبت تسجيل الأوامر
├── netlify.toml       # إعدادات Netlify
├── package.json      # تبعيات المشروع
└── README.md        # توثيق المشروع
```

## حل المشاكل الشائعة

- إذا فشل النشر، تحقق من سجلات البناء:

```bash
netlify build --debug
```

- للتحقق من حالة الوظائف:

```bash
netlify functions:list
```

## المساهمة

نرحب بالمساهمات! يرجى اتباع هذه الخطوات:

1. عمل fork للمشروع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing-feature`)
3. عمل commit للتغييرات (`git commit -m 'Add amazing feature'`)
4. رفع التغييرات (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت MIT. انظر ملف `LICENSE` للمزيد من التفاصيل.
