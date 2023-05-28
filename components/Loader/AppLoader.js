import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import LottieView from "lottie-react-native"
const AppLoader = () => {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.loading]}>
            <LottieView source={require("../../assets/loading.json")}
                        autoPlay loop/>
        </View>
    );
};

const styles = StyleSheet.create({
    loader:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1,}
})

export default AppLoader;