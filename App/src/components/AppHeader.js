import React from 'react';
import { Platform } from 'react-native';
import { Header, Left, Button, Icon, Right, Body, Title } from 'native-base';

import { config } from '../styles';
const AppHeader = (props) => {
    const headerTextColor = Platform.OS === 'ios' ? '#000' : '#fff';
    return (
        <Header  androidStatusBarColor={config.colorDark}>
            {props.left ? props.left :
            <Left>
                <Button transparent
                    onPress={() => props.navigation.navigate("DrawerOpen")}
                >
                    <Icon name='menu' />
                </Button>
            </Left>
            }
            <Body>
                <Title style={{ color: headerTextColor }}>{props.children}</Title>
            </Body>

            <Right>
                {props.right}
            </Right>
        </Header>
    );
}

export { AppHeader };