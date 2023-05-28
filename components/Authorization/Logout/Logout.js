import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, TextInput, View, Text, Modal, Button, SafeAreaView } from 'react-native';
import { auth } from "../../../config/firebase";

const Logout = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        setModalVisible(true);
    };

    const performLogout = () => {
        // Perform logout logic here

        auth.signOut().then(()=>{
            setModalVisible(false);
            navigation.navigate("Login");

        });
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.logoutOption} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                    <View style={styles.modalButtonsContainer}>
                        <Button title="No" onPress={closeModal} />
                        <Button title="Yes" onPress={performLogout} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoutOption: {
        marginTop: 16,
        marginLeft: 16,
        width: 200,
        paddingVertical: 8,
        backgroundColor: 'lightblue',
        borderRadius: 8,
        alignSelf: "center"
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 100,
        marginBottom: 100,
        marginLeft: 20,
        marginRight: 20,
        padding: 16,
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
});

export default Logout;
