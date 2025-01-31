import { getBalance } from "./api/getBalanace";

async function test() {
  const balance = await getBalance("bsn9CFkaJiYB5cCCTEX53ZFrUgRxKjmEQVBEdVu6XMk");
  console.log(balance);
}

test();
