import { createWalletWithKeypair, saveWalletToFile } from "./wallet/wallet";

const createdWalletData = createWalletWithKeypair();
saveWalletToFile(createdWalletData, "my_wallet.json");