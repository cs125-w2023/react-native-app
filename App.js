import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, UIManager, Button, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LaunchScreen from './screens/LaunchScreen';
import HomeScreen from './screens/HomeScreen';
import { Provider as UserContextProvider } from './contexts/UserContext';

const Stack = createNativeStackNavigator();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LaunchScreen">
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{headerShown: true, headerTransparent: true}}>
            
          </Stack.Group>
          
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({

})
