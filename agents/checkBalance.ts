import { readSavedWalletDataFromFile } from "../wallet/wallet";
import { connection } from "../wallet/connections";

declare const console: any;

const walletA = readSavedWalletDataFromFile("agent-a.json");
const walletB = readSavedWalletDataFromFile("agent-b.json");

const balanceA = await connection.getBalance(walletA.publicKey);
const balanceB = await connection.getBalance(walletB.publicKey);

console.log(`Agent A balance: ${balanceA / 1e9} SOL`);
console.log(`Agent B balance: ${balanceB / 1e9} SOL`);
