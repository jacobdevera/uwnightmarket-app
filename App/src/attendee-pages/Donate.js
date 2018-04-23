import React, { Component } from 'react';
import { Image, View, Linking } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Donate = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Donate
            </AppHeader>
            <Content contentContainerStyle={styles.paddedContainer}>
                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>We Need Your Help!</Text>
                    <Text>Every year, our hardworking officers spend months on months of planning for 
                        the day of the event. Kind of like a part-time job! However, we cannot do this 
                        without the help of the public. The costs include tens of thousands on facilities, 
                        foods, prizes, and much more. We love giving to our community by educating everyone 
                        about Taiwanese culture, but we would not be able to do it without you. Please 
                        donate to our cause on our USEED page, and have fun today! Thank you!</Text>
                </View>

                <Text style={styles.section}>Link to our donation page:{`\n`}
                <Text 
                    style={styles.link} onPress={() => {
                    Linking.openURL('https://give.funderbolt.com/uw/uw-tsa');
                }}>https://give.funderbolt.com/uw/uw-tsa</Text></Text>
            </Content>
        </Container>);
}

export { Donate }