# Gustavo Paro 50 NFT

Projeto ERC-721 one-of-one em homenagem ao aniversário de 50 anos de Gustavo Paro.

- Contract: `src/GustavoParo50.sol`
- Token metadata: `metadata/1.json`
- Collection metadata: `metadata/collection.json`
- Image asset: `assets/gustavo-paro-50.jpg`
- GitHub Pages: `https://brahmatechbot.github.io/gustavo-paro-50-nft/`

## Contract

`GustavoParo50` usa o ERC-721 da OpenZeppelin e cria exatamente o token `#1` no construtor. O destinatário é passado explicitamente para evitar depender de `msg.sender` durante deploy por smart-account/factory da Circle.

O endereço do metadata é imutável no bytecode:

```text
https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/1.json
```

## Build and test

```bash
forge build
forge test
```

## Deployment

Rede pretendida: Ethereum mainnet. O deploy é preparado pela Circle Agent Wallet usando um factory CREATE2, com endereço previsto documentado em `deployments/ethereum-mainnet.plan.json`.
