import fs from 'fs';
import { getWalletByGroup } from "./api/getWalletByGroup";
import { getWalletGroup } from "./api/getWalletGroup";
import cliProgress from "./util/cliProgress";
import { getLowWinLowPnl } from './wallet-analytics';

async function test() {
  const allWalletProgress = cliProgress("Get All Wallets");
  const { data: groupGroupList } = await getWalletGroup();

  allWalletProgress.start(groupGroupList.length, 0);
  const wallets: { [groupId: string]: string[] } = {};
  for (const group of groupGroupList) {
    const { data: walletList } = await getWalletByGroup(group.id);
    walletList?.items.forEach((item) => {
      wallets[group.id] = [...(wallets[group.id] || []), item.wallet_address];
    });
    allWalletProgress.increment();
  }
  allWalletProgress.stop();
  
  const walletSet = new Set(Object.values(wallets).flat());
  
  fs.writeFileSync(
    "output/wallet-all-list.json",
    JSON.stringify(wallets, null, 2)
  );
  await getLowWinLowPnl(wallets);
}

test();
