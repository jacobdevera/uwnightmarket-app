import React, { Component } from 'react';
import { Alert, Image, View, Linking } from 'react-native';
import { Button, Container, Content, Text, Spinner } from 'native-base';
import firebase from 'firebase';
import styles, { config, scale } from './styles';

import { Views } from './App';
import { isStatusActive, acceptTermsAndConditions } from './utils/event';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
    }

    onAttendeeButtonPress() {
        if (!firebase.auth().currentUser) {
            console.log('new user');
            Alert.alert(
                'Terms and Conditions',
                `Please review the terms and conditions to continue.`,
                [
                    {text: 'Skip', style: 'cancel', onPress: () => { 
                            acceptTermsAndConditions(() => {
                                this.setState({ loading: true });
                                this.attendeeSignIn();
                            })
                        }
                    },
                    {text: 'Review', onPress: () => {
                            Linking.openURL('https://kchen73.github.io/uwnightmarket/#legal')
                            acceptTermsAndConditions(() => {
                                this.setState({ loading: true });
                                this.attendeeSignIn();          
                            })
                        }
                    },
                ]
            );
        } else {
            this.props.setView(Views.ATTENDEE);
        }
    }

    attendeeSignIn = () => {
        firebase.auth().signInAnonymously()
            .catch( err =>{
                console.log(err.code);
                console.log(err.message);
            }
        );
    }

    render(){
        return (
            this.state.loading ? <Spinner style={{ marginTop: 'auto', marginBottom: 'auto' }} color={config.colorPrimary} /> :
            <Content contentContainerStyle={[styles.column, { paddingLeft: Math.max(32, 32 * scale), paddingRight: Math.max(32, 32 * scale) }]}>
                <Image
                    style={[styles.logo, { marginTop: 88 }]}
                    resizeMode='contain'
                    source={require('../img/NMlogoblackfont.png')}
                />
                <Text style={[styles.h2, styles.section]}>SAT, MAY 12, 2018 5:30 PM</Text>
                <Text style={[styles.h2]}>RED SQUARE + QUAD</Text>
                <Text style={[styles.lightGrey, { textAlign: 'center'}]}>
                    An annual celebration of Taiwan's rich culture through delicious food, activities, and entertainment!
                </Text>
                <Text style={styles.lightGrey}>Proudly presented by</Text>
                <Image
                    style={styles.logoSmall}
                    resizeMode='contain'
                    source={require('../img/tsa-logo.png')}
                />
                <Text style={{ alignSelf: 'flex-start', paddingLeft: 25 }}> I am a...</Text>
                <View style={styles.row}>
                    <Button onPress={() => { this.onAttendeeButtonPress(); }}>
                        <Text>Attendee</Text>
                    </Button>
                    <Button onPress={() => this.props.setView(Views.LOGIN)}>
                        <Text>Vendor</Text>
                    </Button>
                </View>
            </Content>
         );
    }
}

export { LandingPage }