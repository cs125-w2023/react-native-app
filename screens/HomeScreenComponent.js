import { React, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Context as UserContext } from '../contexts/UserContext';
import { Icon } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const genConfig = {
    headers: {
        'Content-Type': 'application/json',

    }
}

const getPlanSliced = (plan) => {
    const d = new Date();
    var toReturn = [];
    plan.forEach((element, index) => {
        const date = Object.keys(element)[0];
        // console.log(date.substring(0, 4));
        // console.log(d.getFullYear());
        // console.log(date.substring(5, 7));
        // console.log(String(d.getMonth() + 1).padStart(2, '0'));
        // console.log(date.substring(8, 10));
        // console.log(d.getDate());
        if (date.substring(0, 4) == d.getFullYear() && date.substring(5, 7) == String(d.getMonth() + 1).padStart(2, '0') && date.substring(8, 10) == d.getDate()) {
            toReturn = plan.slice(index, index+1);
        }
    })

    return toReturn;
}

export default HomeScreenComponent = ({ navigation }) => {
    const today = new Date();
    // 0 == blank, 1 == incomplete, 2 == complete
    const progressDefault = JSON.parse(`
        [{\"day\": \"Su\", \"status\": 0}, 
        {\"day\": \"M\", \"status\": 0}, 
        {\"day\": \"Tu\", \"status\": 0}, 
        {\"day\": \"W\", \"status\": 0}, 
        {\"day\": \"Th\", \"status\": 0}, 
        {\"day\": \"F\", \"status\": 0}, 
        {\"day\": \"Sa\", \"status\": 0}]
    `);
    const userContext = useContext(UserContext);
    const [plan, setPlan] = useState([]);
    const [planSliced, setPlanSliced] = useState([]);
    // const [complete, setComplete] = useState(false);
    const [progress, setProgress] = useState(progressDefault);
    const [complete, setComplete] = useState(false);


    // useEffect can't be async (b/c it can't return anything i.e. promise),
    // therefore, async function is declared inside
    useEffect(() => {
        // async function ALWAYS return promise
        const getPlan = async ( userId ) => {
            var toReturn = [];
            // generate plan
            console.log(`generating plan id ${userId}`);
            await axios.post(
                "http://cs125-api-env.eba-55euqiex.us-west-1.elasticbeanstalk.com/exercises/generate-week",    
                {
                    'userId':userId
                },
                {
                headers: {
                    'Content-Type': 'application/json',
                    userId
                }
                }
            )
            .then(async () => {
                console.log('plan generated');
                //TODO: clear/ refresh progress
                const jsonValue = JSON.stringify(progressDefault);
                await AsyncStorage.setItem(`@${userId}-progress`, jsonValue)
                .catch(error => console.log(error.message));
                // console.log(`@${userId}-progress`);
                // console.log(jsonValue);
            })
            .catch(error => {
                console.log(error.message);
            })
            // retreive plan
            console.log(`getting plan id ${userId}`);
            await axios.get(
                "http://cs125-api-env.eba-55euqiex.us-west-1.elasticbeanstalk.com/exercises",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': userId
                    }
                }
            )
            .then(response => {
                toReturn = response.data.entity;
                console.log('plan retreived');
            })
            .catch(error => {
                console.log(error.message);
            })
        
            return toReturn;
        } 

        const getProgress = async ( userId ) => {
            try {
                const value = await AsyncStorage.getItem(`@${userId}-progress`);
                // console.log(`@${userId}-progress`);
                // console.log(value);
                if (value !== null) {
                    console.log('Local storage progress NOT null!')
                    setProgress(JSON.parse(value));
                    if (JSON.parse(value)[today.getDay()].status == "2") {
                        console.log('Setting complete to true.');
                        setComplete(true);
                    }
                } else {
                    console.log('Local storage progress null!');
                }
            } catch (e) {
                console.log(e.message);
            }
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
        getPlan(userContext.state).then(item => {
            var ls = [];
            item.forEach(obj => {
                if (ls.length == 0 || obj.date != Object.keys(ls[ls.length - 1])[0]) {
                    var a = {};
                    a[obj.date] = [obj];
                    ls.push(a);
                } else {
                    ls[ls.length - 1][obj.date].push(obj);
                }
            });

            setPlan(ls);
            setPlanSliced(getPlanSliced(ls));
        });

        getProgress(userContext.state)
        .then(() => console.log('Got progress!'))
        .catch(() => console.log('Failed to get progress!'));

    }, []);

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={{flex: 1, margin: 15, display: 'flex'}}>
                <Text style={styles.textDate}>{dayOfWeek[today.getDay()]}, {today.getMonth() + 1}/{today.getDate()}/{today.getFullYear()}</Text>
                <View style={{...styles.box, ...styles.box1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.textTitle}>{'Today\'s Routine'}</Text>
                        <TouchableOpacity style={styles.buttonComplete} onPress={async() => {
                            //save progress
                            console.log("trying to save");
                            try {
                                var toBeSaved = null;
                                if (complete) {
                                    toBeSaved = [...progress.slice(0, today.getDay()), {"day": `${progress[today.getDay()].day}`, "status": 0}, ...progress.slice(today.getDay() + 1)];
                                    setComplete(false);
                                    // console.log("set to 0");
                                } else {
                                    toBeSaved = [...progress.slice(0, today.getDay()), {"day": `${progress[today.getDay()].day}`, "status": 2}, ...progress.slice(today.getDay() + 1)];
                                    setComplete(true);
                                    // console.log("set to 2");
                                }
                                setProgress(toBeSaved);
                                const jsonValue = JSON.stringify(toBeSaved);
                                await AsyncStorage.setItem(`@${userContext.state}-progress`, jsonValue)
                                .then(() => console.log('Successfully saved!'));
                                // console.log(`@${userContext.state}-progress`);
                                // console.log(jsonValue);
                            } catch (e) {
                                console.log(e.message);
                            }
                        }}>
                            {complete ? 
                                <Text style={styles.buttonText}>Undo Complete</Text> :
                                <Text style={styles.buttonText}>Mark Complete</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.boxInside}>
                        <FlatList
                            style={styles.flatListToday}
                            contentContainerStyle={styles.flatListTodayContainer}
                            data={planSliced}
                            renderItem={({item}) => {
                                console.log("item:")
                                console.log(item);
                                const elements = [];
                                Object.values(item)[0].forEach(obj => {
                                    elements.push(
                                        <TouchableOpacity key={String(elements.length)} style={styles.buttonTodayExercise} onPress={() => {
                                            Alert.alert(
                                                obj.name, 
                                                `\ntype: ${obj.type}\nmuscle: ${obj.muscle}\nequipment: ${obj.equipment}\ndifficulty: ${obj.difficulty}`,
                                                [{
                                                    text: 'Close',
                                                    onPress: () => {},
                                                    style: 'cancel'
                                                }]
                                            );
                                        }}>
                                            <Text style={{textAlign: 'center'}}>{obj.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                                return elements;
                            }}
                            keyExtractor={item => Object.keys(item)[0]}
                        />
                    </View>
                </View>
                <View style={{...styles.box, ...styles.box2}}>
                    <Text style={styles.textTitle}>{'This Week\'s Progress'}</Text>
                    <View style={styles.boxInside}>
                        <FlatList
                            scrollEnabled={false}
                            data={progress}
                            renderItem={({item, index}) => {
                                const elements = [];
                                // console.log(item);
                                elements.push(<Text key={item.day} style={{textAlign: 'center'}}>{item.day}</Text>);
                                if (item.status == 0) {
                                    elements.push(<Icon key={`${item.day}-icon`} name='circle' type='feather' color='black' size={20} />);
                                } else if (item.status == 1) {
                                    elements.push(<Icon key={`${item.day}-icon`} name='x-circle' type='feather' color='red' size={20} />);
                                } else if (item.status == 2) {
                                    elements.push(<Icon key={`${item.day}-icon`} name='check-circle' type='feather' color='green' size={20} />);
                                }

                                if (index == today.getDay()) {
                                    return (
                                        <View style={styles.flatListProgressItemToday}>
                                            {elements}
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View style={styles.flatListProgressItem}>
                                            {elements}
                                        </View>
                                    )
                                }
                                
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
                            keyExtractor={item => Object.keys(item)[0]}
                            renderItem={({item}) => {
                                const dateString = Object.keys(item)[0];
                                const date = new Date(`${dateString.substring(5, 7)}/${dateString.substring(8, 10)}/${dateString.substring(0, 4)}`);
                                const elements = [];
                                Object.values(item)[0].forEach(obj => {
                                    elements.push(
                                        <Text key={obj.id}>{obj.name}</Text>
                                    )
                                });

                                return (
                                    <View style={styles.weekPlanBoxOuter}>
                                        <Text>{`${dayOfWeek[date.getDay()]}, ${dateString.substring(5, 7)}/${dateString.substring(8, 10)}/${dateString.substring(0, 4)}`}</Text>
                                        <View style={styles.weekPlanBoxInner}>
                                            {elements}
                                        </View>
                                    </View>
                                )
                            }}
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
        padding: 5,
    },
    flatListProgressItemToday: { 
        borderWidth: 2,
        padding: 5,
        borderRadius: 10,
        borderColor: 'rgba(230, 230, 230, 1)'
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
    },
    weekPlanBoxInner: {
        // borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        margin: 5,
        padding: 5
    },
    weekPlanBoxOuter: {
        marginBottom: 10,
        // borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'rgba(245, 245, 245, 1)',
    }
})