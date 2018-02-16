import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Games = (props) => {
    let items = [
        {
            name: 'Fish Scoop',
            price: '$1 for 1 net',
            desc: 'Test your fishing skills with paper nets!',
            img: require('../../img/fish-scoop.jpg')
        },
        {
            name: 'Ring Toss',
            price: '$2 for 10 rings',
            desc: 'Practice your aiming and try to throw rings onto as many bottles as you can!',
            img: require('../../img/ring-toss.jpg')
        },
        {
            name: 'Sumo',
            price: '$2 for 1 round',
            desc: 'Challenge your friends to a game of wrestling!',
            img: require('../../img/sumo.png')
        }
    ];

    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Games
            </AppHeader>
            <Content>
                <View style={styles.paddedContainer}>
                    <Text>Visit the Quad to play some traditional Taiwanese night market games!</Text>
                </View>
                <View style={styles.paddedContainer}>
                    <Text style={ [styles.header, styles.h1] }>Games Available</Text>
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
                                        <Text>{data.desc}</Text>
                                    </Body>
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