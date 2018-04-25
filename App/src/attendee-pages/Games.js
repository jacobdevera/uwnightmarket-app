import React, { Component } from 'react';
import { Image, View } from 'react-native';
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
                                    <CardItem style={{ paddingLeft: 10, paddingRight: 10 }}>
                                        <Left>
                                            <Body style={{ alignSelf: 'flex-start' }}>
                                                <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}]}>
                                                    <Badge style={{ backgroundColor: config.colorPrimary, marginRight: 8}}>
                                                        <Text>{data.boothNumber}</Text>
                                                    </Badge>
                                                    <Text style={ [styles.bold, styles.cardH1, styles.badgeHeader] }>{data.name}</Text>
                                                </View>
                                                <Text style={ [styles.bold, styles.cardH2, styles.smallSection] }>{data.price}</Text>
                                                <Text style={styles.smallSection}>{data.desc}</Text>
                                            </Body>
                                            <Image
                                                resizeMode="contain"
                                                style={styles.listImage}
                                                source={data.img}
                                            />
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