import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Header, Left, Button, Icon, Right, Body, Title } from 'native-base';

import { config } from '../styles';
const AppHeader = (props) => {
    const headerTextColor = Platform.OS === 'ios' ? '#000' : '#fff';
    const borderBottomWidth = Platform.OS === 'ios' ? 1 : 0;
    const barStyle = Platform.OS === 'ios' ? 'dark-content' : 'light-content';
    // hack to fix broken android header rendering on native base 
    const marginLeft = Platform.OS === 'android' ? 24 : 0;
    return (
        <Header androidStatusBarColor={config.colorDark} style={{ borderBottomWidth: borderBottomWidth }}>
            <StatusBar barStyle={barStyle}/>
            {props.left ? props.left :
            <Left>
                <Button transparent
                    onPress={() => props.navigation.navigate("DrawerOpen")}
                >
                    <Icon name='menu' />
                </Button>
            </Left>}
            <Body style={{ marginLeft: marginLeft }}>
                <Title style={{ color: headerTextColor }}>{props.children}</Title>
            </Body>
            <Right>{props.right}</Right>
        </Header>
    );
}

export { AppHeader };