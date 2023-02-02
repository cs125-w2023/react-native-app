import axios from 'axios';
import { React, useState, useContext } from 'react';
import { Image, View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, LayoutAnimation, Alert } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Context as UserContext } from '../contexts/UserContext';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

const signUp = ({ navigation, email, password, userContext }) => {
    if (email == "" || password == "") {
        Alert.alert(
            "",
            "Please put in both email and password.",
            [
                {
                    text: "Close",
                    style: "cancel"
                }
            ]
        );
    } else {
        axios.post(
            "http://cs125-api-env.eba-55euqiex.us-west-1.elasticbeanstalk.com/users",
            {
                email, 
                password
            },
            config
        )
        .then(response => {
            if (response.status == 200) {
                login({navigation, email, password, userContext});
            } else {
                Alert.alert(
                    "",
                    "An error occurred.",
                    [
                        {
                            text: "Close",
                            style: "cancel"
                        }
                    ]
                )
            }
        })
        .catch(error => {
            console.log(error);
            Alert.alert(
                "",
                "User already exists.",
                [
                    {
                        text: "Close",
                        style: "cancel"
                    }
                ]
            )
        });
    }
}

const login = ({ navigation, email, password, userContext }) => {
    if (email == "" || password == "") {
        Alert.alert(
            "",
            "Please put in both email and password.",
            [
                {
                    text: "Close",
                    style: "cancel"
                }
            ]
        );
    } else {
        axios.post(
            "http://cs125-api-env.eba-55euqiex.us-west-1.elasticbeanstalk.com/login",
            {
                email, 
                password
            },
            config
        )
        .then(response => {
            if (response.status == 200) {
                userContext.set(response.data.entity.id);
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert(
                    "",
                    "An error occurred.",
                    [
                        {
                            text: "Close",
                            style: "cancel"
                        }
                    ]
                )
            }
        })
        .catch(error => {
            console.log(error);
            Alert.alert(
                "",
                "Incorrect email or password",
                [
                    {
                        text: "Close",
                        style: "cancel"
                    }
                ]
            )
        });
    }
}


export default LaunchScreen = ({ navigation }) => {
    const [expanded, setExpanded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userContext = useContext(UserContext);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#E23E57'}}>
            <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={styles.keyboardAwareScrollView}>
                    <Image style={styles.image} source={require('../assets/iCare.png')} />
                    {expanded && (
                        <View>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize='none'
                                placeholder='Email'
                                onChangeText={setEmail}/>
                            <TextInput
                                style={styles.textInput}
                                autoCapitalize='none'
                                placeholder='Password'
                                onChangeText={setPassword}
                                secureTextEntry={true}/>
                            <View style={styles.viewButtons}>
                                <TouchableOpacity 
                                    id='loginButton'
                                    style={styles.button}
                                    onPress={() => {login({navigation, email, password, userContext});}}>
                                    <Text style={{color: 'white', fontSize: 16}}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    id='signUpButton'
                                    style={styles.button}
                                    onPress={() => {signUp({navigation, email, password, userContext})}}>
                                    <Text style={{color: 'white', fontSize: 16}}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {!expanded && (
                        <View style={styles.viewButtons}>
                            <TouchableOpacity 
                                id='getStartedButton'
                                style={styles.button}
                                onPress={() => {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                    setExpanded(!expanded);
                                }}>
                                <Text style={{color: 'white', fontSize: 16}}>Get Started</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        // width: 150,
        // height: 50,
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#88304E',
        margin: 5,
        // display: 'none'
    },
    image: {
        width: 250,
        height: 250,
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
        // display: 'none'
    },
    viewButtons: {
        flexDirection: 'row',
        width: 260,
        height: 60,
    }
})