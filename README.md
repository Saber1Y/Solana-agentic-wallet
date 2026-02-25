# Solana Agentic Wallet

A **Two-Agent Sandbox Economy** demonstrating autonomous AI agent wallets on Solana devnet.

---


## Bounty Requirements ✅

| Requirement | Status | Implementation |
|-------------|:------:|----------------|
| Create wallet programmatically | ✅ | `createOrLoadWallet()` generates keypairs |
| Sign transactions automatically | ✅ | `sendSOL()` signs and confirms |
| Hold SOL | ✅ | Wallets store SOL on devnet |
| Hold SPL tokens | ✅ | `getTokenBalance()`, `sendSPLToken()` |
| Interact with test dApp/protocol | ✅ | Dashboard monitors wallet state |
| Open-source code | ✅ | This repo |
| Clear README and setup | ✅ | This file |
| SKILLS.md | ✅ | Agent capabilities documented |

---

## Quick Test for Judges (30 seconds)

```bash
# 1. Clone and install
bun install

# 2. Check wallets exist (pre-funded)
bun agents/checkBalance.ts

# 3. Run autonomous simulation (watches agents pay each other)
bun run scripts/run-simulation.ts

# 4. Watch dashboard in another terminal
bun run scripts/dashboard.ts
```

---

## What to Expect

An agentic wallet is a cryptocurrency wallet controlled by an AI agent rather than a human. The agent can:
- Create wallets programmatically
- Sign and execute transactions autonomously
- Make decisions based on programmed logic
- Operate without human intervention

This project demonstrates two AI agents (Agent A and Agent B) with their own wallets, where Agent A autonomously pays Agent B based on decision logic.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Solana Devnet                        │
│                                                         │
│  ┌─────────────┐         ┌─────────────┐              │
│  │  Agent A    │ ──────> │  Agent B    │              │
│  │  Wallet     │  0.1 SOL│  Wallet     │              │
│  └─────────────┘         └─────────────┘              │
└─────────────────────────────────────────────────────────┘
         ▲                        ▲
         │                        │
    ┌────┴────┐              ┌────┴────┐
    │ Wallet  │              │ Wallet  │
    │ Module  │              │ Module  │
    └─────────┘              └─────────┘
```

### File Structure

```
solana-agentic-wallet/
├── wallet/
│   ├── wallet.ts       # Keypair creation, save, load, sendSOL, SPL tokens
│   └── connections.ts  # Solana devnet connection
├── agents/
│   ├── agentA.ts       # Spender agent - checks balance, sends SOL
│   ├── checkBalance.ts # Check SOL balances
│   └── checkTokenBalance.ts # Check SPL token balances
├── scripts/
│   ├── create-wallet.ts   # Create or load wallets
│   ├── dashboard.ts       # Real-time agent dashboard
│   └── run-simulation.ts  # Autonomous agent loop
├── SKILLS.md               # Agent capabilities documentation
└── README.md
```

## How to Run

### Prerequisites

- [Bun](https://bun.sh) installed
- Solana devnet SOL (via [Solana Faucet](https://faucet.solana.com))

### Setup

```bash
# Install dependencies
bun install
```

### Create Wallets

```bash
bun run scripts/create-wallet.ts
```

Output:
```
Loading existing Agent A wallet from agent-a.json
Loading existing Agent B wallet from agent-b.json
Agent A: 9xK...abc
Agent B: 7Lp...xyz
```

### Check Balance

```bash
bun agents/checkBalance.ts
```

### Run Agent A (Send SOL)

```bash
bun agents/agentA.ts
```

Expected output (with sufficient balance):
```
Balance: 1.23 SOL
Decision: sending 0.1 SOL to Agent B
Transaction confirmed: 5xK...xyz
```

### Run Dashboard (Real-time Monitoring)

```bash
bun run scripts/dashboard.ts
```

Shows live balances and agent behavior (auto-refreshes every 3 seconds).

## Agent Behaviors

### Agent A (Spender)
- Loads its wallet from local storage
- Checks current SOL balance
- If balance > 0.5 SOL → sends 0.1 SOL to Agent B
- If balance ≤ 0.5 SOL → skips transaction

### Agent B (Receiver)
- Tracks incoming payments
- Logs balance changes
- Passive recipient (can be extended to auto-claim/reinvest)

## Security Notes

- **Devnet Only**: This prototype runs exclusively on Solana devnet. Never use on mainnet.
- **Local Key Storage**: Secret keys are stored in JSON files locally. In production, use encrypted key management (HSM, AWS KMS, etc.)
- **No Hardcoded Secrets**: Keys are generated and stored locally, not committed to git
- **Separation of Concerns**: Agent logic is separate from wallet operations

## Deep Dive

### Why Autonomous Wallets?

AI agents need to act on behalf of users in DeFi, trading, and automation scenarios. Autonomous wallets enable:

- **24/7 automated trading** - Agents can execute strategies without human intervention
- **Self-executing financial strategies** - Conditional payments based on market data
- **AI-powered yield optimization** - Agents can move funds between protocols
- **Automated treasury management** - Companies can automate payroll and expenses

Traditional wallets require human approval for every transaction. Agentic wallets remove this bottleneck, allowing AI systems to function as autonomous financial actors.

---

### Wallet Design

Our wallet follows a **modular architecture** with clear separation:

```
┌─────────────────────────────────────────────────────┐
│                    Agent Layer                      │
│         (Decision making, business logic)           │
├─────────────────────────────────────────────────────┤
│                  Wallet Module                      │
│      (Key management, signing, transactions)        │
├─────────────────────────────────────────────────────┤
│                 Solana Network                     │
│            (Devnet for testing)                     │
└─────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Wallet Module (`wallet.ts`)** - Handles all cryptographic operations
   - `createOrLoadWallet()` - Generates or retrieves keypairs
   - `sendSOL()` - Signs and broadcasts transactions
   - `readSavedWalletDataFromFile()` - Loads keys from storage

