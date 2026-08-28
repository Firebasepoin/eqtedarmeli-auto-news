const fs = require("fs");

function rewrite(text) {
  return text
    .replace(/اعلام کرد/g, "گفته")
    .replace(/افزود/g, "اضافه کرده")
    .replace(/گزارش شده/g, "می‌گن")
    .replace(/نیروهای/g, "نیروها")
    + " .";
}

function main() {
  const data = JSON.parse(fs.readFileSync("data/current_summary.json"));
  const rewritten = rewrite(data.summary);

  fs.writeFileSync("data/current_ready.json", JSON.stringify({
    text: rewritten,
    photo: data.photo
  }));
}

main();
