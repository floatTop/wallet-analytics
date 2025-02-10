import cron from "node-cron";
import { analytics } from "./fun/analytics";
// 定时任务：每天 6 点执行
cron.schedule("0 6 * * *", async () => {
  console.log("现在是 6 点，执行程序！", new Date().toLocaleDateString());
  // 在这里调用你需要执行的程序或函数
  let retries = 3;
  while (retries > 0) {
    try {
      await analytics();
      break; // 成功执行后跳出循环
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error("执行 analytics 失败", error, new Date().toLocaleDateString());
      } else {
        console.log(`执行失败，重试第 ${3 - retries} 次`, new Date().toLocaleDateString());
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒后重试
      }
    }
  }
});

console.log("定时任务已启动");
