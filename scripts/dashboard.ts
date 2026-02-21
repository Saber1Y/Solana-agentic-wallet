import { readSavedWalletDataFromFile } from "../wallet/wallet";
import { connection } from "../wallet/connections";

async function getBalance(publicKey: any) {
  const lamports = await connection.getBalance(publicKey);
  return lamports / 1e9;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearScreen() {
  console.clear();
}

async function drawDashboard() {
  const agentA = readSavedWalletDataFromFile("agent-a.json");
  const agentB = readSavedWalletDataFromFile("agent-b.json");

  const balanceA = await getBalance(agentA.publicKey);
  const balanceB = await getBalance(agentB.publicKey);

  const statusA = balanceA > 0.5 ? "READY" : "WAITING";
  const statusB = balanceB > 0.01 ? "ACTIVE" : "STANDBY";

  const timestamp = new Date().toLocaleTimeString();

  clearScreen();
  
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🤖 AGENTIC WALLET DASHBOARD                  ║
║                    Autonomous Economy Simulation                 ║
╠══════════════════════════════════════════════════════════════════╣
║  Network: Solana Devnet                    Last Update: ${timestamp} ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─────────────────────┐    ┌─────────────────────┐             ║
║  │     AGENT A         │    │     AGENT B         │             ║
║  │     (Spender)       │    │     (Receiver)      │             ║
║  ├─────────────────────┤    ├─────────────────────┤             ║
║  │ Status: ${statusA}         │    │ Status: ${statusB}        │             ║
║  │ Balance: ${balanceA.toFixed(4)} SOL  │    │ Balance: ${balanceB.toFixed(4)} SOL  │             ║
║  │ PubKey: ${agentA.publicKey.toBase58().slice(0, 12)}... │    │ PubKey: ${agentB.publicKey.toBase58().slice(0, 12)}... │             ║
║  └─────────────────────┘    └─────────────────────┘             ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  AGENT BEHAVIOR LOG                                             ║
║  ───────────────────────────────────────────────────────────    ║`);

  if (balanceA > 0.5) {
    console.log(`║  ✓ Agent A: Balance sufficient → Executing payment...         ║`);
    console.log(`║  ✓ Agent B: Payment received → Balance updated                ║`);
  } else if (balanceA > 0) {
    console.log(`║  ⚠ Agent A: Insufficient funds (need 0.5 SOL)                 ║`);
    console.log(`║  ○ Agent B: Waiting for payment...                             ║`);
  } else {
    console.log(`║  ✗ Agent A: Wallet empty                                       ║`);
    console.log(`║  ○ Agent B: Waiting for funding...                             ║`);
  }

  console.log(`║                                                                  ║`);
  console.log(`╠══════════════════════════════════════════════════════════════════╣`);
  console.log(`║  Press Ctrl+C to exit                                          ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════╝`);
}

async function startDashboard() {
  console.log("Starting Agentic Wallet Dashboard...");
  console.log("Press Ctrl+C to stop\n");
  
  await sleep(2000);
  
  while (true) {
    try {
      await drawDashboard();
    } catch (error: any) {
      console.log("Error updating dashboard:", error.message);
    }
    await sleep(3000);
  }
}

startDashboard();
