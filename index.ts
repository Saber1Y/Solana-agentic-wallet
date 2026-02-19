import { createWalletWithKeypair, saveWalletToFile, readSavedWalletDataFromFile } from "./wallet/wallet";

declare const console: { log: (...args: any[]) => void };

const createdWalletData = createWalletWithKeypair();
saveWalletToFile(createdWalletData, "my_wallet.json");

const loadWalletData = readSavedWalletDataFromFile("my_wallet.json")
console.log("Loaded data", loadWalletData.publicKey.toBase58());