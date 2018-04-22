import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Games = (props) => {
    let items = [
        {
            name: 'Sandbag Toss',
            price: '$1 / 5 sandbags',
            desc: 'How’s your aim? Toss all five sandbags into a bucket for rewards!',
            img: require('../../img/sandbag-toss.png')
        },
        {
            name: 'Hoops Fever',
            price: '$2 / 6 throws',
            desc: 'You have one minute on the clock! Play against your friends for basketball stardom!',
            img: require('../../img/hoops-fever.png')
        },
        {
            name: 'Bottle Fishing',
            price: '$1 / 3 minutes',
            desc: 'You have one minute to make all three bottles stand up! A Night Market classic!',
            img: require('../../img/bottle-fishing.png')
        },
        {
            name: 'Lucky Envelope',
            price: '$1 / Envelope\n$2 / 3 Envelopes',
            desc: 'Test your luck! Draw an envelope and you may win an Amazon gift card!',
            img: require('../../img/lucky-envelope.png')
        }
    ];

    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Games
            </AppHeader>
            <Content contentContainerStyle={styles.paddedContainer}>
                <View style={styles.section}>
                    <Text>Visit the Quad to play some traditional Taiwanese night market games!</Text>
                </View>
                <View style={styles.section}>
                    <Text style={ [styles.header, styles.h1] }>Games Available</Text>
                    <List
                        dataArray={items}
                        renderRow={(data, index) => {
                            return (
                                <Card>
                                    <CardItem>
                                        <Left>
                                            <Image
                                                resizeMode="contain"
                                                style={styles.listImage}
                                                source={data.img}
                                            />
                                            <Body>
                                                <Text style={ [styles.header, styles.cardH1] }>{data.name}</Text>
                                                <Text style={ [styles.header, styles.cardH2] }>{data.price}</Text>
                                                <Text>{data.desc}</Text>
                                            </Body>
                                        </Left>
                                    </CardItem>
                                </Card>
                            )
                        }}
                    />
                </View>
            </Content>
        </Container>);
}

export { Games }