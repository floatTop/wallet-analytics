import { getLowWinLowPnl } from "./fun/analytics";

 getLowWinLowPnl({
  "1": [
    "6j33qf6PKMWw8jgFCadXbMr9vUq4Z6J8ChrGbAF2cBYF",
    "BqryLwcJcg1kZq28oi7cRYSsJiJxWzUF6YaLRD84ecGT",
    "Gpe17co8acBWNeL68oqn5PR2NECgssKq9FmoZpXrmjkN",
  ],
}, false).then((result) => {
  console.log(result);
});
