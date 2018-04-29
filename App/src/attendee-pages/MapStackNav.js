import React, { Component } from 'react';
import { Image, View, Modal, StyleSheet, FlatList } from 'react-native';
import { Button, Container, Content, Card, CardItem, CheckBox, Body, Text, Icon, Left, Right, Thumbnail, List, ListItem } from 'native-base';
import { StackNavigator } from "react-navigation";
import firebase from 'firebase'

import VendorFood from './VendorFood';
import { Map } from './Map';

const MapStackNav = StackNavigator(
    {
        MapView: { screen: Map },
        VendorView: { 
            screen: VendorFood, 
            navigationOptions: ({navigation}) => ({
                drawerLockMode: 'locked-closed'
            })
        }
    },
    {
        headerMode: 'none'
    }
);

export { MapStackNav }