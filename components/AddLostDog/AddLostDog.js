import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    Alert,
    Keyboard,
} from 'react-native';
import {
    getDocs,
    collection,
    addDoc,
    onSnapshot,
    doc,
} from 'firebase/firestore';
import { database, storage } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AddLostDog = ({ route }) => {
    const { navigation, currentLocation } = route.params;
    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [user, setUser] = useState({});
    const [dogProfilePicture, setDogProfilePicture] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        const getUser = () => {
            const unsub = onSnapshot(doc(database, 'users', currentUser.uid), (doc) => {
                setUser(doc.data());
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && getUser();
    }, [currentUser.uid]);

    const pickImage = async () => {
        Keyboard.dismiss();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const storageRef = ref(storage, `${currentUser.uid}`);
            const imageBlob = await fetch(result.uri).then((response) =>
                response.blob()
            );

            setUploading(true);

            const uploadTask = uploadBytesResumable(storageRef, imageBlob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error(error);
                    Alert.alert('Error uploading image');
                },
                async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    setImage(result.uri);
                    setUploading(false);
                    // Use the downloadURL to store the image in the database or do any other necessary operations
                }
            );
        }
    };

    const [selectedCoordinates, setSelectedCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });
    const dogsCollectionRef = collection(database, 'dogs');

    const setSelectedCoordinatesCallback = (coordinates) => {
        setSelectedCoordinates(coordinates);
    };

    const requestPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status !== 'granted') {
            console.log('Permission not granted');
            return;
        }
    };

    function addDogProfilePicture() {
        requestPermission();
        // ImageCropPicker.openPicker({
        //     width: 300,
        //     height: 400,
        //     cropperCircleOverlay: true,
        // }).then(image => {
        //     // setDogProfilePicture(image);
        // });
    }

    const handleAddDog = async () => {
        // Handle adding the lost dog here
        if (name === '' || description === '' || image == null) {
            Alert.alert('Please fill all the info');
            return;
        }
        const imageUrl = ''; // Modify this line to store the image URL from Firebase Storage
        await addDoc(dogsCollectionRef, {
            name: name,
            description: description,
            photo: imageUrl,
            latitude: selectedCoordinates.latitude,
            longitude: selectedCoordinates.longitude,
            uid: currentUser.uid,
            displayName: user.displayName,
            email: user.email,
        });

        navigation.goBack();
    };

    const addLocation = () => {
        navigation.navigate('AddLostDogMap', {
            currentLocation: currentLocation,
            setSelectedCoordinatesCallback: setSelectedCoordinatesCallback,
            navigation: navigation,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>


            {uploading && (
                <View style={styles.progressContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${uploadProgress}%` },
                        ]}
                    />
                    <Text style={styles.progressText}>
                        Uploading: {Math.round(uploadProgress)}%
                    </Text>
                </View>
            )}
            <TouchableOpacity onPress={addLocation} style={styles.button}>
                <Text style={styles.buttonText}>{(selectedCoordinates.longitude === 0 && selectedCoordinates.latitude=== 0)? "Add Location": "Location Added"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAddDog} style={styles.button}>
                <Text style={styles.buttonText}>Add Dog</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    selectedCoordinatesText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    progressContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginBottom: 16,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    progressText: {
        marginTop: 8,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default AddLostDog;
