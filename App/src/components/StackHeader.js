import React from 'react';

import { Header, Left, Button, Icon, Right, Body, Text, Title } from 'native-base';

const StackHeader = (props) => {
   return (
      <Header>
         <Left>
            <Button transparent
               onPress={() => props.navigation.goBack()}
            >
               <Icon name='arrow-back' />
            </Button>
         </Left>
         <Body>
            <Title>{props.children}</Title>
         </Body>
         <Right />
      </Header>
   );
}

export { StackHeader };