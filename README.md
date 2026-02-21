# Solana Agentic Wallet

A **Two-Agent Sandbox Economy** demonstrating autonomous AI agent wallets on Solana devnet.

---

## Bounty Requirements ✅

| Requirement | Status | Implementation |
|-------------|:------:|----------------|
| Create wallet programmatically | ✅ | `createOrLoadWallet()` generates keypairs |
| Sign transactions automatically | ✅ | `sendSOL()` signs and confirms |
| Hold SOL | ✅ | Wallets store SOL on devnet |
| Interact with test dApp/protocol | ✅ | Dashboard monitors wallet state |
| Open-source code | ✅ | This repo |
| Clear README and setup | ✅ | This file |

---

## What is an Agentic Wallet?

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
│   ├── wallet.ts       # Keypair creation, save, load, sendSOL
│   └── connections.ts  # Solana devnet connection
├── agents/
│   ├── agentA.ts       # Spender agent - checks balance, sends SOL
│   └── checkBalance.ts # Utility to check wallet balance
├── scripts/
│   ├── create-wallet.ts # Create or load wallets
│   └── dashboard.ts     # Real-time agent dashboard
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
- 24/7 automated trading strategies
- Self-executing smart contracts
- AI-powered yield farming
- Automated treasury management

### How Agents Call Wallet APIs

```typescript
// 1. Load wallet from secure storage
const wallet = loadWallet("agent-a.json");

// 2. Agent makes decision
if (balance > threshold) {
  // 3. Sign and send transaction
  await sendSOL(wallet, recipient, amount);
}
```

### Scalability

The design supports N agents independently:
- Each agent has its own wallet file
- Agent logic is isolated
- Adding Agent C, D, etc. is trivial
- Works with any number of concurrent agents

### Tradeoffs

| Aspect | Benefit | Risk |
|--------|---------|------|
| Local key storage | Simple, fast | Physical security of machine |
| Programmatic signing | Full automation | No human oversight |
| Devnet-only | Safe testing | Requires funding for prod |
| Rule-based decisions | Predictable | No AI/ML adaptation |



## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **SDK**: @solana/web3.js
- **Network**: Solana Devnet

## Commands Reference

```bash
# Create or load wallets
bun run scripts/create-wallet.ts

# Check balance of both agents
bun agents/checkBalance.ts

# Run Agent A (sends payment if balance > 0.5 SOL)
bun agents/agentA.ts

# Run real-time dashboard
bun run scripts/dashboard.ts
```

## License

MIT
