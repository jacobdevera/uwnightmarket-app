import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const Merchandise = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Merchandise
            </AppHeader>
            <Content>
            </Content>
        </Container>);
}

export { Merchandise }