import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Merchandise = (props) => {
    let shirts = [
        {
            color: 'blue',
            price: ['1 for $15', '2 for $25'],
            img: require('../../img/shirt.png')
        },
        {
            color: 'pink',
            price: ['1 for $15', '2 for $25'],
            img: require('../../img/shirt.png')
        }
    ];

    let pins = [
        {
            color: 'varied',
            price: ['1 for $1', '7 for $5'],
            img: require('../../img/shirt.png')
        }
    ];

    const list = (items) => {
        return (
            <List
                dataArray={items}
                renderRow={(data) => {
                    return (
                        <Card>
                            <CardItem>
                                <Thumbnail
                                    square
                                    style={styles.listImage}
                                    source={data.img}
                                />
                            </CardItem>
                            <CardItem><Text style={ [styles.menuItem] }>Color: {data.color}</Text></CardItem>
                            <CardItem><Text style={ [styles.menuItem] }>Price: {data.price.join(', ')}</Text></CardItem>
                        </Card>
                    )
                }}
            />
        );
    }
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Merchandise
            </AppHeader>
            <Content contentContainerStyle={styles.paddedContainer}>
                <View style={styles.section}>
                    <Text>Night Market T-shirts and pins are exclusively sold at the info booth
                        (next to Odegaard Library)! Come while supplies last!
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={ [styles.header, styles.h1] }>T-Shirts</Text>
                    {list(shirts)}
                </View>
                <View style={styles.section}>
                    <Text style={ [styles.header, styles.h1] }>Pins</Text>
                    {list(pins)}
                </View>
            </Content>
        </Container>);
}

export { Merchandise }