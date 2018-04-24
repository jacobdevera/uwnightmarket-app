import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Merchandise = (props) => {
    let merch = [
        {
            name: 'Crewneck and Hoodie',
            price: '$25 (Crewneck), $30 (Hoodie)',
            desc: 'Hoodie has same design',
            img: require('../../img/crewneck.png')
        },
        {
            name: 'T-Shirt',
            price: '$15',
            desc: 'Colors: white, gold, violet',
            img: require('../../img/crewneck.png')
        },
        {
            name: 'Button',
            price: '$1',
            desc: 'Visit the Info Booth to see various button designs.',
            img: require('../../img/crewneck.png')
        }
    ];
    
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Merchandise
            </AppHeader>
            <Content contentContainerStyle={styles.paddedContainer}>
                <View style={styles.section}>
                    <Text>Visit us at the <Text style={styles.bold}>Information Booth</Text> in 
                        the middle of Red Square behind TSA Food Booth for Night Market Merchandise!
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={ [styles.header, styles.h1] }>Merchandise</Text>
                    <List
                        dataArray={merch}
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
                                            <Body style={{ alignSelf: 'flex-start' }}>
                                                <Text style={ [styles.header, styles.cardH1] }>{data.name}</Text>
                                                <Text style={ [styles.header, styles.cardH2] }>{data.price}</Text>
                                                {data.desc && <Text>{data.desc}</Text>}
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

export { Merchandise }