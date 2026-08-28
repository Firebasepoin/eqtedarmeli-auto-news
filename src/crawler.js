const fs = require("fs");
const axios = require("axios");

const CHANNELS = [
  "Tasnimnews",
  "yjcnewschannel",
  "nasimonline",
  "alalamfa"
];

const MILITARY_KEYWORDS = [
  "جنگ","درگیری","حمله","عملیات","نظامی","ارتش","پهپاد","موشک","تانک",
  "جنگنده","بمباران","توپخانه","پدافند","مرزی","امنیتی","شهید","مقاومت",
  "یگان","پایگاه","انفجار","حمله هوایی","حمله پهپادی","حمله موشکی",
  "نیروهای ویژه","جبهه","خط مقدم","غزه","سوریه","عراق","یمن","اوکراین",
  "خلیج فارس","لبنان","فلسطین"
];

function isMilitary(text) {
  let count = 0;
  MILITARY_KEYWORDS.forEach(k => {
    if (text.includes(k)) count++;
  });
  return count >= 2;
}

async function fetchChannelPosts(channel) {
  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`;
  const res = await axios.get(url);
  return res.data.result || [];
}

async function main() {
  const seen = JSON.parse(fs.readFileSync("data/seen.json"));

  for (const ch of CHANNELS) {
    const posts = await fetchChannelPosts(ch);

    for (const p of posts) {
      if (!p.message || !p.message.text) continue;

      const text = p.message.text;
      const id = p.message.message_id;

      if (seen.includes(id)) continue;
      if (!isMilitary(text)) continue;

      fs.writeFileSync("data/current_raw.json", JSON.stringify({
        text,
        photo: p.message.photo ? p.message.photo : null
      }));

      seen.push(id);
      fs.writeFileSync("data/seen.json", JSON.stringify(seen));
    }
  }
}

main();
