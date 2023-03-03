import axios from 'axios';
import { React, useState, useContext, useEffect, useRef } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, LayoutAnimation, Alert, Button } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import { Context as UserContext } from '../contexts/UserContext';
import { Icon } from '@rneui/themed';

const bodyTypes = ['Slim', 'Fit', 'Heavy']

const save = ({ navigation, age, bodyType, userContext}) => {
    var age = parseInt(age);
    if(age == 0) {
        Alert.alert('Please enter a valid age');
        return;
    }
    var bodyTypeId;
    if(bodyType=='Slim') {
        bodyTypeId = 1;
    }
    else if(bodyType=='Fit') {
        bodyTypeId = 2;
    }
    else if(bodyType=='Heavy') {
        bodyTypeId = 3;
    }
    else {
        Alert.alert('Please enter a valid bodyType');
        return;
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
    const [age, setAge] = useState(0);
    const [bodyType, setBodyType] = useState('none');
    const userContext = useContext(UserContext);
    const dropdownRef = useRef({})

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={styles.keyboardAwareScrollView}>
                    <Text style={styles.pageHeading}>Settings</Text>
                    <View style={styles.pageContent}>
                        <View style={styles.viewAge}>
                            <Text style={styles.textLabel}>
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
                            <Text style={styles.textLabel}>
                                Set Body Type:
                            </Text>
                            <SelectDropdown
                                data={bodyTypes}
                                onSelect={setBodyType}
                                buttonStyle={styles.dropdownButton}
                                dropdownIconPosition='right'
                                ref={dropdownRef}
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
    pageHeading: {
        fontSize: 40,
        alignSelf: 'center',
        margin: 30,
        flex: 1
    },
    cancelButton: {
        // width: 150,
        height: 50,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        // borderWidth: 1
        // display: 'none'
    },
    saveButton: {
        // width: 150,
        height: 50,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E23E57',
        marginHorizontal: 10,
        // display: 'none'
    },
    saveButtonText: {
        color: '#FFFFFF',
    },
    keyboardAwareScrollView: {
        flex: 1,
        alignItems: 'stretch',
    },
    textInput: {
        borderWidth: 1,
        width: 50,
        height: 50,
        borderRadius: 10,
        padding: 10,
        margin: 5,
        backgroundColor: 'white',
        // display: 'none'
    },
    dropdownButton: {
        width: 100
    },
    pageContent: {
        justifyContent: 'flex-start',
        flex: 8
    },
    viewAge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginHorizontal: 50
    },
    viewBodyType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginHorizontal: 50
    },
    viewButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginHorizontal: 50
        // borderWidth: 1
    },
    textLabel: {
        fontSize: 20
    }
})