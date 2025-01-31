

export const getBalance = async (wallet: string) => {
  const response = await fetch("https://docs-demo.solana-mainnet.quiknode.pro", {
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

  const data = await response.json();
  const balanceLamports = data.result.value;
  const balanceSol = balanceLamports / 1e9; // 转换为 SOL
  return balanceSol;
};
