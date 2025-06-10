// app/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet, // StyleSheet is now defined directly here
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Switch,
    Platform,
} from 'react-native';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = () => {
    const [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_500Medium,
        Poppins_400Regular,
    });

    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    // State for modals and editing
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [isLoading, setIsLoading] = useState(false); // For profile update
    const [isLoggingOut, setIsLoggingOut] = useState(false); // For logout process

    // Settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [reminderFrequency, setReminderFrequency] = useState('daily'); // 'daily', 'weekly', 'never'

    // Load settings from AsyncStorage on component mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem('notificationsEnabled');
                const storedDarkMode = await AsyncStorage.getItem('darkModeEnabled');
                const storedReminderFrequency = await AsyncStorage.getItem('reminderFrequency');

                if (storedNotifications !== null) setNotificationsEnabled(JSON.parse(storedNotifications));
                if (storedDarkMode !== null) setDarkModeEnabled(JSON.parse(storedDarkMode));
                if (storedReminderFrequency !== null) setReminderFrequency(storedReminderFrequency);
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        };
        loadSettings();
    }, []);

    // Save settings to AsyncStorage whenever they change
    useEffect(() => {
        const saveSettings = async () => {
            try {
                await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
                await AsyncStorage.setItem('darkModeEnabled', JSON.stringify(darkModeEnabled));
                await AsyncStorage.setItem('reminderFrequency', reminderFrequency);
            } catch (error) {
                console.error("Failed to save settings:", error);
            }
        };
        saveSettings();
    }, [notificationsEnabled, darkModeEnabled, reminderFrequency]);


    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user]);

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    // Custom Alert for Logout (instead of native Alert)
    const showCustomLogoutAlert = () => {
        // In a real app, you'd use a custom modal component here
        // For this example, we'll use a simple Alert for demonstration
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: performLogout, style: "destructive" },
            ],
            { cancelable: true }
        );
    };

    const performLogout = async () => {
        setIsLoggingOut(true);
        try {
            console.log("Starting logout process...");
            await signOut(auth);
            console.log("Firebase signOut completed");

            // Clear all AsyncStorage data related to the user session
            await AsyncStorage.clear();
            console.log("AsyncStorage cleared");

            // Navigate to the AuthScreen (login screen)
            // Using reset to clear the navigation stack
            navigation.reset({
                index: 0,
                routes: [{ name: 'AuthScreen' }],
            });
        } catch (error) {
            console.error("Logout error:", error);
            let errorMessage = "Failed to logout. Please try again.";
            if (error.code === 'auth/network-request-failed') {
                errorMessage = "Network error. Please check your connection and try again.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many requests. Please wait a moment and try again.";
            }
            Alert.alert("Logout Error", errorMessage);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleSaveProfile = async () => {
        if (!displayName.trim()) {
            Alert.alert("Error", "Display name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName.trim()
            });
            setShowEditModal(false);
            Alert.alert("Success", "Profile updated successfully!");
        } catch (error) {
            console.error("Profile update error:", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettings = () => {
        setShowSettingsModal(true);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "This action cannot be undone. Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // In a real app, you'd implement Firebase account deletion here
                        // For example: deleteUser(auth.currentUser).then(() => { /* navigate to AuthScreen */ }).catch(...)
                        Alert.alert("Info", "Account deletion feature will be implemented soon.");
                    }
                }
            ]
        );
    };

    const formatUserInfo = () => {
        const info = [];
        if (user?.email) {
            info.push(`Email: ${user.email}`);
        }
        if (user?.uid) {
            info.push(`User ID: ${user.uid.substring(0, 8)}...`); // Shorten for display
        }
        if (user?.metadata?.creationTime) {
            const createdAt = new Date(user.metadata.creationTime).toLocaleDateString();
            info.push(`Member since: ${createdAt}`);
        }
        if (user?.metadata?.lastSignInTime) {
            const lastLogin = new Date(user.metadata.lastSignInTime).toLocaleDateString();
            info.push(`Last login: ${lastLogin}`);
        }
        return info;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        disabled={isLoggingOut}
                    >
                        <Icon name="arrow-left" size={24} color={isLoggingOut ? "#ccc" : "#333"} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.profileInfo}>
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="account-circle" size={80} color="#777" />
                        </View>
                    )}
                    <Text style={styles.displayName}>{user?.displayName || 'Guest User'}</Text>
                    <Text style={styles.email}>{user?.email || 'No email'}</Text>

                    {/* User Info Cards */}
                    <View style={styles.userInfoContainer}>
                        {formatUserInfo().map((info, index) => (
                            <View key={index} style={styles.infoCard}>
                                <Text style={styles.infoText}>{info}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionButton, isLoggingOut && styles.disabledAction]}
                        onPress={handleEditProfile}
                        disabled={isLoggingOut}
                    >
                        <Icon name="account-edit-outline" size={24} color={isLoggingOut ? "#ccc" : "#333"} />
                        <Text style={[styles.actionText, isLoggingOut && styles.disabledText]}>Edit Profile</Text>
                        <Icon name="chevron-right" size={20} color={isLoggingOut ? "#ccc" : "#999"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, isLoggingOut && styles.disabledAction]}
                        onPress={handleSettings}
                        disabled={isLoggingOut}
                    >
                        <Icon name="cog-outline" size={24} color={isLoggingOut ? "#ccc" : "#333"} />
                        <Text style={[styles.actionText, isLoggingOut && styles.disabledText]}>Settings</Text>
                        <Icon name="chevron-right" size={20} color={isLoggingOut ? "#ccc" : "#999"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, isLoggingOut && styles.disabledAction]}
                        onPress={() => Alert.alert("Info", "Help & Support coming soon!")}
                        disabled={isLoggingOut}
                    >
                        <Icon name="help-circle-outline" size={24} color={isLoggingOut ? "#ccc" : "#333"} />
                        <Text style={[styles.actionText, isLoggingOut && styles.disabledText]}>Help & Support</Text>
                        <Icon name="chevron-right" size={20} color={isLoggingOut ? "#ccc" : "#999"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, isLoggingOut && styles.disabledAction]}
                        onPress={() => Alert.alert("Info", "Privacy Policy coming soon!")}
                        disabled={isLoggingOut}
                    >
                        <Icon name="shield-account-outline" size={24} color={isLoggingOut ? "#ccc" : "#333"} />
                        <Text style={[styles.actionText, isLoggingOut && styles.disabledText]}>Privacy Policy</Text>
                        <Icon name="chevron-right" size={20} color={isLoggingOut ? "#ccc" : "#999"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dangerButton, isLoggingOut && styles.disabledAction]}
                        onPress={handleDeleteAccount}
                        disabled={isLoggingOut}
                    >
                        <Icon name="delete-outline" size={24} color={isLoggingOut ? "#ccc" : "#F44336"} />
                        <Text style={[styles.dangerText, isLoggingOut && styles.disabledText]}>Delete Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.logoutButton,
                            isLoggingOut && styles.logoutButtonLoading
                        ]}
                        onPress={showCustomLogoutAlert} // Use custom alert
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Icon name="logout" size={24} color="#fff" />
                        )}
                        <Text style={styles.logoutText}>
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showEditModal && !isLoggingOut}
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Icon name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Display Name</Text>
                            <TextInput
                                style={styles.textInput}
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Enter your display name"
                                editable={!isLoading}
                            />
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[styles.textInput, styles.disabledInput]}
                                value={user?.email || ''}
                                placeholder="No email"
                                editable={false}
                            />
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowEditModal(false)}
                                disabled={isLoading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, isLoading && styles.disabledButton]}
                                onPress={handleSaveProfile}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Settings Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSettingsModal && !isLoggingOut}
                onRequestClose={() => setShowSettingsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Settings</Text>
                            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                                <Icon name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <Icon name="bell-outline" size={20} color="#333" />
                                    <Text style={styles.settingText}>Notifications</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={notificationsEnabled ? "#4A90E2" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
                                    value={notificationsEnabled}
                                />
                            </View>

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <Icon name="theme-light-dark" size={20} color="#333" />
                                    <Text style={styles.settingText}>Dark Mode</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={darkModeEnabled ? "#4A90E2" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => setDarkModeEnabled(previousState => !previousState)}
                                    value={darkModeEnabled}
                                />
                            </View>

                            <View style={styles.settingItem}>
                                <View style={styles.settingInfo}>
                                    <Icon name="clock-outline" size={20} color="#333" />
                                    <Text style={styles.settingText}>Reminder Frequency</Text>
                                </View>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={reminderFrequency}
                                        onValueChange={(itemValue) => setReminderFrequency(itemValue)}
                                        style={styles.picker}
                                        itemStyle={Platform.OS === 'ios' ? styles.pickerItem : {}} // iOS specific styling
                                    >
                                        <Picker.Item label="Daily" value="daily" />
                                        <Picker.Item label="Weekly" value="weekly" />
                                        <Picker.Item label="Never" value="never" />
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => setShowSettingsModal(false)}
                            >
                                <Text style={styles.saveButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Logout Loading Overlay */}
            {isLoggingOut && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isLoggingOut}
                >
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4A90E2" />
                            <Text style={styles.loadingText}>Logging out...</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#333',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40, // To balance the back button space
    },
    profileInfo: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderRadius: 10,
        marginHorizontal: 15,
        marginTop: 15,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    displayName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },
    email: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    userInfoContainer: {
        width: '100%',
        marginTop: 10,
    },
    infoCard: {
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4A90E2',
    },
    infoText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#555',
    },
    actions: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    actionText: {
        flex: 1,
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dangerText: {
        flex: 1,
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#F44336',
        marginLeft: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 15,
        borderRadius: 8,
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    logoutButtonLoading: {
        backgroundColor: '#FF6B6B', // Lighter red when loading
    },
    logoutText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: 'white',
        marginLeft: 8,
    },
    disabledAction: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#ccc',
    },
    // Modal Styles (General)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: '90%',
        maxHeight: '80%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    inputLabel: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        marginTop: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontFamily: 'Poppins_400Regular', // Changed to regular for input
        fontSize: 16,
        backgroundColor: 'white',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#999',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    cancelButtonText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginLeft: 10,
        backgroundColor: '#4A90E2',
        borderRadius: 8,
    },
    saveButtonText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: 'white',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    // Settings Modal Styles
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    // Styles for Picker
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        // Adjust width as needed, or use flex for responsiveness
        width: Platform.OS === 'ios' ? 'auto' : 150, // iOS picker takes full width by default
        overflow: 'hidden',
    },
    picker: {
        height: 40, // Adjust height for better fit
        width: '100%', // Take full width of its wrapper
        color: '#333',
    },
    pickerItem: {
        fontFamily: 'Poppins_400Regular', // Apply font to iOS picker items
        fontSize: 16,
    },
    // Loading Overlay Styles
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
    },
    loadingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#333',
        marginTop: 15,
    },
});

export default ProfileScreen;