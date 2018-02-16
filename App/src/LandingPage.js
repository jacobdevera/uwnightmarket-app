import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Text } from 'native-base';
import styles from './styles';

const LandingPage = (props) => {
   return (
      <Content contentContainerStyle={styles.column}>
         <Image
            style={[styles.logo]}
            resizeMode="contain"
            source={require('../img/NMlogoblackfont.png')}
         />
         <Text style={[styles.header,styles.h2]}>SAT, MAY 12, 2018 5:30 PM</Text>
         <Text style={[styles.header,styles.h2]}>RED SQUARE + QUAD</Text>
         <Text style={{ textAlign: 'center' }}>
            An annual celebration of Taiwan's rich culture through delicious food, activities, and entertainment!
         </Text>
         <Text>Proudly presented by</Text>
         <Image
            style={styles.logoSmall}
            resizeMode="contain"
            source={require('../img/tsa-logo.png')}
         />
         <Text style={{ alignSelf: 'flex-start', paddingLeft: 25 }}> I am a...</Text>
         <View style={styles.row}>
            <Button onPress={() => props.setView(1)}>
               <Text>Attendee</Text>
            </Button>
            <Button onPress={() => props.setView(2)}>
               <Text>Vendor</Text>
            </Button>
         </View>
      </Content>
   );
}

export { LandingPage }