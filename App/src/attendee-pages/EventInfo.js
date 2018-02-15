import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const EventInfo = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Event Info
            </AppHeader>
            <Content contentContainerStyle={styles.column}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require('../../img/NMlogoblackfont.png')}
                />
                <Text>UW Night Market is FREE to attend, but please bring CASH for food and activities!</Text>
                <Text>This event is pet-friendly, but please have them leashed.</Text>
                <Text>This is a non-smoking and family-friendly event.</Text>

                <View>
                    <Text style={[styles.header, styles.h2, styles.center]}>Parking</Text>
                    <Text>Free parking available at E1, E12, E18, E19 parking lots (East campus). Limited paid
                        parking available at the Central Plaza Parking Garage.
                    </Text>
                </View>

                <View>
                    <Text style={[styles.header, styles.h2, styles.center]}>Questions?</Text>
                    <Text>Come find us at the Info Booth (located next to Odegaard Undergraduate Library)!</Text>
                </View>
            </Content>
        </Container>
    );
}

export { EventInfo }