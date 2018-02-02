import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Content, H1, H2, H3, Text } from 'native-base';
import styles from '../styles';

const LandingPage = () => {
   return (
      <View style={styles.column}>
         <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../../img/NMlogoblackfont.png')}
         />
         <H3>SAT, MAY 12, 2018 5:30 PM</H3>
         <H3>RED SQUARE + QUAD</H3>
         <Text style={{ textAlign: 'center' }}>
            An annual celebration of Taiwan's rich culture through delicious food, activities, and entertainment!
         </Text>
         <Text>Proudly presented by</Text>
         <Image
            style={styles.logoSmall}
            resizeMode="contain"
            source={require('../../img/tsa-logo.png')}
         />
         <Text style={{ alignSelf: 'flex-start', paddingLeft: 25 }}> I am a...</Text>
         <View style={styles.row}>
            <Button>
               <Text>Attendee</Text>
            </Button>
            <Button>
               <Text>Vendor</Text>
            </Button>
         </View>
      </View>
   );
}

export { LandingPage }