import React, { useEffect, useState } from 'react';
import Map from "../homescreen/Map";
import { database } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import * as Location from "expo-location";

const Dashboard = ({ navigation }) => {
    const [dogsList, setDogsList] = useState([]);
    const dogsCollectionRef = collection(database, "dogs");
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(loading);
    const handleButtonPress = () => {
        navigation.navigate('AddLostDog', { currentLocation: currentLocation, navigation: navigation });
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                try {
                    const location = await Location.getCurrentPositionAsync();
                    setCurrentLocation({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                    });
                } catch (error) {
                    console.log('Error getting current location:', error);
                }
            } else {
                console.log('Location permission denied');
            }
        };

        requestLocationPermission();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(dogsCollectionRef, (snapshot) => {
            const updatedDogsList = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDogsList(updatedDogsList);
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <Map navigation={navigation} dogsList={dogsList} currentLocation={currentLocation} setLoading={setLoading} />
            <View style={styles.buttonContainer}>
                {!loading && <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                    <Text style={styles.buttonText}>Add Lost Dog</Text>
                </TouchableOpacity>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: 'blue', // Customize the button color
        borderRadius: 8,
    },
    buttonText: {
        color: 'white', // Customize the button text color
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Dashboard;
