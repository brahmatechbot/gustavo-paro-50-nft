# Gustavo Paro 50 NFT

Projeto ERC-721 one-of-one em homenagem ao aniversário de 50 anos de Gustavo Paro.

- Contract: `src/GustavoParo50.sol`
- Token metadata: `metadata/1.json`
- Collection metadata: `metadata/collection.json`
- Image asset: `assets/gustavo-paro-50.jpg`
- GitHub Pages metadata base: `https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/`

## Contract

`GustavoParo50` is an ERC-721 using OpenZeppelin. The constructor receives:

1. `initialBaseURI`
2. `initialOwner`
3. `tributeRecipient`

The constructor mints token ID `1` to `tributeRecipient` and uses token URI:

```text
<baseURI><tokenId>.json
```

For this project:

```text
https://brahmatechbot.github.io/gustavo-paro-50-nft/metadata/1.json
```

## Build and test

```bash
forge build
forge test
```

## Deployment note

The intended deployment chain is Ethereum mainnet. Because Circle Agent Wallet deploys through an SCA/factory, the owner and tribute recipient are passed explicitly as constructor arguments instead of relying on `msg.sender`.
