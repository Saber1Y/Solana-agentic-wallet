import { readSavedWalletDataFromFile, getTokenBalance } from "../wallet/wallet";
import { PublicKey } from "@solana/web3.js";

const DEFAULT_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1"; // USDC on mainnet
const DEFAULT_DEVNET_TOKEN = "4zMCYQquB6XP2QmXz4E5K5s1q2a6jK8v5N3mW9xR1tY"; // Example devnet token

const agentA = readSavedWalletDataFromFile("agent-a.json");
const agentB = readSavedWalletDataFromFile("agent-b.json");

async function checkTokenBalances() {
  const mintAddress = process.argv[2] || DEFAULT_DEVNET_TOKEN;
  
  let mint: PublicKey;
  try {
    mint = new PublicKey(mintAddress);
  } catch {
    console.log("Error: Invalid token mint address");
    console.log("Usage: bun agents/checkTokenBalance.ts <TOKEN_MINT_ADDRESS>");
    return;
  }
  
  console.log(`\n=== SPL Token Balance Check ===`);
  console.log(`Token Mint: ${mint.toBase58()}\n`);

  const balanceA = await getTokenBalance(agentA.publicKey, mint);
  const balanceB = await getTokenBalance(agentB.publicKey, mint);

  console.log(`Agent A token balance: ${balanceA}`);
  console.log(`Agent B token balance: ${balanceB}`);
  console.log(`\nNote: Returns 0 if no token account exists yet`);
  console.log(`      (Need to receive tokens first to have an account)\n`);
}

checkTokenBalances();
