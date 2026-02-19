//basically connects to sol devnets

import { Connection } from "@solana/web3.js";


const connection = new Connection("https://api.devnet.solana.com", "confirmed");



// const balance = await connection.getBalance(publicKey);
// console.log(balance / 1e9, "SOL");
