import { React, useEffect, TouchableOpacity } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreenComponent from './HomeScreenComponent';
import SettingsScreen from './SettingsScreen';
import { Icon } from '@rneui/themed';
import LaunchScreen from './LaunchScreen';


export default HomeScreen = ({ navigation }) => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator screenOptions={{headerShown: true, headerTransparent: false, headerShadowVisible: false, headerStyle: {backgroundColor: '#311D3F'}, swipeEnabled: false, drawerStyle: {backgroundColor: '#311D3F'}}}>
            <Drawer.Screen name="Home" component={HomeScreenComponent} options={{drawerLabelStyle: styles.drawerLabel}} />
            <Drawer.Screen name="Settings" component={SettingsScreen} options={{drawerLabelStyle: styles.drawerLabel}} />
        </Drawer.Navigator>
    );
}

const styles = {
    drawerLabel: {
        color: 'white',
        fontSize: 30,
    }
}