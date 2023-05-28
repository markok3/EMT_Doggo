import React, {useContext} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {ChatContext} from "../../context/ChatContext";

const Chat = ({ messages }) => {
    const {data} = useContext(ChatContext);
    const renderChatItem = ({ item }) => (
        <View style={styles.chatItem}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.message}</Text>
        </View>
    );

    return (
        <FlatList
            data={messages}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
        />
    );
};

const styles = StyleSheet.create({
    chatItem: {
        marginBottom: 16,
    },
    sender: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
    },
});

const messages = [
    { id: '1', sender: 'John', message: 'Hey, how are you?' },
    { id: '2', sender: 'Alice', message: 'Le' },
    { id: '3', sender: 'Bob', message: 'I have an idea for the project.' },
    // Add more messages as needed
];

export default Chat;
