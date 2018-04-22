import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, List, ListItem, Radio, Badge, Spinner } from 'native-base';
import { StackNavigator } from "react-navigation";
import firebase from 'firebase'

import { filters } from '../App';
import { AppHeader, StackHeader } from '../components';
import styles, { config, scale } from '../styles';

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    innerContainer: {
        flex: 1,
        margin: Math.max(32, 32 * scale),
        backgroundColor: 'white',
        borderRadius: 8
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
            sort: 'name',
            canOrderFilter: false
        }
    }
    
    componentDidMount() {
        let vendorRef = firebase.database().ref('/vendors/').orderByKey();
        vendorRef.once('value').then((snapshot) => {
            let vendorList = [];
            snapshot.forEach((vendorSnapshot) => {
                vendorList.push(vendorSnapshot.val());
            });
            vendorList = vendorList.sort(this.sortByName);
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
                filters.forEach((filter) => {
                    vendor.menu = vendor.menu.filter((item) => {
                        return item.traits.includes(filter.name)
                    })
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

    sortByBoothNumber = (a, b) => a.boothNumber - b.boothNumber;

    sortByName = (a, b) => a.name.localeCompare(b.name);

    sort = (type) => {
        let sortToPerform;
        switch (type) {
            case 'number': 
            sortToPerform = this.sortByBoothNumber;
            break;

            case 'name':
            sortToPerform = this.sortByName;
            break;
        }
        let sortedVendors = this.state.filteredVendors.sort(sortToPerform);
        this.setState({ filteredVendors: sortedVendors, sort: type });
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
                        {/*<View style={modalStyles.modalContainer}>*/}
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
                                                <Radio selected={this.state.sort === 'number'} />
                                            </Right>
                                        </ListItem>
                                        <ListItem style={{ justifyContent: 'space-between' }} 
                                            onPress={() => this.sort('name')}
                                        >
                                            <Text>Name</Text>
                                            <Right>
                                                <Radio selected={this.state.sort === 'name'} />
                                            </Right>
                                        </ListItem>
                                        <ListItem style={{ borderBottomWidth: 0 }}>
                                            <Text style={[styles.bold]}>Filter</Text>
                                        </ListItem>
                                        <ScrollView contentContainerStyle={{ flexGrow: 0 }}>
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
                                        </ScrollView>
                                        <View style={styles.row}>
                                            <Button
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
                        {/*</View>*/}
                    </Modal>
                    {vendors && vendors.length > 0 ?
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
                                        <CardItem style={{ paddingLeft: 8, paddingRight: 8 }}
                                            button onPress={() => { this.props.navigation.navigate('VendorFood', {
                                                    vendor: item
                                                }); 
                                            }}
                                        >
                                            <Left>
                                                {item.img.length > 0 &&
                                                <Image
                                                    resizeMode="contain"
                                                    style={styles.listImage }
                                                    source={{ uri: item.img }}
                                                />}
                                                <Body style={{ marginLeft: bodyLeftMargin, alignSelf: 'flex-start' }}>
                                                    <View style={{ flexDirection:'row' }}>
                                                        <Badge style={{ backgroundColor: config.colorPrimary, marginRight: 8}}>
                                                            <Text>{item.boothNumber}</Text>
                                                        </Badge>
                                                        <Text style={ [{flex: 3 },styles.header, styles.cardH1] }>{item.name}</Text>
                                                        {item.canOrder && 
                                                        <Image
                                                            resizeMode="contain"
                                                            style={[styles.icon]}
                                                            source={require('../../img/mobile-order-support-icon.png')}
                                                        />}
                                                    </View>
                                                    {item.desc.length > 0 && <Text style={ [styles.desc, styles.smallSection] }>{item.desc}</Text>}
                                                    <Text style={ [styles.bold, styles.smallSection] }>Menu:</Text><Text style={styles.menuItem}>{foodNames.join(', ')}</Text>
                                                </Body>
                                            </Left>
                                        </CardItem>
                                    </Card>
                                )
                            }}
                        />
                        : <Spinner color={config.colorPrimary} />}
                </Content>
            </Container>
        );
    }
}