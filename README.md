# Welcome to Learn Protocol
This is the official repository for the Learn Protocol, a web3 platform that rewards users for teaching and sharing knowledge.
The project is built on the EDU Chain and creates a community-driven ecosystem where users can earn tokens by helping others learn.

## What is it?
Learn Protocol is a platform that rewards users for teaching. Users can earn **$LP** tokens by helping others learn. The protocol is built on the EDU Chain and uses a custom ERC-20 token as its native currency. Our greatest mission is to motivate people to teach what they know by rewarding them.

## How it works?
In Learn Protocol, users ask and answer questions, just like any other Q&A platform. For every upvote your answer gets, you earn $LP tokens. The more upvotes you get, the more $LP tokens you earn. On the contrary, if your answer gets downvoted, you lose $LP tokens. The amount of $LP tokens you earn or lose is determined by the smart contract.

To gain more upvotes, you should detail your answers and provide more information. The more information you provide, the more likely you are to get upvotes.

## How to withdraw?
Before you withdraw your earned $LP tokens, you need to complete 2 steps:

1) Verify your account. In order to claim your $LP tokens you must verify your Learn Protocol account. For that, you need to transfer 1 EDU coin to treasury wallet.
2) Get at least 50 upvotes. Answer some questions and gain upvotes from other users. You need minimum 50 upvotes to activate $LP withdraws.

After you complete these steps, you can withdraw your $LP tokens. You can withdraw your $LP tokens to any wallet that supports ERC-20 tokens.

# Contract Addresses
Token Contract: [0xBc239272a5D1E6e0C987B52a2a725Fe168747763](https://edu-chain-testnet.blockscout.com/address/0xBc239272a5D1E6e0C987B52a2a725Fe168747763)

Utility Contract: [0x0B5C76a9915b73c735F78c15dd39642549F4A862](https://edu-chain-testnet.blockscout.com/address/0x0B5C76a9915b73c735F78c15dd39642549F4A862?tab=contract_code)

# Setup

- Rename your `.npmrc.template` file to `.npmrc`. Replace `${TIPTAP_PRO_TOKEN}` with your **Tiptap Pro Token** in `.npmrc` file.
- Run `npm install` and install the dependencies.
- Rename `.env.template` to `.env.local` and replace the values with your own.
- Start `Postgres` service ([Start With Docker](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)).
- Create a new database in Postgres and update the connection string in `.env.local` file.
- Run `npm run generate` and `npm run migrate` to create the database tables and seed the initial data.
- Run `npm run dev` to start the development server.
- Open your browser and navigate to `http://localhost:3000` to see the app in action.

## Notice for EDU Chain Hackathon

Due to conflicts with different working environments (Windows and WSL), this repository's commit history is cleared with `git push origin main --force` command. To check the repositories creation date, use the command to verify this repository was created before the hackathon deadline:

```bash
curl -s https://api.github.com/repos/learn-protocol/LearnProtocol | jq '.created_at'
> "2025-04-10T15:39:22Z"
```