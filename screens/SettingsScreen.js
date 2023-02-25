import axios from 'axios';
import { React, useState, useContext, useEffect } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, LayoutAnimation, Alert, Button } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import { Context as UserContext } from '../contexts/UserContext';
import { Icon } from '@rneui/themed';

const bodyTypes = ['Slim', 'Fit', 'Heavy']

const save = ({ navigation, age, bodyType, userContext}) => {
    var age = parseInt(age);
    var bodyTypeId;
    if(bodyType=='Slim') {
        bodyTypeId = 1;
    }
    else if(bodyType=='Fit') {
        bodyTypeId = 2;
    }
    else {
        bodyTypeId = 3;
    }
    axios.put(
        `http://cs125-api-env.eba-55euqiex.us-west-1.elasticbeanstalk.com/users/${userContext.state}/info`,
        {
            age,
            bodyTypeId
        }
    ).then((response) => {
        if(response.status == 200) {    
            Alert.alert('Settings Saved!');
            navigation.goBack();
        }
    }).catch((error) => {
        console.log(error.message);
    });
}

export default SettingsScreen = ({ navigation }) => {
    const [age, setAge] = useState('');
    const [bodyType, setBodyType] = useState('');
    const userContext = useContext(UserContext);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={styles.keyboardAwareScrollView}>
                    <Text>Settings</Text>
                    <View>
                        <View style={styles.viewAge}>
                            <Text>
                                Set Age:
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Age'
                                keyboardType='number-pad'
                                value={age}
                                onChangeText={setAge}
                            />
                        </View>

                        <View style={styles.viewBodyType}>
                            <Text>
                                Set Body Type:
                            </Text>
                            <SelectDropdown
                                data={bodyTypes}
                                onSelect={setBodyType}
                            />
                        </View>

                        <View style={styles.viewButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={()=>{navigation.goBack();}}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={()=>{save({navigation, age, bodyType, userContext});}} >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cancelButton: {
        // width: 150,
        // height: 50,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        // display: 'none'
    },
    saveButton: {
        // width: 150,
        // height: 50,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E23E57',
        margin: 5,
        // display: 'none'
    },
    saveButtonText: {
        color: '#FFFFFF',
    },
    keyboardAwareScrollView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        borderWidth: 1,
        width: 250,
        height: 50,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        backgroundColor: 'white',
        // display: 'none'
    },
    viewAge: {},
    viewBodyType: {},
    viewButtons: {
        flexDirection: 'row',
        width: 260,
        height: 60,
    }
})