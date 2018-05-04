import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, List, ListItem, Radio, Badge, Spinner, Input, Item } from 'native-base';
import { StackNavigator } from "react-navigation";
import firebase from 'firebase'

import { filters } from '../App';
import { sortByBoothNumber, sortByName } from '../utils/vendor';
import { AppHeader, StackHeader } from '../components';
import styles, { config, scale, modalStyles, moderateScale } from '../styles';

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
            sort: 'name',
            canOrderFilter: false,
            query: ''
        }
    }
    
    componentDidMount() {
        let vendorRef = firebase.database().ref('/vendors/').orderByKey();
        vendorRef.once('value').then((snapshot) => {
            let vendorList = [];
            snapshot.forEach((vendorSnapshot) => {
                vendorList.push(vendorSnapshot.val());
            });
            vendorList = vendorList.sort(sortByName);
            this.setState({ vendors: vendorList, filteredVendors: vendorList });
        });
    }

    modalOpen() { this.setState({ modalVisible: true }); }
    modalClose() { this.setState({ modalVisible: false }); }

    toggleFilter = (index) => {
        let newFilters = this.state.filters.slice();
        newFilters[index].active = !newFilters[index].active;
        let newVendors = this.filterVendors(newFilters.filter(filter => filter.active));

        newVendors = this.state.canOrderFilter ? newVendors.filter(vendor => vendor.canOrder) : newVendors;

        this.setState({ filteredVendors: newVendors, filters: newFilters });
    }

    filterVendors = (filters) => {
        let newVendors = JSON.parse(JSON.stringify(this.state.vendors));
        
        if (filters.length > 0) {
            newVendors = newVendors.filter((vendor) => {
                vendor.menu = vendor.menu.filter((item) => {
                    let satisfiesAFilter = false;
                    filters.forEach((filter) => {
                        if (item.traits.includes(filter.name))
                            satisfiesAFilter = true;
                    })
                    return satisfiesAFilter;
                })
                return vendor.menu.length > 0;
            });
        }
        return newVendors;
    }

    toggleCanOrderFilter = () => {
        let canOrderFilter = !this.state.canOrderFilter;
        let newVendors = this.filterVendors(this.state.filters.filter(filter => filter.active));
        newVendors = canOrderFilter ? newVendors.filter(vendor => vendor.canOrder) : newVendors;

        this.setState({ canOrderFilter: canOrderFilter, filteredVendors: newVendors });
    }

    sort = (type) => {
        let sortToPerform;
        switch (type) {
            case 'number': 
            sortToPerform = sortByBoothNumber;
            break;

            case 'name':
            sortToPerform = sortByName;
            break;
        }
        let sortedVendors = this.state.filteredVendors.sort(sortToPerform);
        this.setState({ filteredVendors: sortedVendors, sort: type });
    }
    
    resetFilters = () => {
        let newFilters = this.state.filters.slice();
        newFilters.forEach((filter) => { filter.active = false });
        return newFilters;
    }

    onSearch = (query) => {
        query = query.toLowerCase();
        let newFilters = this.resetFilters();
        let newVendors = JSON.parse(JSON.stringify(this.state.vendors));

        newVendors = newVendors.filter((vendor) => {
            if (vendor.name.toLowerCase().indexOf(query) > -1 || query.length < 1) 
                return true;
            let hasMatchingMenuItem = false;
            vendor.menu = vendor.menu.filter((item) => item.name.toLowerCase().indexOf(query) > -1);
            return vendor.menu.length > 0;
        });
        newVendors = newVendors.sort(sortByName);
        this.setState({ filteredVendors: newVendors, filters: newFilters, canOrderFilter: false, sort: 'name' })
    }

    render() {
        let { vendors, filteredVendors, sort, filters, canOrderFilter, modalVisible } = this.state;
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
                        visible={modalVisible}
                        animationType={'fade'}
                        onRequestClose={() => this.modalClose()}
                    >
                        <TouchableOpacity 
                            style={modalStyles.modalContainer} 
                            activeOpacity={1} 
                            onPressOut={() => {this.modalClose()}}
                        >
                            <TouchableWithoutFeedback>
                                <View style={modalStyles.innerContainer}>
                                    <ListItem style={{ borderBottomWidth: 0 }}>
                                        <Text style={[styles.bold]}>Sort</Text>
                                    </ListItem>
                                    <View style={{ flex: 1 }}>
                                        <ListItem style={{ justifyContent: 'space-between' }} 
                                            onPress={() => this.sort('number')}
                                        >
                                            <Text>Booth Number</Text>
                                            <Right>
                                                <Radio onPress={() => this.sort('number')} selected={this.state.sort === 'number'} />
                                            </Right>
                                        </ListItem>
                                        <ListItem style={{ justifyContent: 'space-between' }} 
                                            onPress={() => this.sort('name')}
                                        >
                                            <Text>Name</Text>
                                            <Right>
                                                <Radio onPress={() => this.sort('name')} selected={this.state.sort === 'name'} />
                                            </Right>
                                        </ListItem>
                                        <ListItem style={{ borderBottomWidth: 0 }}>
                                            <Text style={[styles.bold]}>Filter</Text>
                                        </ListItem>
                                        <ScrollView contentContainerStyle={{ flexGrow: 0 }}>
                                            <ListItem button onPress={() => this.toggleCanOrderFilter()}>
                                                <CheckBox 
                                                    color={'#d94d5d'}
                                                    checked={canOrderFilter} 
                                                    onPress={() => this.toggleCanOrderFilter()}
                                                />
                                                <Body>
                                                    <Text>supports mobile ordering</Text>
                                                </Body>
                                            </ListItem>
                                            <FlatList
                                                scrollEnabled={false}
                                                data={filters}
                                                extraData={this.state}
                                                keyExtractor={ item => item.name }
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <ListItem button onPress={() => this.toggleFilter(index)}>
                                                            <CheckBox 
                                                                color={'#d94d5d'}
                                                                checked={item.active} 
                                                                onPress={() => this.toggleFilter(index)}
                                                            />
                                                            <Body>
                                                                <Text>{item.name}</Text>
                                                            </Body>
                                                        </ListItem>
                                                    );
                                                }}
                                            />
                                        </ScrollView>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                                            <Button
                                                transparent
                                                style={{ alignSelf: 'flex-end' }}
                                                onPress={() => this.modalClose()}
                                            >
                                                <Text>Close</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </TouchableOpacity>
                    </Modal>
                    {vendors && vendors.length > 0 ?
                        <View>
                            <View style={styles.section}>
                                <Item regular
                                    style={{ borderRadius: 8 }}>
                                    <Icon name='search' style={{ color: config.textLight, fontSize: 18 }} />
                                    <Input placeholder='search for vendors or menu items...'
                                        style={{ 
                                            fontFamily: 'Montserrat-Regular', 
                                            paddingLeft: 2, 
                                            height: 35, 
                                            fontSize: 14
                                        }}
                                        placeholderTextColor={config.textLight}
                                        onChangeText={(query) => {
                                            this.onSearch(query);
                                        }}
                                    />
                                </Item>
                            </View>
                            <FlatList
                                style={[styles.section, styles.last]}
                                data={filteredVendors}
                                extraData={this.state}
                                keyExtractor={ item => item.name }
                                renderItem={({ item }) => {
                                    let foodNames = item.menu.slice(0, 3).map((item, index) => item.name + (index >= 2 ? '...': ''));
                                    let bodyLeftMargin = item.img.length > 0 ? 8 : 0;
                                    return (
                                        <Card>
                                            <CardItem style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 }}
                                                button onPress={() => { this.props.navigation.navigate('VendorFood', {
                                                        vendor: item,
                                                        isAttendee: true
                                                    }); 
                                                }}
                                            > 
                                                {item.img.length > 0 &&
                                                <View style={{paddingTop: 10, paddingBottom: 10 }}>
                                                    <Image
                                                        resizeMode="contain"
                                                        style={[styles.listImage]}
                                                        source={{ uri: item.img }}
                                                    />
                                                </View>}
                                                <Body style={{
                                                    paddingLeft: 10, 
                                                    marginLeft: bodyLeftMargin, 
                                                    alignSelf: 'flex-start', 
                                                    borderLeftWidth: StyleSheet.hairlineWidth, 
                                                    borderLeftColor: '#ccc', 
                                                    paddingTop: 10, 
                                                    paddingBottom: 10
                                                }}>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <Badge style={styles.badge}>
                                                            <Text>{item.boothNumber}</Text>
                                                        </Badge>
                                                        <Text style={ [{flex: 1, flexWrap: 'wrap'},styles.bold, styles.cardH1] }>{item.name}</Text>
                                                    </View>

                                                    {item.desc.length > 0 && <Text style={ [styles.desc, styles.smallSection] }>{item.desc}</Text>}
                                                    <View>
                                                        <Text style={[styles.bold, styles.smallSection, styles.cardH2] }>Menu:</Text>
                                                        <Text style={[styles.menuItem]}>{foodNames.join(', ')}</Text>
                                                    </View>
                                                    {item.canOrder && 
                                                    <View style={{ position: 'absolute', top: 8, right: -4 }}>
                                                        <Icon name='mobile' 
                                                            type='Entypo'
                                                            style={{ fontSize: moderateScale(20), color: config.colorPrimary }}
                                                        />
                                                    </View>}
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    )
                                }}
                            />
                        </View>
                        : <Spinner color={config.colorPrimary} />}
                </Content>
            </Container>
        );
    }
}