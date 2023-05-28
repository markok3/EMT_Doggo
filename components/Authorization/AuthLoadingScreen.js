import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthLoadingScreen = ({ navigation }) => {
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe after the initial check

            if (user) {
                // User is logged in, navigate to the main app screen
                navigation.navigate('Dashboard');
            } else {
                // User is not logged in, navigate to the login screen
                navigation.navigate('Login');
            }
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007bff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AuthLoadingScreen;
