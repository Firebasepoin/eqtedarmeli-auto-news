const fs = require("fs");

function randomTimes() {
  let times = [];
  let current = 8 * 60;

  for (let i = 0; i < 10; i++) {
    const add = Math.floor(Math.random() * (180 - 60)) + 60;
    current += add;
    if (current > 23 * 60) break;

    const h = Math.floor(current / 60);
    const m = current % 60;

    times.push(`${h}:${m.toString().padStart(2,"0")}`);
  }

  return times;
}

fs.writeFileSync("data/schedule.json", JSON.stringify(randomTimes()));
