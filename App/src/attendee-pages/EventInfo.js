import React from 'react';
import { Image, View, FlatList } from 'react-native';
import { Container, Content, Text, Thumbnail } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const EventInfo = (props) => {
    let sponsors = [
        {
            key: 'GPSS',
            uri: require('../../img/GPSS.png')
        },
        {
            key: 'HUB',
            uri: require('../../img/HUB.png')
        },
        {
            key: 'LIV',
            uri: require('../../img/LIV.png')
        },
        {
            key: 'sparkling-ice',
            uri: require('../../img/sparkling-ice.png')
        },
        {
            key: 'TECO',
            uri: require('../../img/TECO.png')
        },
        {
            key: 'uwbookstore',
            uri: require('../../img/uwbookstore.png')
        },
        {
            key: 'UWOMAD',
            uri: require('../../img/UWOMAD.png')
        },
        {
            key: 'weichuan',
            uri: require('../../img/weichuan.png')
        },
        {
            key: 'wells-fargo',
            uri: require('../../img/wells-fargo.png')
        },
        {
            key: 'uwajimaya',
            uri: require('../../img/uwajimaya.jpg')
        }
    ]
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
                <Text style={styles.section}>
                    Welcome to UW Night Market! Established in 2001, 
                    the UW Night Market has been held by UW's Taiwanese Student Association for 
                    the past 17 years, and this is now our 18th Night Market. We're so happy you 
                    are here to join us. We hope you have fun today!
                </Text>

                <Text style={[styles.section, styles.bold]}>
                    The event is from 5:30PM-10:30PM.
                </Text>

                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>Parking</Text>
                    <Text>Central Parking Garage - free parking for public (Central Plaza Garage, Seattle, WA 98105). Parking is first come, first served.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>Payment</Text>
                    <Text>We are only accepting cash or vouchers! To purchase vouchers, please have
                        your credit/debit cards ready at the <Text style={styles.bold}>Information Booth</Text> located in front 
                        of Odegaard Library.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>Questions</Text>
                    <Text>If you have any questions, feel free to find us at 
                        the <Text style={styles.bold}>Information Booth</Text> located in front 
                        of Odegaard Library and in the middle of Red Square 
                        behind TSA Food Booth. You can also message the Taiwanese Student 
                        Association Facebook page or contact our TSA phone number: <Text style={styles.bold}>(281) 698-7289</Text>.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.header, styles.h2, styles.center]}>Sponsors</Text>
                    <Text>We would like to thank the following sponsors for supporting the UW Night Market this year:</Text>
                    <FlatList
                        data={sponsors}
                        extraData={props}
                        renderItem={({item}) => {
                            return (
                                <Image
                                    style={[styles.listImage, styles.fullWidth, styles.section]}
                                    resizeMode='contain'
                                    source={item.uri}
                                />
                            );
                        }}
                    />
                </View>
            </Content>
        </Container>
    );
}

export { EventInfo }