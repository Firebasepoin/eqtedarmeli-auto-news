const fs = require("fs");
const axios = require("axios");

const MAIN_CHANNEL = "@eqtedarmeli";

async function main() {
  const schedule = JSON.parse(fs.readFileSync("data/schedule.json"));
  const posts = JSON.parse(fs.readFileSync("data/posts.json"));

  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2,"0")}`;

  if (!schedule.includes(currentTime)) return;
  if (posts.length === 0) return;

  const post = posts.shift();

  await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    chat_id: MAIN_CHANNEL,
    text: `${post.text}\n\n@eqtedarmeli`
  });

  fs.writeFileSync("data/posts.json", JSON.stringify(posts));
}

main();
