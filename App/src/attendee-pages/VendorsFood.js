import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right, Thumbnail } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const VendorsFood = (props) => {
    let items = [
        {
            name: 'Bubble Tea',
            price: '$3.49',
            img: require('../../img/bubble-tea.jpg')
        }
    ];
    
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Content style={styles.list}>
                <Card
                    dataArray={items}
                    renderRow={(data, index) => {
                        return (
                            <CardItem>
                                <Left>
                                    <Thumbnail
                                        square
                                        style={styles.listImage}
                                        source={data.img}
                                    />
                                </Left>
                                <Body>
                                    <Text style={styles.cardHeader}>{data.name}</Text>
                                    <Text>{data.price}</Text>
                                    <Button>
                                        <Text>Add to Order</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        )
                    }}
                />
            </Content>
        </Container>);
}

export { VendorsFood }