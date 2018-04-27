import React, { Component } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List, Badge, Right } from 'native-base';

import { AppHeader } from '../components';
import styles, { config } from '../styles';

const Games = (props) => {
    let items = [
        {
            boothNumber: 'A',
            name: 'Sandbag Toss',
            price: '$1 / 5 sandbags',
            desc: 'How’s your aim? Toss all five sandbags into a bucket for rewards!',
            img: require('../../img/sandbag-toss.png')
        },
        {
            boothNumber: 'B',
            name: 'Hoops Fever',
            price: '$2 / 6 throws',
            desc: 'You have one minute on the clock! Play against your friends for basketball stardom!',
            img: require('../../img/hoops-fever.png')
        },
        {
            boothNumber: 'C',
            name: 'Bottle Fishing',
            price: '$1 / 3 minutes',
            desc: 'You have one minute to make all three bottles stand up! A Night Market classic!',
            img: require('../../img/bottle-fishing.png')
        },
        {
            boothNumber: 'D',
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
                                    <CardItem style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 }}>
                                        <Body style={{ alignSelf: 'flex-start', paddingRight: 10, marginRight: 10, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#ccc', paddingTop: 10, paddingBottom: 10 }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}]}>
                                                    <Badge style={{ backgroundColor: config.colorPrimary, marginRight: 8}}>
                                                        <Text>{data.boothNumber}</Text>
                                                    </Badge>
                                                    <View>
                                                        <Text style={ [styles.bold, styles.cardH1] }>{data.name}</Text>
                                                        <Text style={ [styles.cardH2, styles.smallSection, { color: config.colorPrimary, marginTop: 0 }]}>
                                                            {data.price}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={[styles.smallSection, { fontSize: 14, color: config.textDark }]}>{data.desc}</Text>
                                            </View>
                                        </Body>
                                        <Image
                                            resizeMode="contain"
                                            style={[styles.listImage, { paddingTop: 10, paddingBottom: 10 }]}
                                            source={data.img}
                                        />
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