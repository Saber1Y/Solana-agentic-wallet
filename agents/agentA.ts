import { readSavedWalletDataFromFile, sendSOL } from "../wallet/wallet";
import { connection } from "../wallet/connections";

declare const console: any;

const agentA = readSavedWalletDataFromFile("agent-a.json");
const agentB = readSavedWalletDataFromFile("agent-b.json");

const balanceLamports = await connection.getBalance(agentA.publicKey);
const balance = balanceLamports / 1e9;

console.log(`Balance: ${balance} SOL`);

if (balance > 0.5) {
  console.log("Decision: sending 0.1 SOL to Agent B");
  const signature = await sendSOL(agentA, agentB.publicKey, 0.1);
  console.log("Transaction confirmed:", signature);
} else {
  console.log("Balance too low to send");
}
