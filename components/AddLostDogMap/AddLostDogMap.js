import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const AddLostDogMap = ({ route }) => {
    const { currentLocation, setSelectedCoordinatesCallback, navigation } = route.params;
    const { lat, lng } = currentLocation;

    const [currentCoordinate, setCurrentCoordinate] = useState({
        latitude: 0,
        longitude: 0,
    });


    const handleRegionChange = (region) => {
        setCurrentCoordinate(region);
    };

    const handleSetCoordinates = () => {
        setSelectedCoordinatesCallback(currentCoordinate);
        navigation.goBack();
    };

    if (!currentLocation) {
        // Render loading state or fallback UI
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>

            <MapView
                style={styles.map}
                onRegionChange={handleRegionChange}
                initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                {currentCoordinate && (
                    <Marker coordinate={{
                        latitude: currentCoordinate.latitude,
                        longitude: currentCoordinate.longitude,
                    }} />
                )}
            </MapView>
            <Button title="Set Coordinates" onPress={handleSetCoordinates} />
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

export default AddLostDogMap;
