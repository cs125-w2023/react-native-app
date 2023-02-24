import { React, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity, FlatList } from 'react-native';
import { Context as UserContext } from '../contexts/UserContext';
import { Icon } from '@rneui/themed';
import axios from 'axios';


const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export default HomeScreenComponent = ({ navigation }) => {
    const today = new Date();
    var progress = [
        {day: "Su", status: 0}, 
        {day: "M", status: 0}, 
        {day: "Tu", status: 0},
        {day: "W", status: 0},
        {day: "Th", status: 0},
        {day: "F", status: 0},
        {day: "Sa", status: 0}
    ];
    const userContext = useContext(UserContext);
    const [plan, setPlan] = useState();

    // useEffect can't be async (b/c it can't return anything i.e. promise),
    // therefore, async function is declared inside
    useEffect(() => {
        // async function ALWAYS return promise
        const getPlan = async ( userId ) => {
            var toReturn = [];
            await axios.get(
                "http://cs125-api-env.eba-55euqiex.us-west-1.elasticbeanstalk.com/exercises",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        userId
                    }
                }
            )
            .then(response => {
                toReturn = response.data.entity;
            })
            .catch(error => {
                console.log(error.message);
            })
        
            return toReturn;
        } 

        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => {
                return (
                    <TouchableOpacity style={{marginHorizontal: 15}} onPress={() => {navigation.openDrawer();}}>
                        <Icon name='menu' type='feather' color='white' size={35} />
                    </TouchableOpacity>
                );
            }
        });

        // getPlan returns promise, so resolving it here
        getPlan(userContext.state).then(item => setPlan(item));
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={{flex: 1, margin: 15, display: 'flex'}}>
                <Text style={styles.textDate}>{dayOfWeek[today.getDay()]}, {today.getMonth() + 1}/{today.getDate()}/{today.getFullYear()}</Text>
                <View style={{...styles.box, ...styles.box1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.textTitle}>{'Today\'s Routine'}</Text>
                        <TouchableOpacity style={styles.buttonComplete}>
                            <Text style={styles.buttonText}>Mark Complete</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.boxInside}>
                        <FlatList
                            style={styles.flatListToday}
                            contentContainerStyle={styles.flatListTodayContainer}
                            data={plan}
                            renderItem={({item}) => {
                                if (String(item.date).substring(0, 10) == today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate() + 1).padStart(2, '0')) {
                                    return (
                                        <TouchableOpacity style={styles.buttonTodayExercise}>
                                            <Text style={{textAlign: 'center'}}>{item.name}</Text>
                                        </TouchableOpacity>
                                    );
                                }
                            }}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
                <View style={{...styles.box, ...styles.box2}}>
                    <Text style={styles.textTitle}>{'This Week\'s Progress'}</Text>
                    <View style={styles.boxInside}>
                        <FlatList
                            scrollEnabled={false}
                            data={progress}
                            renderItem={({item}) => {
                                return (
                                    <View style={styles.flatListProgressItem}>
                                        <Text style={{textAlign: 'center'}}>{item.day}</Text>
                                        <Icon name='circle' type='feather' color='black' size={20} />
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.day}
                            horizontal={true}
                            contentContainerStyle={styles.flatListProgress}
                        />
                    </View>
                </View>
                <View style={{...styles.box, ...styles.box3}}>
                    <Text style={styles.textTitle}>{'This Week\'s Exercise Plan'}</Text>
                    <View style={styles.boxInside}>
                        <FlatList 
                            style={styles.flatListPlan} 
                            data={plan} 
                            renderItem={({item}) => {
                                return (
                                    <Text>{item.name}</Text>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'rgba(230, 230, 230, 1)',
        borderRadius: 20,
        marginVertical: 15,
        padding: 15
    },
    box1: {
        flex: 1
    },
    box2: {
        flex: 1
    },
    box3: {
        flex: 2
    },
    boxInside: {
        backgroundColor: 'white', 
        borderRadius: 20,
        padding: 15,
        flex: 1,
        marginTop: 5
    },
    buttonComplete: {
        backgroundColor: '#E23E57',
        width: 125,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white'
    },
    buttonTodayExercise: {
        alignItems: 'center',
        backgroundColor: 'rgba(230, 230, 230, 1)',
        borderRadius: 10,
        padding: 10,
        margin: 5
    },
    flatListPlan: {
        // backgroundColor: 'black',
        // color: 'white'
    },
    flatListProgress: {
        // backgroundColor: 'yellow',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    flatListProgressItem: { 
        
    },
    flatListToday: {
        width: '100%'
    },
    flatListTodayContainer: {
        justifyContent: 'space-between'
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#311D3F',
    },
    textDate: {
        color: 'white', 
        fontSize: 30, 
        marginTop: 10
    },
    textTitle: {
        color: 'black', 
        fontSize: 20,
    }
})