const axios = require("axios");
const fs = require("fs");

const REVIEW_CHANNEL = "U1Pi3GeB4YLrcuiD";

async function main() {
  const data = JSON.parse(fs.readFileSync("data/current_ready.json"));
  const text = `${data.text}\n\n@eqtedarmeli`;

  await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    chat_id: REVIEW_CHANNEL,
    text,
    reply_markup: {
      inline_keyboard: [
        [{ text: "تأیید", callback_data: "approve" }],
        [{ text: "رد", callback_data: "reject" }]
      ]
    }
  });
}

main();
