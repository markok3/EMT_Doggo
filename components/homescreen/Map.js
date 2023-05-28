import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppLoader from "../Loader/AppLoader";



const Map = ({ dogsList, navigation,currentLocation, setLoading }) => {



    const handleMarkerPress = (dog) => {
        navigation.navigate('Details', { dog: dog });
    };

    if (!currentLocation) {
        // Render loading state or fallback UI


        return <View style={styles.container}>
            <AppLoader/>
        </View>
    }
    const handleMapReady = () => {
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                onMapReady={handleMapReady}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.lat,
                    longitude: currentLocation.lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                {dogsList.map((dog) => (
                    <Marker
                        key={dog.id}
                        coordinate={{
                            latitude: dog.latitude,
                            longitude: dog.longitude,
                        }}
                        title={dog.name}
                        description={dog.description}
                        image={require('../../assets/dog_default_pic.png')} // Replace with your custom marker image
                        onPress={() => handleMarkerPress(dog)} // Pass the dog object to handleMarkerPress
                    >
                    </Marker>
                ))}
            </MapView>
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
});

export default Map;
