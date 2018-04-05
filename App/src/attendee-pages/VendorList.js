import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem, Radio, Badge } from 'native-base';
import { StackNavigator } from "react-navigation";
import firebase from 'firebase'

import { filters } from '../App';
import { AppHeader, StackHeader } from '../components';
import { Spinner } from '../components/common';
import styles, { config } from '../styles';

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    innerContainer: {
        margin: 16,
        backgroundColor: 'white'
    },
});

export default class VendorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendors: [],
            filteredVendors: [],
            filters: filters.map((filter) => { 
                return { name: filter, active: false }
            }),
            modalVisible: false,
            sort: 'number'
        }
        console.log(this.state.filters);
    }
    
    componentDidMount() {
        let vendorRef = firebase.database().ref('/vendors/').orderByKey();
        vendorRef.once('value').then((snapshot) => {
            let vendorList = [];
            snapshot.forEach((vendorSnapshot) => {
                vendorList.push(vendorSnapshot.val());
            });
            this.setState({ vendors: vendorList, filteredVendors: vendorList });
        });
    }

    modalOpen() { this.setState({ modalVisible: true }); }
    modalClose() { this.setState({ modalVisible: false }); }

    toggleFilter = (index) => {
        let newFilters = this.state.filters.slice();
        newFilters[index].active = !newFilters[index].active;

        let newVendors = this.state.vendors.slice();
        let activeFilters = newFilters.filter((filter) => filter.active);

        if (activeFilters.length > 0) {
            newVendors = newVendors.filter((vendor) => {
                let satisfiesFilters = false;
                vendor.menu.forEach((item) => {
                    activeFilters.forEach((filter) => {
                        if (item.traits.includes(filter.name)) {
                            satisfiesFilters = true;
                        }
                    });
                });
                return satisfiesFilters;
            });
        }

        this.setState({ filteredVendors: newVendors, filters: newFilters });
    }

    sort = (type) => {
        let sortToPerform;
        switch (type) {
            case 'number': 
            sortToPerform = (a, b) => {
                return a.boothNumber - b.boothNumber;
            }
            break;

            case 'name':
            sortToPerform = (a, b) => {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }
            break;
        }
        let sortedVendors = this.state.filteredVendors.sort(sortToPerform);
        this.setState({ filteredVendors: sortedVendors, sort: type });
    }

    render() {
        return (
            <Container>
                <AppHeader 
                    navigation={this.props.navigation} 
                    right={<Button transparent onPress={() => this.modalOpen()}><Icon name='funnel' /></Button>}
                >
                    Vendors / Food
                </AppHeader>
                
                <Content style={styles.paddedContainer}>
                    <Modal
                        transparent={true}
                        visible={this.state.modalVisible}
                        animationType={'fade'}
                        onRequestClose={() => this.modalClose()}
                    >
                        <View style={modalStyles.modalContainer}>
                            <View style={modalStyles.innerContainer}>
                                <ListItem itemDivider>
                                    <Text style={[styles.bold, styles.cardH1]}>Sort</Text>
                                </ListItem>
                                    <ListItem onPress={() => this.sort('number')}>
                                        <Text>Booth Number</Text>
                                        <Right>
                                        <Radio selected={this.state.sort === 'number'} />
                                        </Right>
                                    </ListItem>
                                    <ListItem onPress={() => this.sort('name')}>
                                        <Text>Name</Text>
                                        <Right>
                                        <Radio selected={this.state.sort === 'name'} />
                                        </Right>
                                    </ListItem>
                                <ListItem itemDivider>
                                    <Text style={[styles.bold, styles.cardH1]}>Filter</Text>
                                </ListItem>
                                <FlatList
                                    data={this.state.filters}
                                    extraData={this.state}
                                    keyExtractor={ item => item.name }
                                    renderItem={({ item, index }) => {
                                        return (
                                            <ListItem>
                                                <CheckBox 
                                                    color={'#d94d5d'}
                                                    checked={item.active} 
                                                    onPress={() => this.toggleFilter(index)} />
                                                <Body>
                                                    <Text>{item.name}</Text>
                                                </Body>
                                            </ListItem>
                                        );
                                    }}
                                />
                                <View style={styles.row}>
                                    <Button
                                        onPress={() => this.modalClose()}
                                    >
                                        <Text>Close</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    {this.state.vendors ?
                        <FlatList
                            data={this.state.filteredVendors}
                            extraData={this.state}
                            keyExtractor={ item => item.name }
                            renderItem={({ item }) => {
                                let foodNames = [];
                                item.menu.forEach((food) => foodNames.push(food.name));
                                return (
                                    <Card>
                                        <CardItem 
                                            button onPress={() => { this.props.navigation.navigate('VendorFood', {
                                                    vendor: item
                                                }); 
                                            }}
                                        >
                                            <Left>
                                                <Thumbnail
                                                    square
                                                    style={styles.listImage}
                                                    source={{ uri: item.img }}
                                                />
                                            </Left>
                                            <Body>
                                                <View style={styles.rowSmall}>
                                                    <Badge style={{ backgroundColor: config.colorPrimary, marginRight: 8}}>
                                                        <Text>{item.boothNumber}</Text>
                                                    </Badge>
                                                    <Text style={ [styles.header, styles.cardH1] }>{item.name}</Text>
                                                </View>
                                                <Text style={ [styles.desc] }>{item.desc}</Text>
                                                <Text style={styles.bold}>Menu: <Text style={styles.menuItem}>{foodNames.join(', ')}</Text></Text>
                                            </Body>
                                        </CardItem>
                                    </Card>
                                )
                            }}
                        />
                        : <Spinner size='small' />}
                </Content>
            </Container>
        );
    }
}