import { ethers } from "ethers";
import axios from "axios";
import QuoteAbi from  "../constant/abis/Quote.json";
import PoolAbi from "../constant/abis/UniswapV3Pool.json";
import TokenAbi from "../constant/abis/token.json"
import { Web3Provider } from '@ethersproject/providers';
import { poolAddress,quoteAddress } from "../constant/Chain";

export const getAbi = async (tokenAddress) => {
  try {
    if (!ethers.utils.isAddress(tokenAddress)) {
      console.error("Invalid Ethereum address format.");
      return;
    }

    const url = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${tokenAddress}&apikey=J7UT9BWGSAIW1ZQ2PK5SUJJYJCGS9USDX3`;

    const res = await axios.get(url);
    const abi = JSON.parse(res.data.result);
    console.log(abi,"abi");
    

    return abi;
  } catch (error) {
    console.error("Error fetching ABI: ", error);
  }
};

export const FetchPrice = async(provider,chainId,tokenaddress0,tokenAddress1,inputAmount) =>{
    try {
      if(provider){
        const provider1 = new Web3Provider(provider);
        const signer = provider1.getSigner();

        const getPoolAddress = poolAddress.get(chainId);
        const getQuoteAddress = quoteAddress.get(chainId);

        console.log("Pool Address:", getPoolAddress,"Quote" ,getQuoteAddress);
   
        const poolContract = new ethers.Contract(getPoolAddress,PoolAbi,signer);
        console.log(poolContract,"poolContract");

        const tokenContract0 = new ethers.Contract(tokenaddress0,TokenAbi,signer);
        console.log(tokenContract0,"tokenContrsct0");


        const tokenContract1 = new ethers.Contract(tokenAddress1,TokenAbi,signer);
        console.log(tokenContract1,"tokenContract1");
        
        const decimalToken0 = await tokenContract0.decimals()
        const decimalToken1 = await tokenContract1.decimals()
        console.log("Token 0 Decimal", decimalToken0,"Token 1 decimal",decimalToken1);
        
        const amountIn = new ethers.utils.parseUnits(inputAmount,decimalToken0)

        const quoteContract = new ethers.Contract(getQuoteAddress,QuoteAbi,signer);
        const fees = 3000;

        const quoteAmount = await quoteContract.callStatic.quoteExactInputSingle(
          tokenaddress0,
          tokenAddress1,
          fees,
          amountIn,
          0
        )
        console.log(quoteAmount.toString(),"quoteAmount");

        const amountOut =  ethers.utils.formatUnits(quoteAmount
       ,decimalToken1 )
        console.log(amountOut,"amountOut");
        
        return [amountIn,amountOut]
      }else{
        alert("Please Connect Wallet Properly")
      }
    } catch (error) {
        console.log(error);
        
    }
}
