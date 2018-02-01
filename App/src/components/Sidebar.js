import React, { Component } from 'react';
import { Content, List, ListItem, Text } from 'native-base';
import styles from '../styles';

const Sidebar = () => {
   let items = ['Vendors / Food',
      'Map',
      'Games',
      'Merchandise',
      'Event Info',
      'Donate'
   ];

   let menu = items.map((item, index) =>
      <ListItem key={index} noBorder>
         <Text style={styles.light}>{item}</Text>
      </ListItem>);
   return (
      <Content style={styles.sideBar}>
         <List>
            {menu}
         </List>
      </Content>
   );
}
export { Sidebar };