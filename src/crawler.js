const fs = require("fs");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;

// کانال‌هایی که باید جستجو شوند
const CHANNELS = [
  "Tasnimnews",
  "yjcnewschannel",
  "nasimonline",
  "alalamfa"
];

// کلیدواژه‌های نظامی (ترکیبی: عمومی + ایرانی + بین‌المللی)
const MILITARY_KEYWORDS = [
  // عمومی
  "جنگ","درگیری","حمله","عملیات","نظامی","ارتش","پهپاد","موشک","تانک",
  "جنگنده","بمباران","توپخانه","پدافند","مرزی","امنیتی","شهید","مقاومت",
  "یگان","پایگاه","انفجار","حمله هوایی","حمله پهپادی","حمله موشکی",
  "نیروهای ویژه","جبهه","خط مقدم",

  // ایرانی
  "سپاه","نیروی قدس","شاهد","خیبرشکن","فجر","زلزال","کرار","مهاجر",
  "تیپ","لشکر","قرارگاه","بسیج","ایران","تهران","مرزهای ایران",

  // بین‌المللی
  "اسرائیل","غزه","فلسطین","لبنان","حزب الله","اوکراین","روسیه","ناتو",
  "یمن","بحرین","قطر","امارات","پاکستان","آمریکا","سوریه","افغانستان"
];

// زمان بررسی: ۳۰ دقیقه گذشته
const TIME_WINDOW_MINUTES = 30;

// فایل دیده‌شده‌ها
const SEEN_FILE = "data/seen.json";

function loadSeen() {
  if (!fs.existsSync(SEEN_FILE)) return {};
  return JSON.parse(fs.readFileSync(SEEN_FILE));
}

function saveSeen(seen) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify(seen, null, 2));
}

async function fetchChannelPosts(channel) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
  const res = await axios.get(url);
  return res.data.result || [];
}

function isMilitary(text) {
  let count = 0;
  MILITARY_KEYWORDS.forEach(k => {
    if (text.includes(k)) count++;
  });
  return count >= 2; // حداقل دو کلیدواژه برای اطمینان
}

function isRecent(msg) {
  const now = Math.floor(Date.now() / 1000);
  const diffMinutes = (now - msg.date) / 60;
  return diffMinutes <= TIME_WINDOW_MINUTES;
}

async function main() {
  console.log("Crawler started...");

  const seen = loadSeen();
  let militaryMessages = [];

  for (const ch of CHANNELS) {
    const posts = await fetchChannelPosts(ch);

    for (const p of posts) {
      if (!p.message || !p.message.text) continue;

      const text = p.message.text;
      const id = p.message.message_id;

      if (!seen[ch]) seen[ch] = [];

      // اگر قبلاً دیده شده، رد کن
      if (seen[ch].includes(id)) continue;

      // اگر جدید نیست، رد کن
      if (!isRecent(p.message)) continue;

      // اگر نظامی نیست، رد کن
      if (!isMilitary(text)) continue;

      // ذخیره پیام نظامی جدید
      militaryMessages.push({
        text,
        photo: p.message.photo ? p.message.photo : null
      });

      // ثبت در seen
      seen[ch].push(id);
    }
  }

  saveSeen(seen);

  if (militaryMessages.length === 0) {
    console.log("No new military messages in last 30 minutes.");
    return;
  }

  // فقط اولین پیام را وارد مسیر خلاصه‌سازی می‌کنیم
  fs.writeFileSync("data/current_raw.json", JSON.stringify(militaryMessages[0], null, 2));

  console.log("Saved:", militaryMessages.length, "military messages.");
}

main();
