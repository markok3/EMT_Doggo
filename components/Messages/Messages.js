import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from "../../context/AuthContext";
import { onSnapshot, doc } from "firebase/firestore";
import { database } from "../../config/firebase";
import { ChatContext } from "../../context/ChatContext";
import {TouchableOpacity} from "react-native-gesture-handler";

const dummyChats = [
    { id: '1', sender: 'John', message: 'Hey, how are you?' },
    { id: '2', sender: 'Alice', message: 'Letup' },
    { id: '3', sender: 'Bob', message: 'I have an idea for the project.' },
    // Add more dummy chats as needed
];

const ChatItem = ({ sender, message, onPress }) => (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
        <Text style={styles.sender}>{sender}</Text>
        <Text style={styles.message}>{message}</Text>
    </TouchableOpacity>
);


const Messages = ({navigation}) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
        navigation.navigate("ConversationScreen");
    };

    console.log(chats);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(database, "userChats", currentUser?.uid), (doc) => {
                setChats(doc.data());
            });
            return () => {
                unsub();
            };
        };
        currentUser?.uid && getChats();
    }, [currentUser?.uid]);

    if(currentUser == null){
        return(<View></View>)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chats === undefined? [] : Object.entries(chats)}
                renderItem={({ item }) =>
                    <ChatItem
                        sender={item[1].userInfo.displayName}
                        message={item[1].message}
                        onPress={() => handleSelect(item[1].userInfo)}
                    />
            }
                keyExtractor={(item) => item[0]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    chatItem: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    sender: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    message: {
        fontSize: 16,
        color: '#555555',
    },
});

export default Messages;
