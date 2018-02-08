import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, H1, H2, H3, Text } from 'native-base';

import { AppHeader } from '../components';

const VendorsFood = (props) => {
    return (<Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Text>Vendors / Food</Text>
        </Container>);
}

export { VendorsFood }