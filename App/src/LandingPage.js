import React, { Component } from 'react';
import { Alert, Image, View } from 'react-native';
import { Button, Container, Content, Text } from 'native-base';
import firebase from 'firebase';
import styles from './styles';

import { Views } from './App';
import { Spinner } from './components/common';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: ''
        };
    }

    onAttendeeButtonPress() {
        this.setState({ error: '', loading: true });
        this.attendeeSignIn();
    }

    attendeeSignIn = () => {
        firebase.auth().signInAnonymously()
            .then((response) => {
                firebase.database().ref(`/status/`).once('value').then((snapshot) => {
                    let status = snapshot.val();
                    if (status && !status.active) {
                        Alert.alert(
                            'Oops',
                            'Looks like the night market has not started yet.',
                            [
                                {text: 'OK', style: 'cancel'}
                            ]
                        );
                        firebase.auth().currentUser.delete().catch(err => console.log(err));
                    }
                });
            }).catch( err =>{
                console.log(error.code);
                console.log(error.message);
                this.onLoginFail.bind(this);
            }
        );
    }
    
    onLoginFail(){
        this.setState({
            error: 'Authentication Failed',
            loading: false
        });
    }

    render(){
        return (
            this.state.loading ? <Spinner size='small' /> :
            <Content contentContainerStyle={styles.column}>
                <Image
                    style={[styles.logo]}
                    resizeMode='contain'
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