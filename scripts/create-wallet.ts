import { createOrLoadWallet } from "../wallet/wallet";

const agentA = createOrLoadWallet("Agent A", "agent-a.json");
const agentB = createOrLoadWallet("Agent B", "agent-b.json");

console.log(`Agent A: ${agentA.publicKey.toBase58()}`);
console.log(`Agent B: ${agentB.publicKey.toBase58()}`);
