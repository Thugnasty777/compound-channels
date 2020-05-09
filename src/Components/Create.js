import React, { useState } from 'react';

// Ethereum
import { addressShortener } from '../Ethereum/EthHelper';
import { factoryContract } from '../Ethereum/ContractInstances';
import { assetData } from '../Ethereum/AssetData';

import {
  Flex,
  Button
} from 'rebass';

// Components
import InputBox from './Units/InputBox';
import ConfirmationBox from './Units/ConfirmationBox';
import TransactionBox from './Units/TransactionBox';
import LoadingScreen from './Units/LoadingScreen';

export default function CardBox(props) {
  const { setStepDash } = props; // Dashboard Step Setter
  const [ step, setStep ] = useState(1);
  // Info needed for creating a channel
  const [ endTime, setEndTime ] = useState(0);
  const [ recipientAddress, setRecipientAddress ] = useState('');
  const [ ERC20Details, setERC20Details ] = useState(assetData[0]);

  // Transaction Info 
  const [ txHash, setTxHash ] = useState('');
  const [ channelAddress, setChannelAddress ] = useState('');

  const nextStep = () => {
    if(recipientAddress.length === 42) {
      const newStep = step + 1;
      setStep(newStep)
    }
    else {
      window.alert('Please enter in a valid address.')
    }
  }

  const createNewChannel = async () => {
    const userAddress = window.ethereum.selectedAddress;
    await factoryContract.methods.createChannel(
      recipientAddress, 
      +endTime, 
      ERC20Details.tokenAddress, 
      ERC20Details.cTokenAddress
      ).send({ from:userAddress, gas:'1500000' })
    .once('transactionHash', (transactionHash) => {
      setStep(step + 1);
      setTxHash(transactionHash);
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
      setStep(step + 2);
      setChannelAddress(receipt.events.ChannelCreated.returnValues.channelAddress);
    })
    .on('error', console.error); 
  }
  const previousStep = () => {
    setStep(step - 1)
  }

  const setToken = (symbol) => {
    const tokenDetails = assetData.find(token => token.symbol === symbol);
    setERC20Details(tokenDetails);
  }

  const inputs = [
    {
      label: "Recipient Address",
      value: recipientAddress,
      type: "string",
      fx: setRecipientAddress
    },
    {
      label: "Channel Experation Time",
      value: endTime,
      type: "number",
      fx: setEndTime
    }
  ];

  const confirmDetails = [
    `Asset: ${ERC20Details.symbol}`,
    `Recipient: ${addressShortener(recipientAddress)}`,
    `EndTime: ${endTime}`
  ]

  const image = {
    bool: true,
    src: ERC20Details.image
  }

  const confirmHeading = 'Confirm your Channel';

  switch(step) {
    case 1: 
      return (
      <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
        <InputBox
          label={"Create a Channel"} 
          inputs={inputs} 
          setToken={setToken} 
          dropDown={true} />
          <Flex>
            <Button onClick={()=>setStepDash(0)}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </Flex>
      </Flex>
      )
    case 2:
      return (
        <ConfirmationBox 
        image={image}
        confirmButton={true}
        confirmHeading={confirmHeading} 
        confirmDetails={confirmDetails} 
        previousStep={previousStep} 
        confirmFunction={createNewChannel} 
        ERC20Details={ERC20Details}/>
      )
    case 3:
      return (
       <LoadingScreen />
      )
    case 4:
      return (
       <TransactionBox setStepDash={setStepDash} channelAddress={channelAddress} txHash={txHash} ERC20Details={ERC20Details}/>
      )
    default:
      return step;
  }
}