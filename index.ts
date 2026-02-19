import {
  createWalletWithKeypair,
  saveWalletToFile,
  readSavedWalletDataFromFile,
} from "./wallet/wallet";

declare const console: { log: (...args: any[]) => void };

const agentA = createWalletWithKeypair("Agent A");
saveWalletToFile(agentA, "agent-a.json");

const agentB = createWalletWithKeypair("Agent B");
saveWalletToFile(agentB, "agent-b.json");

const loadAgentAWalletData = readSavedWalletDataFromFile("agent-a.json");
const loadAgentBWalletData = readSavedWalletDataFromFile("agent-b.json");

console.log("Loaded data", {
  loadAgentAWalletData,
  loadAgentBWalletData,
});