2. **Connection Module (`connections.ts`)** - Single connection instance
   - Prevents connection proliferation
   - Manages devnet RPC endpoint

3. **Agent Layer (`agents/`)** - Business logic
   - Decision-making (balance thresholds)
   - Payment execution
   - Balance monitoring

---

### Security Considerations

| Aspect | Implementation | Production Recommendation |
|--------|---------------|---------------------------|
| Key Storage | Local JSON files | HSM, AWS KMS, Azure Key Vault |
| Signing | In-memory Keypair | Hardware security module |
| Network | Devnet only | Mainnet with multi-sig |
| Secrets | Never hardcoded | Environment variables + encryption |

**Current Security Model:**
- Keys stored in `agent-a.json`, `agent-b.json`
- Files not committed to git (`.gitignore`)
- No secrets in source code
- Devnet-only limits financial risk

**For Production:**
- Encrypt keys at rest (AES-256)
- Use hardware wallets for signing
- Implement rate limiting
- Add transaction approval workflows

---

### How Agents Interact with Wallets

```typescript
// Agent A's decision logic
async function runAgent() {
  // 1. Load wallet (keys loaded into memory)
  const walletA = loadWallet("agent-a.json");
  
  // 2. Check state (query blockchain)
  const balance = await connection.getBalance(walletA.publicKey);
  
  // 3. Make decision (programmatic logic)
  if (balance > 0.5 * 1e9) {  // 0.5 SOL
    // 4. Execute (signs with loaded key)
    await sendSOL(walletA, agentBAddress, 0.1 * 1e9);
  }
}
```

**The agent never stores secrets permanently** - keys are loaded into memory, used for signing, and the process exits. This minimizes exposure.

---

### Scalability

The architecture scales to N agents:

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Agent A  │  │ Agent B  │  │ Agent N  │
│ Wallet   │  │ Wallet   │  │ Wallet   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────────────┴─────────────┘
                   │
            ┌──────┴──────┐
            │ Wallet      │
            │ Module      │
            └─────────────┘
```

- Each agent has independent wallet file
- Adding Agent C, D, E... requires only a new wallet file
- No shared state between agents
- Can run agents in parallel processes
- Dashboard monitors all simultaneously

---

### Tradeoffs

| Decision | Benefit | Risk |
|----------|---------|------|
| Local JSON keys | Simple, fast development | Physical machine security |
| Programmatic signing | Full automation | No human oversight |
| Rule-based agents | Predictable, testable | No AI/ML adaptation |
| Devnet-only | Zero financial risk | Doesn't prove mainnet viability |
| SOL only | Focused scope | Limited token support |



## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **SDK**: @solana/web3.js
- **Network**: Solana Devnet

## Commands Reference

```bash
# Install dependencies
bun install

# Create or load wallets (creates if not exists)
bun run scripts/create-wallet.ts

# Check SOL balances
bun agents/checkBalance.ts

# Check SPL token balances (pass token mint address)
bun agents/checkTokenBalance.ts <TOKEN_MINT>

# Run Agent A (sends payment if balance > threshold)
bun agents/agentA.ts

# Run autonomous simulation (auto-pays every 10 seconds)
bun run scripts/run-simulation.ts

# Run real-time dashboard
bun run scripts/dashboard.ts
```

## License

MIT
