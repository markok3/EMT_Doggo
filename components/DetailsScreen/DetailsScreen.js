import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {AuthContext} from "../../context/AuthContext";
import {doc, getDocs, setDoc, updateDoc, serverTimestamp, getDoc, onSnapshot} from "firebase/firestore";
import {database, storage} from "../../config/firebase";
import {getDownloadURL, ref} from "firebase/storage";
import {ChatContext} from "../../context/ChatContext";

const DetailsScreen = ({route, navigation}) => {
    const {dog} = route.params;
    const {name, description, photo} = dog;
    const {currentUser} = useContext(AuthContext);
    const [imageURL, setImageURL] = useState(null);
    const {dispatch} = useContext(ChatContext);
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState();

    useEffect(() => {
        const getImageURL = async () => {
            try {
                const storageRef = ref(storage, `${dog.uid}`);
                const url = await getDownloadURL(storageRef);
                setImageURL(url);
            } catch (error) {
                console.log("Error fetching image URL:", error);
            }
        };

        getImageURL();
    }, [dog.uid]);

    useEffect(() => {
        const getUser = () => {
            const unsub = onSnapshot(doc(database, "users", currentUser.uid), (doc) => {
                setUser(doc.data());
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && getUser();
    }, [currentUser.uid]);


    useEffect(() => {
        console.log(chats);
        console.log(user);
        console.log(Object.keys(chats).length);
        console.log(dog);
        if ((Object.keys(chats).length > 0) && chats!== undefined && user !== undefined) {
            const found = Object.entries(chats).find(
                (chat) => chat[1].userInfo.displayName === dog.displayName
            );
            console.log(found)
            dispatch({type: 'CHANGE_USER', payload: found[1].userInfo});
            navigation.navigate('ConversationScreen');
        }
    }, [chats]);


    const handleContactPress = async () => {
        //DONT ALLOW THE USER TO MSG HIMSELF
        if (dog.email === currentUser.email) {
            return;
        }
        const combinedId = currentUser.uid > dog.uid ? currentUser.uid + dog.uid :
            dog.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(database, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(database, "chats", combinedId), {messages: []});
                //create chat for currentUser and chat for other user
                await updateDoc(doc(database, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: dog.uid,
                        displayName: dog.displayName,
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })

                await updateDoc(doc(database, "userChats", dog.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: user.displayName,
                    },
                    [combinedId + ".date"]: serverTimestamp()

                })
            }

            const getChats = async () => {
                const unsub = onSnapshot(doc(database, "userChats", currentUser.uid), (doc) => {
                    setChats(doc.data());
                });
                return () => {
                    unsub();
                };
            };
            getChats();
        } catch (err) {
        }

    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Name: {name}</Text>
            <Text style={styles.description}>Description: {description}</Text>
            {imageURL && (
                <Image source={{uri: imageURL}} style={styles.image}/>
            )}
            <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
                <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    contactButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'blue',
        borderRadius: 10,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DetailsScreen;
