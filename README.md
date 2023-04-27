# OKX extension web3-react Connector

OKX Extension connector for [web3-react](https://github.com/Uniswap/web3-react).

## Getting started

app.js
```typescript
import { Web3ReactProvider } from "@web3-react/core";
import { hooks as metaMaskHooks, metaMask } from "@/common/MaskConnectWallet/metaMaskConnector";
import { hooks as okxHooks, okx } from "@/common/OKXConnectWallet/okxConnector";

const connectors = [
    [metaMask, metaMaskHooks],
    [okx, okxHooks]
]
  
<Web3ReactProvider connectors={connectors}>
  //{ your component }
</Web3ReactProvider>

```

okxConnector.js
```typescript
import { initializeConnector } from '@web3-react/core'
import { OKXWallet } from './@okx/index'; //this repo

export const [okx, hooks] = initializeConnector((actions) => new OKXWallet({ actions }))
```

button.js
```typescript
...
const connectOKX = async () => {
  try {
    await okx.activate(1); // chainId 1 is mainnet
  } catch (ex) {
    console.log('web3-react activate catch error ==>', ex);
    if (ex.toString().indexOf('OKX Wallet not installed') > -1) {
      // TODO
    }

    if (ex.code === 4902) { //
      // TODO
    }
  }
}

<div onClick={() => connectOKX()}>
  okx
</div>
```
