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

Deploy concluído na Ethereum mainnet:

- Contract: [`0xfdfc612c11426f257e0044de971dad7076635126`](https://etherscan.io/address/0xfdfc612c11426f257e0044de971dad7076635126)
- Transaction: [`0xe93504bca356dc648afd25638f4b570f61026f8b7845ce05ad43e47615568b43`](https://etherscan.io/tx/0xe93504bca356dc648afd25638f4b570f61026f8b7845ce05ad43e47615568b43)
- Token `#1` owner: `0xfb7aee27a5a34cf09e2aca73b8e01c7fb3e0197a`
- Deployment record: `deployments/ethereum-mainnet.json`

O contrato foi implantado pelo signer isolado de `/usr/local/bin/hermes-deploy.sh`. O token `#1` foi cunhado diretamente para a Circle Agent Wallet definida no argumento do construtor.
