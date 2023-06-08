import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockInfos, setBlockInfos] = useState();
  const [transactions, setTransactions] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    async function getBlockInfos() {
      setBlockInfos(await alchemy.core.getBlock(blockNumber));
    }
    async function getTransactions() {
    const block = await alchemy.core.getBlockWithTransactions(blockNumber);
    setTransactions(block.transactions);
    }
   

    getBlockNumber();
    getBlockInfos();
    getTransactions();
    //getTransactionReceipt();
  },[blockNumber]);

  async function getTransactionDetails(txHash) {
    const receipt = await alchemy.core.getTransactionReceipt(txHash);
    setTransactionDetails(receipt);
  }

  return (

    <div className="App">
        <div>Block Number : {blockNumber}</div> 
        {blockInfos && (
        <div>
          <div>Hash: {blockInfos.hash}</div>
          <div>Parent Hash: {blockInfos.parentHash}</div>
          <div>Nonce: {blockInfos.nonce}</div>
          <div>Transactions Hash: {blockInfos.transactions}</div>
         
        </div>
        )}
       
        <div>
        Transactions:
        <ul>
          {transactions.map((txHash,index) => (
            <li key={index}>
              <button onClick={() => getTransactionDetails(txHash)}>Details</button>
              {txHash}
            </li>
          ))}
        </ul>
      </div>
      {transactionDetails && (
  <ul>
    {Object.entries(transactionDetails).map(([key, value]) => (
      <li key={key}>
        <strong>{key}: </strong>{value}
      </li>
    ))}
  </ul>
)}



  </div>
  

  )
  
    
}

export default App;
