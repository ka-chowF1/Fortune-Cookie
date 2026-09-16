(function (root) {
  const fortunes = Object.freeze([
    "You will find great success, just not today.",
    "A great opportunity is coming your way. You will still probably miss it.",
    "Someone thinks you're funny. It is not this cookie.",
    "Your future is bright. Your Wi-Fi signal is not.",
    "You are destined for greatness — eventually, probably, maybe.",
    "Good things come to those who wait. You've been waiting a while.",
    "Your hard work will pay off. Someone else's, too — more.",
    "You will make a new friend soon. They will forget your name.",
    "Fortune favors the bold. You are neither.",
    "A pleasant surprise awaits. It is not this fortune.",
    "You have a great sense of humor. Nobody else has noticed yet.",
    "Your kindness will be rewarded. Eventually. In another life.",
    "Big changes are coming. You will still be late to them.",
    "You are more capable than you think. You don't think much of yourself, though.",
    "Adventure awaits! It is currently stuck in traffic.",
    "You will achieve your dreams. Consider lowering them first.",
    "People admire your confidence. They question your judgment.",
    "Wealth is coming your way. So is the bill for this fortune.",
    "You have a unique perspective. Nobody asked for it, but you have it.",
    "Today is your lucky day. Yesterday was better."
  ]);
  function pickFortune(previous = -1, random = Math.random) {
    const exclude = Number.isInteger(previous) && previous >= 0 && previous < fortunes.length;
    let index = Math.floor(random() * (fortunes.length - (exclude ? 1 : 0)));
    if (exclude && index >= previous) index++;
    return { index, text: fortunes[index] };
  }
  root.FortuneCookies = { fortunes, pickFortune };
  if (typeof module !== 'undefined') module.exports = root.FortuneCookies;
})(globalThis);
