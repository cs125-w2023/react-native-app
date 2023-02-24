import { React, useEffect, TouchableOpacity } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreenComponent from './HomeScreenComponent';
import { Icon } from '@rneui/themed';


export default HomeScreen = ({ navigation }) => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator screenOptions={{headerShown: true, headerTransparent: false, headerShadowVisible: false, headerStyle: {backgroundColor: '#311D3F'}}}>
            <Drawer.Screen name="Home" component={HomeScreenComponent} />
        </Drawer.Navigator>
    );
}