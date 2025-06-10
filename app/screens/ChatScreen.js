// screens/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const ChatScreen = ({ db, userId, appId, professionalId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [professionalName, setProfessionalName] = useState('Professional');
    const flatListRef = useRef(null);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
    });

    // Determine the chat document ID
    const chatDocId = professionalId
        ? [userId, professionalId].sort().join('_')
        : `general_support_${userId}`;

    // --- IMPORTANT CHANGE HERE ---
    // Simplified Firestore collection path for chats
    // This will create a 'chats' collection at the root,
    // and then documents within it for each chat thread (e.g., chats/user1_pro1/messages)
    const chatCollectionPath = `chats/${chatDocId}/messages`; // Changed from `artifacts/${appId}/chats/${chatDocId}/messages`


    useEffect(() => {
        if (!db || !userId) return;

        const fetchProfessionalName = async () => {
            if (professionalId) {
                try {
                    // --- IMPORTANT CHANGE HERE ---
                    // Updated path to fetch professional name from the new top-level 'professionals' collection
                    const proDocRef = doc(db, `professionals`, professionalId); // Changed path
                    const proDocSnap = await getDoc(proDocRef);
                    if (proDocSnap.exists()) {
                        setProfessionalName(proDocSnap.data().name);
                    } else {
                        setProfessionalName('Unknown Professional');
                    }
                } catch (error) {
                    console.error("Error fetching professional name:", error);
                    setProfessionalName('Error Professional');
                }
            } else {
                setProfessionalName('General Support');
            }
        };
        fetchProfessionalName();


        const q = query(
            collection(db, chatCollectionPath),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMessages);
            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToEnd({ animated: true });
                }
            }, 100);
        }, (error) => {
            console.error("Error fetching messages:", error);
        });

        return () => unsubscribe();
    }, [db, userId, appId, professionalId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '' || !db || !userId) return;

        try {
            await addDoc(collection(db, chatCollectionPath), {
                userId: userId,
                message: newMessage.trim(),
                timestamp: serverTimestamp(),
                senderRole: 'user',
                professionalId: professionalId || null,
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{professionalName} Chat</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.messageBubble,
                            item.userId === userId ? styles.myMessage : styles.otherMessage
                        ]}>
                            <Text style={styles.messageText}>{item.message}</Text>
                            <Text style={styles.timestampText}>
                                {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.messagesContainer}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        multiline
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <MaterialCommunityIcons name="send" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    headerTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    messagesContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderBottomRightRadius: 5,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E0E0E0',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#333',
    },
    timestampText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 10,
        color: '#777',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#5B86E5',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
});

export default ChatScreen;