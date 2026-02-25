import { readSavedWalletDataFromFile, sendSOL } from "../wallet/wallet";
import { connection } from "../wallet/connections";

declare const console: any;

const agentA = readSavedWalletDataFromFile("agent-a.json");
const agentB = readSavedWalletDataFromFile("agent-b.json");

const PAYMENT_INTERVAL_MS = 10000; // 10 seconds
const PAYMENT_AMOUNT = 0.001; // 0.001 SOL
const BALANCE_THRESHOLD = 0.01; // Minimum balance to send

async function tick() {
  const timestamp = new Date().toLocaleTimeString();
  
  try {
    const balanceLamports = await connection.getBalance(agentA.publicKey);
    const balance = balanceLamports / 1e9;

    console.log(`[${timestamp}] Agent A tick - Balance: ${balance.toFixed(4)} SOL`);

    if (balance > BALANCE_THRESHOLD + PAYMENT_AMOUNT) {
      console.log(`[${timestamp}] Decision: sending ${PAYMENT_AMOUNT} SOL to Agent B`);
      
      const signature = await sendSOL(agentA, agentB.publicKey, PAYMENT_AMOUNT);
      
      const newBalanceLamports = await connection.getBalance(agentB.publicKey);
      const newBalance = newBalanceLamports / 1e9;
      
      console.log(`[${timestamp}] ✓ Transaction confirmed! Agent B now has ${newBalance.toFixed(4)} SOL`);
      console.log(`[${timestamp}] Signature: ${signature.slice(0, 20)}...`);
    } else {
      console.log(`[${timestamp}] ⚠ Balance too low (need > ${BALANCE_THRESHOLD + PAYMENT_AMOUNT} SOL)`);
    }
    
    console.log("---");
    
  } catch (error: any) {
    console.log(`[${timestamp}] ✗ Error: ${error.message}`);
  }
}

async function startSimulation() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║       🤖 AUTONOMOUS AGENT SIMULATION STARTED              ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log(`Agent A: ${agentA.publicKey.toBase58().slice(0, 12)}...`);
  console.log(`Agent B: ${agentB.publicKey.toBase58().slice(0, 12)}...`);
  console.log(`Payment: ${PAYMENT_AMOUNT} SOL every ${PAYMENT_INTERVAL_MS / 1000} seconds`);
  console.log(`Threshold: ${BALANCE_THRESHOLD} SOL minimum balance`);
  console.log("");
  console.log("Press Ctrl+C to stop");
  console.log("════════════════════════════════════════════════════════════\n");

  // Run immediately
  await tick();

  // Then run on interval
  setInterval(tick, PAYMENT_INTERVAL_MS);
}

startSimulation();
