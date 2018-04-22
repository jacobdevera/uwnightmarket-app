import React from 'react';
import { Image, View } from 'react-native';
import { Container, Content, Text, Thumbnail } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const EventInfo = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Event Info
            </AppHeader>
            <Content contentContainerStyle={styles.paddedContainer}>
                <Image
                    style={[styles.logo, styles.fullWidth, styles.section]}
                    resizeMode='contain'
                    source={require('../../img/NMlogoblackfont.png')}
                />
                <Text style={styles.section}>UW Night Market is FREE to attend, but please bring CASH for food and activities!</Text>
                <Text style={styles.section}>This event is pet-friendly, but please have them leashed.</Text>
                <Text style={styles.section}>This is a non-smoking and family-friendly event.</Text>

                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>Parking</Text>
                    <Text>Free parking available at E1, E12, E18, E19 parking lots (East campus). Limited paid
                        parking available at the Central Plaza Parking Garage.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>Questions?</Text>
                    <Text>Come find us at the Info Booth (located next to Odegaard Undergraduate Library)!</Text>
                </View>
            </Content>
        </Container>
    );
}

export { EventInfo }