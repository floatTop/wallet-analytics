import request from "./request";


export const getBalance = async (wallet: string) => {
  const data = await request("https://docs-demo.solana-mainnet.quiknode.pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [wallet],
    }),
  });

  const balanceLamports = data?.result?.value || 0;
 
  const balanceSol = balanceLamports / 1e9; // 转换为 SOL
  return balanceSol;
};
