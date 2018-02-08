import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const VendorsFood = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Content style={styles.list}>
                <Card>
                    <CardItem>
                        <Left>
                            <Icon name='cart' />
                            
                        </Left>
                        <Body>
                            <Text style={styles.cardHeader}>Bubble Tea</Text>
                            <Text>$3.49</Text>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
        </Container>);
}

export { VendorsFood }