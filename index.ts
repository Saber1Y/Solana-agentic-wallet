import { createWalletWithKeypair, saveWalletToFile } from "./wallet/wallet";

createWalletWithKeypair();
saveWalletToFile(createWalletWithKeypair(), "my_wallet.json");