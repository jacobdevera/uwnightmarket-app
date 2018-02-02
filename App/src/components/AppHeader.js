import React, { Component } from 'react';

import { Header, Left, Button, Icon, Right, Body, Text, Title } from 'native-base';

const AppHeader = (props) => {
   return (
      <Header>
         <Left>
            <Button transparent
               onPress={() => props.openDrawer()}
            >
               <Icon name='menu' />
            </Button>
         </Left>
         <Body>
            <Title>{props.children}</Title>
         </Body>
         <Right />
      </Header>
   );
}

export { AppHeader };