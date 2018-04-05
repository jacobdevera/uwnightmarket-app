import React from 'react';

import { Header, Left, Button, Icon, Right, Body, Title } from 'native-base';

const AppHeader = (props) => {
    return (
        <Header>
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
                <Title>{props.children}</Title>
            </Body>

            <Right>
                {props.right}
            </Right>
        </Header>
    );
}

export { AppHeader };