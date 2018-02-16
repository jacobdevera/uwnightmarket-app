import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Donate = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Donate
            </AppHeader>
            <Content contentContainerStyle={styles.column}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require('../../img/NMlogoblackfont.png')}
                />

                <View>
                    <Text style={[styles.header, styles.h2, styles.center]}>We Need Your Help!</Text>
                    <Text>Night Market is a huge event that grows incredibly fast. Last year, we had an attendance of 7,000 people...</Text>
                </View>
                
                <View>
                    <Text style={[styles.header, styles.h2]}>Cost Breakdown</Text>
                    <Text>Facilities: ~$30,000</Text>
                </View>

                <Text>PLEASE DONATE! Visit the Info Booth next to Odegaard Library.</Text>
            </Content>
        </Container>);
}

export { Donate }