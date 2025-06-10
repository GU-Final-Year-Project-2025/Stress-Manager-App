import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView, Image, Modal, SafeAreaView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy JSON for Box Breathing (replace with your actual JSON if different)
const boxBreathingConfig = {
    inhaleDuration: 4,
    holdAfterInhaleDuration: 4,
    exhaleDuration: 4,
    holdAfterExhaleDuration: 4,
    repetitions: 4
};

const squareSize = 200; // Size of the breathing square
const ringSize = 20; // Size of the moving ring

const BreathingScreen = () => {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    const [selectedExercise, setSelectedExercise] = useState(null); // '4-7-8' or 'box'
    const [showInstructionsModal, setShowInstructionsModal] = useState(false); // Controls the modal visibility
    const [phase, setPhase] = useState('Get Ready'); // 'Get Ready', 'Inhale', 'Hold', 'Exhale', 'Hold (Box)', 'Done'
    const [timer, setTimer] = useState(0);
    const [repetition, setRepetition] = useState(0);
    const [isActive, setIsActive] = useState(false); // Controls if the breathing exercise is actively running

    // Animations for 4-7-8 circle
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Animations for Box Breathing square ring
    const ringX = useRef(new Animated.Value(-ringSize / 2)).current;
    const ringY = useRef(new Animated.Value(-ringSize / 2)).current;

    const intervalRef = useRef(null);

    const phases478 = [
        { name: 'Inhale', duration: 4 },
        { name: 'Hold', duration: 7 },
        { name: 'Exhale', duration: 8 },
    ];

    const phasesBox = [
        { name: 'Inhale', duration: boxBreathingConfig.inhaleDuration },
        { name: 'Hold', duration: boxBreathingConfig.holdAfterInhaleDuration },
        { name: 'Exhale', duration: boxBreathingConfig.exhaleDuration },
        { name: 'Hold (Box)', duration: boxBreathingConfig.holdAfterExhaleDuration },
    ];

    const currentPhases = selectedExercise === '4-7-8' ? phases478 : phasesBox;
    const totalRepetitions = selectedExercise === '4-7-8' ? 4 : boxBreathingConfig.repetitions; // Default 4 reps for 4-7-8

    // Instructions content
    const instructions = {
        '4-7-8': {
            title: '4-7-8 Breathing: The Relaxing Breath',
            description: 'This technique is a natural tranquilizer for the nervous system. It helps to calm a racing mind and promote relaxation.',
            steps: [
                '1. Exhale completely through your mouth, making a "whoosh" sound.',
                '2. Close your mouth and inhale quietly through your nose to a mental count of 4.',
                '3. Hold your breath for a count of 7.',
                '4. Exhale completely through your mouth, making a "whoosh" sound to a count of 8.',
                '5. This is one breath. Now inhale again and repeat the cycle three more times for a total of four breaths.'
            ]
        },
        'box': {
            title: 'Box Breathing: Square Breathing',
            description: 'Also known as Square Breathing, this technique helps to calm the nervous system and reduce stress. It is often used by athletes and first responders for focus.',
            steps: [
                `1. Exhale completely to a count of ${boxBreathingConfig.exhaleDuration}.`,
                `2. Inhale slowly through your nose to a count of ${boxBreathingConfig.inhaleDuration}.`,
                `3. Hold your breath for a count of ${boxBreathingConfig.holdAfterInhaleDuration}.`,
                `4. Exhale slowly through your mouth to a count of ${boxBreathingConfig.exhaleDuration}.`,
                `5. Hold your breath for a count of ${boxBreathingConfig.holdAfterExhaleDuration}.`,
                `6. Repeat this cycle ${boxBreathingConfig.repetitions} times.`
            ]
        }
    };

    // Main interval for timer countdown
    useEffect(() => {
        if (isActive && selectedExercise) {
            intervalRef.current = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (!isActive && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive, selectedExercise]);

    // Logic to advance phases based on timer
    useEffect(() => {
        if (isActive && timer < 0) {
            nextPhase();
        } else if (phase === 'Get Ready' && isActive && timer === 0) {
            nextPhase();
        }
    }, [timer, isActive, phase]);

    const startCircleAnimation = (phaseName, duration) => {
        if (phaseName === 'Inhale') {
            scaleAnim.setValue(1); // Start small
            Animated.timing(scaleAnim, {
                toValue: 1.2, // Expand
                duration: duration * 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        } else if (phaseName === 'Hold') {
            // Keep it expanded, no animation needed, just ensure the value is set
            scaleAnim.setValue(1.2);
        } else if (phaseName === 'Exhale') {
            scaleAnim.setValue(1.2); // Start expanded
            Animated.timing(scaleAnim, {
                toValue: 1, // Shrink
                duration: duration * 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        }
    };

    const startBoxAnimation = (currentPhaseName, duration) => {
        const targetCorner = squareSize - ringSize / 2;

        let animation;

        switch (currentPhaseName) {
            case 'Inhale': // Top-left to Top-right
                animation = Animated.timing(ringX, {
                    toValue: targetCorner,
                    duration: duration * 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                });
                break;
            case 'Hold': // Top-right to Bottom-right
                animation = Animated.timing(ringY, {
                    toValue: targetCorner,
                    duration: duration * 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                });
                break;
            case 'Exhale': // Bottom-right to Bottom-left
                animation = Animated.timing(ringX, {
                    toValue: -ringSize / 2,
                    duration: duration * 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                });
                break;
            case 'Hold (Box)': // Bottom-left to Top-left
                animation = Animated.timing(ringY, {
                    toValue: -ringSize / 2,
                    duration: duration * 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                });
                break;
            default:
                break;
        }

        if (animation) {
            animation.start();
        }
    };

    const nextPhase = () => {
        let currentPhaseIndex;
        if (phase === 'Get Ready') {
            currentPhaseIndex = -1;
        } else {
            currentPhaseIndex = currentPhases.findIndex(p => p.name === phase);
        }

        const nextIndex = currentPhaseIndex + 1;

        if (nextIndex < currentPhases.length) {
            const nextPhaseData = currentPhases[nextIndex];
            setPhase(nextPhaseData.name);
            setTimer(nextPhaseData.duration);
            if (selectedExercise === '4-7-8') {
                startCircleAnimation(nextPhaseData.name, nextPhaseData.duration);
            } else {
                startBoxAnimation(nextPhaseData.name, nextPhaseData.duration);
            }
        } else {
            // End of a repetition
            if (repetition < totalRepetitions - 1) {
                setRepetition(prev => prev + 1);
                setPhase(currentPhases[0].name); // Go back to the first phase of the cycle
                setTimer(currentPhases[0].duration);
                if (selectedExercise === '4-7-8') {
                    startCircleAnimation(currentPhases[0].name, currentPhases[0].duration);
                } else {
                    ringX.setValue(-ringSize / 2);
                    ringY.setValue(-ringSize / 2);
                    startBoxAnimation(currentPhases[0].name, currentPhases[0].duration);
                }
            } else {
                // All repetitions done
                setIsActive(false);
                setPhase('Done');
                setTimer(0);
                scaleAnim.setValue(1);
                ringX.setValue(-ringSize / 2);
                ringY.setValue(-ringSize / 2);
            }
        }
    };

    const startExercise = () => {
        if (!selectedExercise) return;
        setIsActive(true);
        setPhase('Get Ready');
        setTimer(3); // Start countdown before first phase
        scaleAnim.setValue(1);
        if (selectedExercise === 'box') {
            ringX.setValue(-ringSize / 2);
            ringY.setValue(-ringSize / 2);
        }
        setShowInstructionsModal(false); // Ensure modal is closed if starting from it
    };

    const stopExercise = () => {
        setIsActive(false);
        clearInterval(intervalRef.current);
        scaleAnim.stopAnimation();
        ringX.stopAnimation();
        ringY.stopAnimation();
    };

    const resetExercise = () => {
        stopExercise();
        setSelectedExercise(null); // Go back to exercise selection
        setShowInstructionsModal(false); // Ensure modal is closed on full reset
        setPhase('Get Ready');
        setTimer(0);
        setRepetition(0);
        scaleAnim.setValue(1);
        ringX.setValue(-ringSize / 2);
        ringY.setValue(-ringSize / 2);
    };

    const handleExerciseSelect = (exerciseType) => {
        setSelectedExercise(exerciseType);
    };

    const backToSelection = () => {
        resetExercise(); // Use reset to clear all state and go back to selection
    };

    const openInstructions = () => {
        setShowInstructionsModal(true);
    };

    const closeInstructions = () => {
        setShowInstructionsModal(false);
    };

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const currentInstructions = instructions[selectedExercise];

    // --- Render Logic based on state ---

    // State 1: Initial selection screen with introduction
    if (!selectedExercise) {
        return (
            <ScrollView contentContainerStyle={styles.selectionContainer}>
                <Image
                    source={require('../../assets/images/breathe.jpg')} // Corrected path: screens is in app, assets is sibling to app
                    style={styles.introImage}
                    accessibilityLabel="Image representing calm breathing"
                />
                <Text style={styles.introTitle}>Breathe Your Way to Calm</Text>
                <Text style={styles.introText}>
                    Breathing exercises are powerful tools for managing stress, anxiety, and improving focus. By consciously controlling your breath, you can directly influence your nervous system and promote a state of relaxation. Choose an exercise below to begin your journey to a calmer mind.
                </Text>

                <Text style={styles.title}>Choose an Exercise</Text>
                <TouchableOpacity
                    style={styles.exerciseButton}
                    onPress={() => handleExerciseSelect('4-7-8')}
                >
                    <MaterialCommunityIcons name="numeric-4-box-multiple-outline" size={30} color="#fff" />
                    <Text style={styles.exerciseButtonText}>4-7-8 Breathing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.exerciseButton}
                    onPress={() => handleExerciseSelect('box')}
                >
                    <MaterialCommunityIcons name="square-outline" size={30} color="#fff" />
                    <Text style={styles.exerciseButtonText}>Box Breathing</Text>
                </TouchableOpacity>

                {/* Moved Disclaimer Text */}
                <Text style={styles.disclaimerText}>
                    Note: Breathing exercises aren't for everyone. If uncomfortable, explore other ways to relax, like breaks, nature, or hobbies.
                </Text>
            </ScrollView>
        );
    }

    // State 2: Running exercise or Done screen
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header with Back Button and Instructions Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={backToSelection} style={styles.backButtonHeader}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{selectedExercise === '4-7-8' ? '4-7-8 Breathing' : 'Box Breathing'}</Text>
                    <TouchableOpacity onPress={openInstructions} style={styles.instructionsButtonHeader}>
                        <MaterialCommunityIcons name="information-outline" size={28} color="#5B86E5" />
                    </TouchableOpacity>
                </View>

                {/* Main Breathing Visual */}
                <View style={styles.exerciseArea}>
                    {selectedExercise === '4-7-8' ? (
                        <Animated.View
                            style={[
                                styles.breathingCircle,
                                {
                                    transform: [{ scale: scaleAnim }],
                                    backgroundColor: isActive && phase !== 'Done' ? '#5B86E5' : '#ccc',
                                },
                            ]}
                        >
                            <Text style={styles.phaseText}>{phase}</Text>
                            {isActive && phase !== 'Done' && phase !== 'Get Ready' && (
                                <Text style={styles.timerText}>{timer}</Text>
                            )}
                            {phase === 'Get Ready' && (
                                <Text style={styles.timerText}>{timer}</Text>
                            )}
                        </Animated.View>
                    ) : (
                        // Box Breathing Visual
                        <View style={styles.breathingSquare}>
                            <Animated.View
                                style={[
                                    styles.breathingRing,
                                    {
                                        left: ringX,
                                        top: ringY,
                                    },
                                ]}
                            />
                            <Text style={styles.phaseTextSquare}>{phase}</Text>
                            {isActive && phase !== 'Done' && phase !== 'Get Ready' && (
                                <Text style={styles.timerTextSquare}>{timer}</Text>
                            )}
                            {phase === 'Get Ready' && (
                                <Text style={styles.timerTextSquare}>{timer}</Text>
                            )}
                        </View>
                    )}

                    {phase !== 'Done' && (
                        <Text style={styles.repetitionText}>Repetition: {repetition + 1} / {totalRepetitions}</Text>
                    )}

                    {phase === 'Done' && (
                        <View style={styles.doneMessageContainer}>
                            <MaterialCommunityIcons name="check-circle-outline" size={60} color="#81C784" />
                            <Text style={styles.doneMessage}>Exercise Complete!</Text>
                        </View>
                    )}
                </View>

                {/* Controls - Repositioned */}
                <View style={styles.controls}>
                    {!isActive && phase !== 'Done' && ( // Only show start button if not active
                        <TouchableOpacity style={styles.controlButton} onPress={startExercise}>
                            <MaterialCommunityIcons name="play" size={24} color="#fff" />
                            <Text style={styles.controlButtonText}>Start</Text>
                        </TouchableOpacity>
                    )}
                    {isActive && (
                        <TouchableOpacity style={styles.controlButton} onPress={stopExercise}>
                            <MaterialCommunityIcons name="pause" size={24} color="#fff" />
                            <Text style={styles.controlButtonText}>Pause</Text>
                        </TouchableOpacity>
                    )}
                    {(isActive || phase === 'Done') && (
                        <TouchableOpacity style={styles.controlButton} onPress={resetExercise}>
                            <MaterialCommunityIcons name="restart" size={24} color="#fff" />
                            <Text style={styles.controlButtonText}>Reset</Text>
                        </TouchableOpacity>
                    )}
                    {phase === 'Done' && (
                        <TouchableOpacity style={styles.controlButton} onPress={backToSelection}>
                            <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#fff" />
                            <Text style={styles.controlButtonText}>Exercises</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Instructions Modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={showInstructionsModal}
                onRequestClose={closeInstructions} // For Android back button
            >
                <SafeAreaView style={styles.modalSafeArea}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{currentInstructions?.title}</Text>
                        <TouchableOpacity onPress={closeInstructions} style={styles.modalCloseButton}>
                            <MaterialCommunityIcons name="close-circle" size={28} color="#5B86E5" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.modalDescription}>{currentInstructions?.description}</Text>
                        <Text style={styles.modalSectionTitle}>How to do it:</Text>
                        {currentInstructions?.steps.map((step, index) => (
                            <Text key={index} style={styles.modalStep}>{step}</Text>
                        ))}
                        <TouchableOpacity
                            style={styles.startButtonModal}
                            onPress={startExercise} // Start exercise from modal
                        >
                            <MaterialCommunityIcons name="play-circle-outline" size={24} color="#fff" />
                            <Text style={styles.startButtonText}>Start Exercise</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
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
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        paddingBottom: 100, // Add padding to make space for the bottom nav bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
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
        flex: 1,
        textAlign: 'center',
    },
    backButtonHeader: {
        padding: 5,
    },
    instructionsButtonHeader: {
        padding: 5,
    },
    // Styles for the initial exercise selection screen
    selectionContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 20,
        paddingBottom: 100, // Also add padding for the selection screen
    },
    introImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 30,
        resizeMode: 'cover',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    introTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 28,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    introText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    disclaimerText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 0,
        paddingHorizontal: 15,
        lineHeight: 20,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 26,
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
    },
    exerciseButton: {
        backgroundColor: '#5B86E5',
        paddingVertical: 15,
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
    exerciseButtonText: {
        color: '#fff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        marginLeft: 10,
    },
    // Styles for the actual exercise display area
    exerciseArea: {
        flex: 1, // Take up remaining space below header
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20, // Add padding here
    },
    breathingCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#5B86E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 12,
    },
    breathingSquare: {
        width: squareSize,
        height: squareSize,
        borderWidth: 4,
        borderColor: '#5B86E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 12,
        borderRadius: 10,
    },
    breathingRing: {
        position: 'absolute',
        width: ringSize,
        height: ringSize,
        borderRadius: ringSize / 2,
        backgroundColor: 'tomato',
        borderColor: '#fff',
        borderWidth: 2,
    },
    phaseText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
    },
    timerText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 48,
        color: '#fff',
    },
    phaseTextSquare: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#333',
        textAlign: 'center',
    },
    timerTextSquare: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 40,
        color: '#333',
        marginTop: 5, // Adjusted to prevent overlap with phase text
    },
    repetitionText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        flexWrap: 'wrap',
        // Add marginBottom to lift buttons above the bottom navigation bar
        marginBottom: 80, // Approximate height of tab bar + some extra space
    },
    controlButton: {
        backgroundColor: '#5B86E5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 5,
    },
    controlButtonText: {
        color: '#fff',
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        marginLeft: 8,
    },
    doneMessageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    doneMessage: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 24,
        color: '#81C784',
        marginTop: 10,
    },
    // Modal specific styles
    modalSafeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    modalHeader: {
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
    modalTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        color: '#333',
        flex: 1,
        textAlign: 'center',
        marginLeft: 28, // Offset for close button
    },
    modalCloseButton: {
        padding: 5,
    },
    modalContent: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    modalDescription: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    modalSectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    modalStep: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
        textAlign: 'left',
        width: '100%',
        paddingHorizontal: 10,
    },
    startButtonModal: { // Style for the Start button inside the modal
        backgroundColor: '#81C784',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
});

export default BreathingScreen;
