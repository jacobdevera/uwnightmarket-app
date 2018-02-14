import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right, Thumbnail } from 'native-base';

import { AppHeader } from '../components';
import styles from '../styles';

const VendorsFood = (props) => {
    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Content style={styles.list}>
                <Card>
                    <CardItem>
                        <Left>
                            <Thumbnail
                                square
                                style={styles.listImage}
                                source={require('../../img/bubble-tea.jpg')}
                            />
                        </Left>
                        <Body>
                            <Text style={styles.cardHeader}>Bubble Tea</Text>
                            <Text>$3.49</Text>
                            <Button>
                                <Text>Add to Order</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
        </Container>);
}

export { VendorsFood }