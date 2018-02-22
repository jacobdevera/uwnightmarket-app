import React from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Card, CardItem, Body, Text, Icon, Left, Right, Thumbnail, List } from 'native-base';
import { StackNavigator } from "react-navigation";


import { AppHeader, StackHeader } from '../components';
import styles from '../styles';

const VendorList = (props) => {
    let items = [
        {
            name: 'Baguette Box',
            desc: 'Specializing in western Chinese fare',
            img: require('../../img/bubble-tea.jpg'),
            menu: ['Cumin Beef Sandwich', 'Cold Rice Noodles', 'Grilled Squid']
        },
        {
            name: 'BeanFish',
            desc: "Seattle's only mobile taiyaki (鯛焼き) artisans",
            img: require('../../img/fish-tofu.jpg'),
            menu: ['Cumin Beef SandWich', 'Cold Rice Noodles', 'Grilled Squid']
        },
        {
            name: 'Capuli Club Sips & Treats',
            desc: 'Artisanal fruit snacks made in Seattle',
            img: require('../../img/bbq-pork-buns.jpg'),
            menu: ['Cumin Beef SandWich', 'Cold Rice Noodles', 'Grilled Squid']
        }
    ];

    return (
        <Container>
            <AppHeader navigation={props.navigation}>
                Vendors / Food
            </AppHeader>
            <Content style={styles.paddedContainer}>
                <List
                    dataArray={items}
                    renderRow={(data) => {
                        return (
                            <Card>
                            <CardItem button onPress={() => { props.navigation.navigate('VendorFood'); }}>
                                <Left>
                                    <Thumbnail
                                        square
                                        style={styles.listImage}
                                        source={data.img}
                                    />
                                </Left>
                                <Body>
                                    <Text style={ [styles.header, styles.cardH1] }>{data.name}</Text>
                                    <Text style={ [styles.desc] }>{data.desc}</Text>
                                    <Text style={styles.bold}>Menu: <Text style={styles.menuItem}>{data.menu.join(', ')}</Text></Text>
                                </Body>
                            </CardItem>
                            </Card>
                        )
                    }}
                />
            </Content>
        </Container>);
}

const VendorFood = (props) => {
    return (
        <Container>
            <StackHeader navigation={props.navigation}>
                Vendors / Food
            </StackHeader>
            <Content style={styles.paddedContainer}>
            </Content>
        </Container>
    );
}

const VendorNavigator = StackNavigator(
    {
        VendorList: { screen: VendorList },
        VendorFood: { screen: VendorFood }
    }, 
    {
        headerMode: 'none'
    }
);

export { VendorNavigator, VendorFood }