import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right, Thumbnail, List } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const VendorsFood = (props) => {
    let items = [
        {
            name: 'Bubble Tea',
            price: '$5',
            img: require('../../img/bubble-tea.jpg')
        },
        {
            name: 'Fish Tofu',
            price: '$5',
            img: require('../../img/fish-tofu.jpg')
        },
        {
            name: 'BBQ Pork Buns',
            price: '$7',
            img: require('../../img/bbq-pork-buns.jpg')
        }
    ];

    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Content style={styles.paddedContainer}>
                <List
                    dataArray={items}
                    renderRow={(data, index) => {
                        return (
                            <Card>
                            <CardItem>
                                <Left>
                                    <Thumbnail
                                        square
                                        style={styles.listImage}
                                        source={data.img}
                                    />
                                </Left>
                                <Body>
                                    <Text style={ [styles.header, styles.cardH1] }>{data.name}</Text>
                                    <Text style={ [styles.header, styles.cardH2] }>{data.price}</Text>
                                    <Button>
                                        <Text>Add to Order</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                            </Card>
                        )
                    }}
                />
            </Content>
        </Container>);
}

export { VendorsFood }