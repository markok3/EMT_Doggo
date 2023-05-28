import React, {useContext, useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {doc, updateDoc, arrayUnion, onSnapshot} from "firebase/firestore";
import {database} from "../../config/firebase";
import uuid from 'react-native-uuid';

const dummyMessages = [
    { id: '1', sender: 'John', receiver: 'Alice', message: 'Hey, how are you?' },
    { id: '2', sender: 'Alice', receiver: 'John', message: 'I\'m good. How about you?' },
    { id: '3', sender: 'John', receiver: 'Alice', message: 'I\'m doing great!' },
    // Add more dummy messages as needed
];

const MessageItem = ({ item, isSentByMe }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);


    const messageStyle = isSentByMe ? styles.sentMessage : styles.receivedMessage;
    const senderContainerStyle = isSentByMe ? styles.senderContainerRight : styles.senderContainerLeft;
    const senderTextStyle = isSentByMe ? styles.senderRight : styles.senderLeft;

    return (
        <View style={styles.messageContainer}>
            <View style={senderContainerStyle}>
                <Text style={senderTextStyle}>{currentUser.displayName}</Text>
            </View>
            <Text style={[styles.message, messageStyle]}>{item.message}</Text>
        </View>
    );
};

const ConversationScreen = () => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');

    const renderItem = ({ item }) => {
        const isSentByMe = item.senderId !== currentUser.uid; // Replace 'John' with the current user's name

        return <MessageItem item={item} isSentByMe={isSentByMe} />;
    };
    useEffect(() => {
        const unSub = onSnapshot(doc(database, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);
    console.log(messages);

    const handleSend = async () => {
        if (message.trim() !== '') {
            // Send the message logic here
            await updateDoc(doc(database, "chats", data.chatId),{
                messages: arrayUnion({
                    id: uuid.v4(),
                    message,
                    senderId: currentUser.uid,

                })
            })
            console.log(`Sending message: ${message}`);
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={100}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    messageContainer: {
        marginBottom: 16,
    },
    senderContainerLeft: {
        alignSelf: 'flex-start',
    },
    senderContainerRight: {
        alignSelf: 'flex-end',
    },
    senderLeft: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    senderRight: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    message: {
        fontSize: 16,
        padding: 8,
        borderRadius: 8,
        maxWidth: '80%',
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5e5',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
    },
    receivedMessage: {
        backgroundColor: '#e5e5e5',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 25,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ConversationScreen;
