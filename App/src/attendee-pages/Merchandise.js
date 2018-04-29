import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Card, CardItem, Container, Content, Text, Thumbnail, Body, Left, List } from 'native-base';

import { AppHeader } from '../components';
import styles, { config } from '../styles';

const Merchandise = (props) => {
    let merch = [
        {
            name: 'Crewneck and Hoodie',
            price: '$25 (Crewneck), $30 (Hoodie)',
            desc: 'Hoodie has same design',
            img: [require('../../img/crewneck.png')]
        },
        {
            name: 'T-Shirt',
            price: '$15',
            desc: 'Colors: white, gold, violet',
            img: [
                require('../../img/tshirt-white.png'),
                require('../../img/tshirt-gold.png'), 
                require('../../img/tshirt-violet.png')
            ]
        },
        {
            name: 'Button',
            price: '$1',
            desc: 'Visit the Info Booth to see various button designs.',
            img: []
        }
    ];

    let imageList = (images) => images.map((image) => 
        <Image
            key={image}
            resizeMode='contain'
            style={styles.listImageLarge} 
            source={image}
        />
    );
    
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
                                    <CardItem bordered={data.img.length > 0}>
                                            <Body style={{ alignSelf: 'flex-start' }}>
                                                <Text style={ [styles.bold, styles.cardH1] }>{data.name}</Text>
                                                <Text style={ [styles.cardH2, { color: config.colorPrimary }]}>{data.price}</Text>
                                                {data.desc && <Text style={[styles.smallSection, { color: config.textLight }]}>{data.desc}</Text>}
                                            </Body>
                                    </CardItem>
                                    {data.img.length > 0 && 
                                    <CardItem style={{ flexDirection: 'column', justifyContent: 'center'}}>
                                        {imageList(data.img)}
                                    </CardItem>}
                                </Card>
                            )
                        }}
                    />
                </View>
            </Content>
        </Container>);
}

export { Merchandise }