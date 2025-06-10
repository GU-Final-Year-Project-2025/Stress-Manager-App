import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, TouchableOpacity, Text, Modal, PanResponder, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Screen imports - Make sure these paths are correct
import HomeScreen from './screens/HomeScreen';
import BreathingScreen from './screens/BreathingScreen';
import MindfulnessScreen from './screens/MindfulnessScreen';
import MeditateScreen from './screens/MeditateScreen';
import MoreScreen from './screens/MoreScreen';
import ChatScreen from './screens/ChatScreen';
import PSS10Screen from './screens/PSS10Screen';
import OnboardingScreen from './screens/OnboardingScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen'; // Add this import

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const firebaseConfig = {
    apiKey: "AIzaSyC0Kt-whLDIU89smC34NrEL8Q7kfszZt0I",
    authDomain: "stress-manager-app-e7f1e.firebaseapp.com",
    projectId: "stress-manager-app-e7f1e",
    storageBucket: "stress-manager-app-e7f1e.firebasestorage.app",
    messagingSenderId: "542529293588",
    appId: "1:542529293588:web:3fb760a402a1b1b688c601"
};

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const TERMS_ACCEPTED_KEY = 'termsAccepted';
const EXPLICIT_LOGOUT_KEY = 'explicitlyLoggedOut'; // New key for explicit logout

// Get screen dimensions for boundary calculations
const { width, height } = Dimensions.get('window');

