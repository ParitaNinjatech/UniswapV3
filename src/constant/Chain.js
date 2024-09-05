export const networks = [1, 56, 137, 97, 11155111]

export const ChainId = {
  MAINNET: 1,
  BSC: 56,
  POLYGON: 137,
  BSCTESTNET: 97,
  SEPOLIA: 11155111
};

export const routerAddress = new Map();
routerAddress.set(ChainId.MAINNET, "0x10ED43C718714eb63d5aA57B78B54704E256024E");
routerAddress.set(ChainId.BSC, "0x10ED43C718714eb63d5aA57B78B54704E256024E");
routerAddress.set(ChainId.POLYGON, "0xE592427A0AEce92De3Edee1F18E0157C05861564");
routerAddress.set(ChainId.BSCTESTNET, "0xD99D1c33F9fC3444f8101754aBC46c52416550D1");