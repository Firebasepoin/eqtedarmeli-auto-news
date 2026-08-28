const fs = require("fs");

function summarize(text) {
  const sentences = text.split(".");
  const scored = sentences.map(s => ({
    sentence: s.trim(),
    score: s.split(" ").length
  }));
  const sorted = scored.sort((a,b) => a.score - b.score).slice(0,3);
  return sorted.map(s => s.sentence).join(". ");
}

function main() {
  const raw = JSON.parse(fs.readFileSync("data/current_raw.json"));
  const summary = summarize(raw.text);

  fs.writeFileSync("data/current_summary.json", JSON.stringify({
    summary,
    photo: raw.photo
  }));
}

main();
