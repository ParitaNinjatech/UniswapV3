import { ethers, Signer } from "ethers";
import TokenAbi from "./abis/token.json";
import UniswapV3 from "./abis/UniswapV3.json";
import PairABI from "./abis/PairAbi.json";
import uniSwapLiquidityAbi from "./abis/UniswapV3Pool.json";
import FactoryAbi from "./abis/UniswapFactory.json"



export const tokenObj = async(tokenAddress,Signer) =>{
   return new ethers.Contract(tokenAddress,TokenAbi,Signer);
}

export const uniSwapObj = async(routeAddress,Signer) =>{
    return  new ethers.Contract(routeAddress,UniswapV3,Signer)
}

export const pairObj = async(pairAddress,Signer) =>{
    return new ethers.Contract(pairAddress,PairABI,Signer);
}

export const uniswapLiquidity = async(LiquidityAddress,Signer) =>{
    return new ethers.Contract(LiquidityAddress,uniSwapLiquidityAbi,Signer)
}


export const factoryObj = async(factoryAddress,Signer) =>{
    return new ethers.Contract(factoryAddress,FactoryAbi,Signer);

}