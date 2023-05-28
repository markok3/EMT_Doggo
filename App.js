import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView from 'react-native-maps';

import Dashboard from './components/Dashboard/Dashboard';
import DetailsScreen from './components/DetailsScreen/DetailsScreen';
import AddLostDog from './components/AddLostDog/AddLostDog';
import AddLostDogMap from './components/AddLostDogMap/AddLostDogMap';
import Login from './components/Authorization/Login/Login';
import Register from './components/Authorization/Register/Register';
import Logout from './components/Authorization/Logout/Logout';
import DrawerNavigator from "@react-navigation/drawer/src/navigators/createDrawerNavigator";
import {useContext} from "react";
import {AuthContext, AuthContextProvider} from "./context/AuthContext";
import Messages from "./components/Messages/Messages";
import {ChatContext, ChatContextProvider} from "./context/ChatContext";
import ConversationScreen from "./components/Messages/ConversationScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = ({navigation}) => {
    return (
            <Drawer.Navigator>
                <Drawer.Screen name="Dashboard" component={Dashboard} />
                <Drawer.Screen name="Messages" component={Messages} />
                <Drawer.Screen name="Logout" component={Logout}
                />
            </Drawer.Navigator>
    );
};

const AppHome = () =>{
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser);
    return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Register" component={Register}/>
                    <Stack.Screen name="Details" component={DetailsScreen}/>
                    <Stack.Screen name="AddLostDog" component={AddLostDog}/>
                    <Stack.Screen name="AddLostDogMap" component={AddLostDogMap}/>
                    <Stack.Screen name="Messages" component={Messages}/>
                    <Stack.Screen name="ConversationScreen" component={ConversationScreen}/>
                    <Stack.Screen name="HomeStack" component={HomeStack} options={{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>

    );
}

const App = () => {

    return (
        <AuthContextProvider>
            <ChatContextProvider>
            <AppHome/>
            </ChatContextProvider>
        </AuthContextProvider>

    );
};

export default App;
