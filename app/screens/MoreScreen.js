// D:\my-projects\stress-manager\app\screens\MoreScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Picker,
    SafeAreaView,
    FlatList,
    Linking,
    Image
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import LeisureScreen from './LeisureScreen'; // Ensure this import is correct

// This component now handles the entire "More" section, including the referral flow.
const MoreScreen = ({ db, userId, appId, onClose, openProfessionalChat, initialSubStep = 0 }) => {
    // subStep 0: Main More menu (Resources, Leisure, Professional Support)
    // subStep 1: Professional Support (starts the referral flow intro)
    // subStep 2: Stress Profile Questionnaire
    // subStep 3: Preferred Approach
    // subStep 4: Professional Profiles Display
    // subStep 5: About Stress (Resources)
    // subStep 6: Podcast (Resources) // Changed from 'Podcast' to 'About Stress' (was 5, now 6)
    // subStep 7: Leisure & Humor Main Menu (This is the new subStep for the Leisure top menu)
    // subStep 8: Cartoons (Leisure - direct entry from main menu)
    // subStep 9: Other Funny Stuff (Leisure - direct entry from main menu)
    // subStep 10: General Videos (Leisure - direct entry from main menu)
    // NOTE: Substeps 8, 9, 10 for Leisure are now handled directly by LeisureScreen's internal tabs,
    // so we will just navigate to subStep 7 for the LeisureScreen itself.

    const [subStep, setSubStep] = useState(initialSubStep);

    // States for Referral System (retained from previous ReferralFlowScreen)
    const [ageRange, setAgeRange] = useState('');
    const [feelings, setFeelings] = useState([]);
    const [symptoms, setSymptoms] = useState([]);
    const [otherInfo, setOtherInfo] = useState('');
    const [preferredApproach, setPreferredApproach] = useState('');
    const [professionalProfiles, setProfessionalProfiles] = useState([]);
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    // Dummy data for selection options (retained)
    const ageRanges = ['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
    const commonFeelings = ['Anxious', 'Sad', 'Overwhelmed', 'Irritable', 'Hopeless', 'Stressed', 'Calm'];
    const commonSymptoms = ['Sleep Issues', 'Fatigue', 'Headaches', 'Muscle Tension', 'Loss of Interest', 'Concentration Issues'];
    const approaches = ['Christian', 'Gentle', 'Direct', 'Cognitive Behavioral (CBT)', 'Mindfulness-based'];

    const professionalsCollectionPath = 'professionals'; // Simplified path

    // Effect for fetching professionals (only when subStep is 4, i.e., results display)
    useEffect(() => {
        if (!db || subStep !== 4) return;

        const fetchProfessionals = async () => {
            setIsLoading(true);
            try {
                const q = query(collection(db, professionalsCollectionPath));
                const querySnapshot = await getDocs(q);
                const fetchedPros = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProfessionalProfiles(fetchedPros);
                filterProfessionals(fetchedPros);
            } catch (error) {
                console.error("Error fetching professionals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfessionals();
    }, [db, subStep]);

    // Effect for filtering professionals when criteria change
    useEffect(() => {
        if (subStep === 4) {
            filterProfessionals(professionalProfiles);
        }
    }, [ageRange, feelings, symptoms, preferredApproach, professionalProfiles, subStep]);


    const filterProfessionals = (pros) => {
        let tempPros = [...pros];

        if (preferredApproach) {
            tempPros = tempPros.filter(p => p.approaches && p.approaches.includes(preferredApproach));
        }
        // Add more complex filtering here based on ageRange, feelings, symptoms
        // For example:
        // if (ageRange) {
        //     tempPros = tempPros.filter(p => p.ageRangeFocus && p.ageRangeFocus.includes(ageRange));
        // }
        // if (feelings.length > 0) {
        //     tempPros = tempPros.filter(p => p.specialties && feelings.some(f => p.specialties.includes(f)));
        // }

        setFilteredProfessionals(tempPros);
    };

    const toggleSelection = (list, item, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    // Helper function to handle close button behavior
    const handleCloseButton = () => {
        if (subStep === 0) {
            // If we're on the main menu and onClose exists, close the modal
            if (onClose) {
                onClose();
            }
        } else {
            // If we're on any sub-screen, go back to main menu
            setSubStep(0);
        }
    };

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    // --- Render different sub-steps of the More screen ---

    // subStep 0: Main More Menu
    if (subStep === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>More Options</Text>
                    {onClose && ( // Only show close button if this is a modal
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                        </TouchableOpacity>
                    )}
                </View>
                <ScrollView contentContainerStyle={styles.mainMenuContainer}>
                    <TouchableOpacity style={styles.menuButton} onPress={() => setSubStep(5)}> {/* Resources */}
                        <MaterialCommunityIcons name="book-open-variant" size={30} color="#fff" />
                        <Text style={styles.menuButtonText}>Resources</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => setSubStep(7)}> {/* Leisure & Humor */}
                        <MaterialCommunityIcons name="emoticon-happy-outline" size={30} color="#fff" />
                        <Text style={styles.menuButtonText}>Leisure & Humor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => setSubStep(1)}> {/* Professional Support */}
                        <MaterialCommunityIcons name="account-group-outline" size={30} color="#fff" />
                        <Text style={styles.menuButtonText}>Professional Support</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // subStep 1: Professional Support Introduction (Start of Referral Flow)
    if (subStep === 1) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSubStep(0)} style={styles.backButtonHeader}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Professional Support</Text>
                    <TouchableOpacity onPress={handleCloseButton} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.introContainer}>
                    <MaterialCommunityIcons name="handshake-outline" size={80} color="#5B86E5" style={styles.introIcon} />
                    <Text style={styles.introTitle}>Let's help connect you to a suitable professional</Text>
                    <Text style={styles.introDescription}>
                        We understand that seeking support can be a big step. To help us find the best match for you, we'll ask a few questions about your current situation and preferences. This information helps us tailor recommendations.
                    </Text>
                    <TouchableOpacity style={styles.nextButton} onPress={() => setSubStep(2)}>
                        <Text style={styles.nextButtonText}>Get Started</Text>
                        <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // subStep 2: Stress Profile Questionnaire (Referral Flow)
    if (subStep === 2) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setSubStep(1)} style={styles.backButtonHeader}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Stress Profile</Text>
                <TouchableOpacity onPress={handleCloseButton} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                </TouchableOpacity>
            </View>
            <ScrollView 
                contentContainerStyle={[styles.questionnaireContainer, { paddingBottom: 100 }]} // Add bottom padding
                showsVerticalScrollIndicator={false}
            >
                {/* Your existing content */}
                <Text style={styles.questionTitle}>1. What's your age range?</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={ageRange}
                        onValueChange={(itemValue) => setAgeRange(itemValue)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label="Select Age Range" value="" />
                        {ageRanges.map((range) => (
                            <Picker.Item key={range} label={range} value={range} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.questionTitle}>2. How are you feeling?</Text>
                <View style={styles.tagsContainer}>
                    {commonFeelings.map((feel) => (
                        <TouchableOpacity
                            key={feel}
                            style={[styles.tag, feelings.includes(feel) && styles.selectedTag]}
                            onPress={() => toggleSelection(feelings, feel, setFeelings)}
                        >
                            <Text style={[styles.tagText, feelings.includes(feel) && styles.selectedTagText]}>
                                {feel}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.questionTitle}>3. Any specific signs or symptoms?</Text>
                <View style={styles.tagsContainer}>
                    {commonSymptoms.map((symptom) => (
                        <TouchableOpacity
                            key={symptom}
                            style={[styles.tag, symptoms.includes(symptom) && styles.selectedTag]}
                            onPress={() => toggleSelection(symptoms, symptom, setSymptoms)}
                        >
                            <Text style={[styles.tagText, symptoms.includes(symptom) && styles.selectedTagText]}>
                                {symptom}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.questionTitle}>4. Other information (optional):</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="e.g., specific triggers, duration of stress, etc."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    value={otherInfo}
                    onChangeText={setOtherInfo}
                />

                <TouchableOpacity style={styles.nextButton} onPress={() => setSubStep(3)}>
                    <Text style={styles.nextButtonText}>Next</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

    // subStep 3: Preferred Approach (Referral Flow)
    if (subStep === 3) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSubStep(2)} style={styles.backButtonHeader}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Preferred Approach</Text>
                    <TouchableOpacity onPress={handleCloseButton} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.questionnaireContainer}>
                    <Text style={styles.questionTitle}>Choose your preferred approach:</Text>
                    <View style={styles.tagsContainer}>
                        {approaches.map((approach) => (
                            <TouchableOpacity
                                key={approach}
                                style={[styles.tag, preferredApproach === approach && styles.selectedTag]}
                                onPress={() => setPreferredApproach(approach)}
                            >
                                <Text style={[styles.tagText, preferredApproach === approach && styles.selectedTagText]}>
                                    {approach}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.nextButton} onPress={() => setSubStep(4)}>
                        <Text style={styles.nextButtonText}>Find Professionals</Text>
                        <MaterialCommunityIcons name="magnify" size={20} color="#fff" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // subStep 4: Professional Profiles Display (Referral Flow)
    if (subStep === 4) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSubStep(3)} style={styles.backButtonHeader}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Matching Professionals</Text>
                    <TouchableOpacity onPress={handleCloseButton} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Finding professionals...</Text>
                    </View>
                ) : filteredProfessionals.length > 0 ? (
                    <FlatList
                        data={filteredProfessionals}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.professionalCard}>
                                {item.photoUrl && (
                                    <Image
                                        source={{ uri: item.photoUrl }}
                                        style={styles.professionalImage}
                                        accessibilityLabel={`Photo of ${item.name}`}
                                    />
                                )}
                                <View style={styles.professionalInfo}>
                                    <Text style={styles.professionalName}>{item.name}</Text>
                                    <Text style={styles.professionalDetail}>Location: {item.location}</Text>
                                    <Text style={styles.professionalDetail}>Approach: {item.approaches?.join(', ') || 'N/A'}</Text>
                                    <Text style={styles.professionalDetail}>Specialties: {item.specialties?.join(', ') || 'N/A'}</Text>
                                </View>
                                <View style={styles.professionalActions}>
                                    <TouchableOpacity
                                        style={styles.actionButtonPro}
                                        onPress={() => openProfessionalChat(item.id)}
                                    >
                                        <MaterialCommunityIcons name="chat" size={20} color="#fff" />
                                        <Text style={styles.actionButtonProText}>Chat</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionButtonPro}
                                        onPress={() => handleCall(item.phone)}
                                    >
                                        <MaterialCommunityIcons name="phone" size={20} color="#fff" />
                                        <Text style={styles.actionButtonProText}>Call</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.professionalList}
                    />
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>No professionals found matching your criteria.</Text>
                        <TouchableOpacity style={styles.nextButton} onPress={() => setSubStep(2)}>
                            <Text style={styles.nextButtonText}>Adjust Filters</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        );
    }

    // subStep 5: Resources Main Menu
    if (subStep === 5) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSubStep(0)} style={styles.backButtonHeader}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Resources</Text>
                    <TouchableOpacity onPress={handleCloseButton} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.mainMenuContainer}>
                    <TouchableOpacity style={styles.menuButton} onPress={() => setSubStep(6)}> {/* About Stress */}
                        <MaterialCommunityIcons name="brain" size={30} color="#fff" />
                        <Text style={styles.menuButtonText}>About Stress</Text>
                    </TouchableOpacity>
                    {/* Placeholder for Podcast, removed direct navigation to LeisureScreen */}
                    <TouchableOpacity style={styles.menuButton} onPress={() => {/* Handle Podcast navigation or show placeholder */}}>
                        <MaterialCommunityIcons name="podcast" size={30} color="#fff" />
                        <Text style={styles.menuButtonText}>Podcast</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // subStep 6: About Stress (Psychoeducation)
    if (subStep === 6) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSubStep(5)} style={styles.backButtonHeader}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About Stress</Text>
                    <TouchableOpacity onPress={handleCloseButton} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.contentTitle}>Understanding Stress</Text>
                    <Text style={styles.contentText}>
                        Stress is your body's reaction to a challenge or demand. In short bursts, stress can be positive, like when it helps you avoid danger or meet a deadline. But when stress lasts a long time, it can harm your health.
                    </Text>
                    <Text style={styles.contentSubtitle}>Types of Stress:</Text>
                    <Text style={styles.contentText}>
                        - **Acute Stress:** Short-term, common, and usually resolves quickly (e.g., traffic jam, argument).
                        - **Episodic Acute Stress:** Frequent acute stress, often from a chaotic lifestyle.
                        - **Chronic Stress:** Long-term stress from ongoing demands (e.g., financial issues, difficult relationships). This is the most damaging.
                    </Text>
                    <Text style={styles.contentSubtitle}>Common Causes:</Text>
                    <Text style={styles.contentText}>
                        Work pressure, financial problems, relationship issues, major life changes (marriage, divorce, new job), chronic illness, grief.
                    </Text>
                    <Text style={styles.contentSubtitle}>How to Deal with It:</Text>
                    <Text style={styles.contentText}>
                        - **Identify Triggers:** Understand what causes your stress.
                        - **Practice Relaxation:** Breathing exercises, meditation, yoga.
                        - **Healthy Lifestyle:** Balanced diet, regular exercise, adequate sleep.
                        - **Time Management:** Prioritize tasks, learn to say no.
                        - **Seek Support:** Talk to friends, family, or a professional.
                        - **Leisure & Hobbies:** Engage in activities you enjoy.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // subStep 7: Leisure & Humor Main Menu (Now rendering LeisureScreen directly)
    if (subStep === 7) {
        return <LeisureScreen onBack={() => setSubStep(0)} />; // Pass onBack prop to navigate back to main More menu
    }

    // Placeholder for other Leisure sub-steps (no longer needed, as LeisureScreen handles its own tabs)
    // if (subStep === 8 || subStep === 9 || subStep === 10 || subStep === 11) { /* ... */ }

    return null; // Should not reach here
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
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
        flex: 1, // Allow title to take space
        textAlign: 'center', // Center the title
        marginLeft: -28, // Offset for close button if present
    },
    closeButton: {
        padding: 5,
    },
    backButtonHeader: {
        padding: 5,
        marginRight: 10,
    },
    skipButton: {
        padding: 5,
    },
    skipButtonText: {
        fontFamily: 'Poppins_500Medium',
        color: '#5B86E5',
        fontSize: 16,
    },
    // Main Menu Styles
    mainMenuContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    menuButton: {
        backgroundColor: '#5B86E5',
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginBottom: 20,
        width: '80%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    menuButtonText: {
        color: '#fff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        marginLeft: 15,
    },
    // Content Page Styles (for About Stress, Podcasts, etc.)
    contentContainer: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    contentTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    contentSubtitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#555',
        marginTop: 20,
        marginBottom: 10,
        width: '100%',
    },
    contentText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        lineHeight: 24,
        width: '100%',
    },
    placeholderIcon: {
        marginBottom: 30,
        opacity: 0.6,
    },
    // Referral Flow specific styles (retained from previous ReferralFlowScreen)
    introContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    introIcon: {
        marginBottom: 30,
    },
    introTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 28,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    introDescription: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    nextButton: {
        backgroundColor: '#5B86E5',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
    },
    questionnaireContainer: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 100,
    },
    questionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#333',
        marginBottom: 15,
        marginTop: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333',
    },
    pickerItem: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#E6EEFF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        borderColor: '#D1D9E6',
    },
    selectedTag: {
        backgroundColor: '#5B86E5',
        borderColor: '#5B86E5',
    },
    tagText: {
        fontFamily: 'Poppins_500Medium',
        color: '#5B86E5',
        fontSize: 14,
    },
    selectedTagText: {
        color: '#fff',
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 30,
    },
    professionalList: {
        padding: 15,
    },
    professionalCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    professionalImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#5B86E5',
        resizeMode: 'cover',
    },
    professionalInfo: {
        flex: 1,
        marginRight: 10,
    },
    professionalName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
    },
    professionalDetail: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    professionalActions: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    actionButtonPro: {
        backgroundColor: '#81C784',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        width: 90,
    },
    actionButtonProText: {
        color: '#fff',
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        marginLeft: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        color: '#666',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default MoreScreen;
