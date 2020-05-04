import React from 'react';
import { tallCardBoxFormatting } from '../../theme';
import {
  Flex,
  Heading,
  Card,
  Text
} from 'rebass';
import {
  Label,
  Input
} from '@rebass/forms';
import TokenDropdown from './TokenDropdown';

export default function InputBox(props) {
  const {
    inputs,
    dropDown, 
    setToken, 
    label, 
    text 
  } = props;

  return (
    <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
      <Card sx={tallCardBoxFormatting}>
        <Flex flexDirection={'column'} justifyContent={'center'} height={'300px'}>
          <Heading mb={2}>{label}</Heading>
          {dropDown?<TokenDropdown setToken={setToken} />:<div/>}
          {inputs.map((input, index) => {
            return (
              <Flex key={index} flexDirection={'column'} mt={'5px'} >
                {text?<Text mb={4}>{input.text}</Text>:<div/>}
                <Label pb={1}>{input.label}</Label>
                 <Input 
                    type={input.type} 
                    value={input.value} 
                    onChange={(e) => input.fx(e.target.value)} 
                    required
                />
              </Flex>
            )
          })}
        </Flex>
      </Card>
    </Flex>
  )
}
