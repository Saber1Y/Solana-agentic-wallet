# Agent Skills

This document describes the capabilities available to AI agents using this wallet system.

## Wallet Operations

### Create Wallet
```typescript
import { createOrLoadWallet } from "./wallet/wallet";

const wallet = createOrLoadWallet("Agent Name", "wallet-file.json");
```
- Generates a new Keypair if file doesn't exist
- Loads existing wallet if file exists
- Returns a Keypair object

### Save Wallet
```typescript
import { saveWalletToFile } from "./wallet/wallet";

saveWalletToFile(keypair, "wallet.json");
```
- Saves public key and secret key to JSON file

### Load Wallet
```typescript
import { readSavedWalletDataFromFile } from "./wallet/wallet";

const wallet = readSavedWalletDataFromFile("wallet.json");
```
- Loads Keypair from JSON file
- Returns Keypair ready for signing

---

## Transaction Operations

### Send SOL
```typescript
import { sendSOL } from "./wallet/wallet";

const signature = await sendSOL(fromKeypair, toPublicKey, amountInSOL);
```
- Signs and sends a SOL transfer transaction
- Returns transaction signature
- Requires sufficient balance (amount + rent + fees)

---

## Balance Operations

### Get Balance
```typescript
import { connection } from "./wallet/connections";

const balanceLamports = await connection.getBalance(publicKey);
const balanceSOL = balanceLamports / 1e9;
```
- Returns balance in lamports (divide by 1e9 for SOL)

---

## Network Configuration

### Connection
```typescript
import { connection } from "./wallet/connections";
```
- Connects to Solana devnet
- Endpoint: `https://api.devnet.solana.com`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run scripts/create-wallet.ts` | Create or load agent wallets |
| `bun agents/checkBalance.ts` | Check both agent balances |
| `bun agents/agentA.ts` | Run Agent A (sends payment if balance > 0.5 SOL) |
| `bun run scripts/dashboard.ts` | Real-time dashboard monitoring |

---

## Agent Behaviors

### Agent A (Spender)
- Loads wallet from `agent-a.json`
- Checks SOL balance
- If balance > 0.5 SOL → sends 0.1 SOL to Agent B
- If balance ≤ 0.5 SOL → skips transaction

### Agent B (Receiver)
- Passive wallet
- Receives SOL from Agent A

---

## Extending Agents

To create custom agent behavior:

```typescript
import { readSavedWalletDataFromFile, sendSOL } from "../wallet/wallet";
import { connection } from "../wallet/connections";

const myAgent = readSavedWalletDataFromFile("my-wallet.json");
const recipient = new PublicKey("...");

// Check balance
const balance = await connection.getBalance(myAgent.publicKey);

// Make decision
if (balance > threshold) {
  await sendSOL(myAgent, recipient, amount);
}
```

---

## Token Operations

### Get SPL Token Balance
```typescript
import { getTokenBalance } from "./wallet/wallet";
import { PublicKey } from "@solana/web3.js";

const tokenMint = new PublicKey("YOUR_TOKEN_MINT_ADDRESS");
const balance = await getTokenBalance(walletPublicKey, tokenMint);
```
- Returns token balance (UI units)
- Returns 0 if no token account exists

### Send SPL Token
```typescript
import { sendSPLToken } from "./wallet/wallet";
import { PublicKey } from "@solana/web3.js";

const tokenMint = new PublicKey("YOUR_TOKEN_MINT_ADDRESS");
const signature = await sendSPLToken(fromKeypair, toPublicKey, tokenMint, amount);
```
- Transfers SPL tokens between wallets
- Requires token accounts to exist for both sender and receiver
- Returns transaction signature

---

## Limitations

- Runs on devnet only (not mainnet)
- Local JSON key storage (not encrypted)
- Rule-based decisions (no AI/ML)
