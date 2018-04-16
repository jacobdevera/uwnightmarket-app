import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import firebase from 'firebase';

import { Container, Content, Left, Icon, Button, Text } from 'native-base';
import { Card, CardSection, Input, Spinner } from '../components/common';
import { AppHeader } from '../components';
import { Views } from '../App';
import styles from '../styles';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', loading: false };
  }

  onButtonPress = () => {
    const { email, password } = this.state;
    this.setState({ error: '', loading: true });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then()//this.onLoginSuccess.bind(this))
      .catch(this.onLoginFail.bind(this));
  }

  onLoginFail() {
    this.setState({ error: 'Authentication Failed', loading: false });
  }

  onLoginSuccess() {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false
    });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <View style={styles.row}>
        <Button onPress={() => this.onButtonPress()}>
          <Text>Log in</Text>
        </Button>
      </View>
    );
  }

  render() {
    return (
        <Container>
          <AppHeader 
            left={<Left>
                <Button transparent
                  onPress={() => this.props.setView(Views.INITIAL)}
                >
                  <Icon name='arrow-back' />
                </Button>
            </Left>}
          > 
            Log In
          </AppHeader>
          <Content>
            <Card>
              <CardSection>
                <Input
                  placeholder="user@gmail.com"
                  label="Email"
                  value={this.state.email}
                  autoCapitalize='none'
                  onChangeText={email => this.setState({ email })}
                />
              </CardSection>

              <CardSection>
                <Input
                  secureTextEntry
                  placeholder="password"
                  label="Password"
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                />
              </CardSection>
            </Card>
            <Text style={styles.errorTextStyle}>
                {this.state.error}
            </Text>
            {this.renderButton()}
          </Content>
        </Container>
    );
  }
}

export { LoginForm };
