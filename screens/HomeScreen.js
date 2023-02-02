import { React, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Context as UserContext } from '../contexts/UserContext';

export default HomeScreen = ({ navigation }) => {
    const userContext = useContext(UserContext);

    console.log(userContext.state);
    return (
        <View style={styles.view}>
            <SafeAreaView style={styles.safeAreaView}>
                <Text></Text>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    view: {
        flex: 1,
        backgroundColor: '#311D3F'
    }
})