// Create the Tab Navigator component
function TabNavigator({ db, userId, openProfessionalChat, setShowReferralModal }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Breathing') {
                        iconName = focused ? 'air-purifier' : 'air-purifier';
                    } else if (route.name === 'Mindfulness') {
                        iconName = focused ? 'eye' : 'eye-outline';
                    } else if (route.name === 'Meditate') {
                        iconName = focused ? 'yoga' : 'yoga';
                    } else if (route.name === 'More') {
                        iconName = focused ? 'menu' : 'menu';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5B86E5', // A calming blue for active tabs
                tabBarInactiveTintColor: '#888', // Softer gray for inactive tabs
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF', // White background for the tab bar
                    borderTopWidth: 0, // Remove default top border
                    elevation: 10, // Shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: { width: 0, height: -5 }, // Shadow upwards
                    shadowOpacity: 0.05, // Subtle shadow
                    shadowRadius: 10,
                    height: 65, // Slightly increased height for better spacing
                    paddingBottom: 5, // Padding at the bottom
                    paddingTop: 5, // Padding at the top
                    borderRadius: 5, // Rounded corners for a modern look
                    position: 'absolute', // Make it float
                    bottom: 5, // Lift it from the very bottom
                    left: 5,
                    right: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12, // Slightly smaller font for labels
                    fontWeight: '600', // Make labels a bit bolder
                    marginTop: 2,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Breathing" component={BreathingScreen} />
            <Tab.Screen name="Mindfulness" component={MindfulnessScreen} />
            <Tab.Screen name="Meditate" component={MeditateScreen} />
            <Tab.Screen name="More">
                {() => (
                    <MoreScreen
                        db={db}
                        userId={userId}
                        appId={firebaseConfig.appId}
                        initialSubStep={0}
                        onClose={() => {}}
                        openProfessionalChat={openProfessionalChat}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

// Main Tabs component to avoid inline components and include movable FAB
function MainTabsScreen({ db, userId, openProfessionalChat, setShowReferralModal }) {
    // Animated value for FAB position
    const pan = useRef(new Animated.ValueXY({ x: width - 90, y: height - 160 })).current; // Initial position (right-bottom)

    // PanResponder for handling touch gestures
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true, // Allow responder to be set
            onPanResponderGrant: () => {
                // When touch starts, stop any active animations and store current value
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
                pan.setValue({ x: 0, y: 0 }); // Reset value to 0 for delta calculation
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false } // Must be false for position animations
            ),
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset(); // Combine offset and value into a single value

                // Optional: Snap to edges or safe areas if desired
                // For simplicity, it will stay where released.
            },
            onPanResponderTerminate: () => {
                pan.flattenOffset(); // Handle cases where responder is terminated (e.g., another gesture takes over)
            },
        })
    ).current;

    return (
        <View style={{ flex: 1 }}>
            <TabNavigator
                db={db}
                userId={userId}
                openProfessionalChat={openProfessionalChat}
                setShowReferralModal={setShowReferralModal}
            />

            {/* Movable Floating Action Button */}
            <Animated.View
                style={[
                    styles.fab,
                    {
                        transform: pan.getTranslateTransform(),
                    },
                ]}
                {...panResponder.panHandlers} // Attach pan handlers
            >
                <TouchableOpacity
                    onPress={() => {
                        setShowReferralModal(true);
                    }}
                    accessibilityLabel="Connect to professional help"
                    activeOpacity={0.7}
                    style={styles.fabTouchable} // Style for the inner TouchableOpacity
                >
                    <View style={styles.fabIconContainer}>
                        <Icon name="account-tie" size={28} color="#fff" />
                        <Text style={styles.fabText}>Help</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

export default function AppLayout() {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); // Renamed from 'user' to avoid conflict with local 'user' in onAuthStateChanged
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatProfessionalId, setChatProfessionalId] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(null);
    const [hasExplicitlyLoggedOut, setHasExplicitlyLoggedOut] = useState(false); // New state for explicit logout

    useEffect(() => {
        const initFirebaseAndAuth = async () => {
            try {
                console.log('Initializing Firebase...');
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firebaseAuth = getAuth(app);

                setDb(firestoreDb);
                setAuth(firebaseAuth);

                // Check terms acceptance and explicit logout status
                const accepted = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
                setTermsAccepted(accepted === 'true');
                const loggedOutFlag = await AsyncStorage.getItem(EXPLICIT_LOGOUT_KEY);
                setHasExplicitlyLoggedOut(loggedOutFlag === 'true');
                console.log('Terms accepted (from storage):', accepted === 'true');
                console.log('Explicitly logged out flag (from storage):', loggedOutFlag === 'true');


                // Set up auth state listener
                const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                    console.log('=== AUTH STATE CHANGED ===');
                    console.log('User:', user ? { uid: user.uid, isAnonymous: user.isAnonymous, email: user.email } : 'No user');

                    if (user) {
                        setCurrentUser(user);
                        setUserId(user.uid);
                        // If a user logs in (or signs in), clear the explicit logout flag
                        if (loggedOutFlag === 'true') { // Only clear if it was set
                            await AsyncStorage.removeItem(EXPLICIT_LOGOUT_KEY);
                            setHasExplicitlyLoggedOut(false);
                            console.log('Explicit logout flag cleared.');
                        }
                    } else {
                        // User is null (either initially or after logout)
                        setCurrentUser(null);
                        setUserId(null);
                        console.log("No user authenticated.");

                        // Only attempt anonymous sign-in if NOT explicitly logged out
                        if (!hasExplicitlyLoggedOut) {
                            console.log("Attempting anonymous sign-in (not explicitly logged out)...");
                            try {
                                if (initialAuthToken) {
                                    await signInWithCustomToken(firebaseAuth, initialAuthToken);
                                } else {
                                    await signInAnonymously(firebaseAuth);
                                }
                            } catch (error) {
                                console.error("Firebase Auth Error (anonymous sign-in):", error);
                                // Fallback to a random UUID if anonymous sign-in fails
                                setUserId(crypto.randomUUID());
                            }
                        } else {
                            console.log("Explicit logout detected. Not attempting anonymous sign-in.");
                        }
                    }
                    setIsAuthReady(true); // Firebase auth state is now determined
                    console.log('=========================');
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Firebase initialization error:", error);
                setIsAuthReady(true); // Still set ready even on error to avoid infinite loading
            }
        };

        initFirebaseAndAuth();
    }, [initialAuthToken, hasExplicitlyLoggedOut]); // Add hasExplicitlyLoggedOut to dependencies

    const openProfessionalChat = (professionalId) => {
        setChatProfessionalId(professionalId);
        setShowChatModal(true);
    };

    // Show loading screen while initializing
    if (!isAuthReady || termsAccepted === null) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading app...</Text>
            </View>
        );
    }

    // Determine the initial route based on terms acceptance and authentication status
    let initialRouteName;
    if (!termsAccepted) {
        initialRouteName = 'OnboardingScreen';
    } else if (hasExplicitlyLoggedOut || !currentUser) { // If explicitly logged out OR no current user (and terms accepted)
        initialRouteName = 'AuthScreen';
    } else { // Terms accepted and user is authenticated (or anonymously signed in)
        initialRouteName = 'MainTabs';
    }

    console.log('=== RENDER DECISION ===');
    console.log('termsAccepted:', termsAccepted);
    console.log('currentUser:', currentUser ? { uid: currentUser.uid, isAnonymous: currentUser.isAnonymous } : null);
    console.log('hasExplicitlyLoggedOut:', hasExplicitlyLoggedOut);
    console.log('Initial Route:', initialRouteName);
    console.log('=====================');

    return (
        <PaperProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
                {/* Always define all possible screens, navigation will handle which one to show first */}
                <Stack.Screen
                    name="OnboardingScreen"
                    component={OnboardingScreen}
                    options={{ title: 'Welcome' }}
                />
                <Stack.Screen
                    name="TermsAndConditionsScreen"
                    component={TermsAndConditionsScreen}
                    options={{ title: 'Terms & Conditions' }}
                />
                <Stack.Screen
                    name="AuthScreen"
                    component={AuthScreen}
                    options={{ title: 'Sign In' }}
                />
                <Stack.Screen name="MainTabs">
                    {(props) => (
                        <MainTabsScreen
                            {...props}
                            db={db}
                            userId={userId}
                            openProfessionalChat={openProfessionalChat}
                            setShowReferralModal={setShowReferralModal}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="PSS10Screen"
                    component={PSS10Screen}
                    options={{ title: 'Perceived Stress Scale' }}
                />
                <Stack.Screen
                    name="ChatScreen"
                    component={ChatScreen}
                    options={{ title: 'Chat' }}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                />
            </Stack.Navigator>

            {/* Modals */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={showReferralModal}
                onRequestClose={() => setShowReferralModal(false)}
            >
                <MoreScreen
                    db={db}
                    userId={userId}
                    appId={firebaseConfig.appId}
                    initialSubStep={1}
                    onClose={() => setShowReferralModal(false)}
                    openProfessionalChat={openProfessionalChat}
                />
            </Modal>

            <Modal
                animationType="slide"
                transparent={false}
                visible={showChatModal}
                onRequestClose={() => setShowChatModal(false)}
            >
                <ChatScreen
                    db={db}
                    userId={userId}
                    appId={firebaseConfig.appId}
                    professionalId={chatProfessionalId}
                    onClose={() => setShowChatModal(false)}
                />
            </Modal>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    loadingText: {
        fontSize: 20,
        fontFamily: 'Poppins_500Medium',
        color: '#333',
    },
    fab: {
        position: 'absolute',
        // 'bottom' and 'right' are now handled by Animated.ValueXY
        backgroundColor: 'rgba(108, 92, 231, 0.7)', // Fainter purple with 70% opacity
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 3 }, // Softer shadow offset
        shadowOpacity: 0.2, // Fainter shadow opacity
        shadowRadius: 5, // More diffused shadow
        elevation: 6, // Adjusted elevation for Android
        zIndex: 1000,
        borderWidth: 2, // Slightly thinner border
        borderColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white border
    },
    fabTouchable: { // New style for the inner TouchableOpacity
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
        textAlign: 'center',
    },
});
