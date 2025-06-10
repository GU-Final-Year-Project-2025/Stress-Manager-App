import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useFonts, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow

const PSS10Screen = () => {
  const pss10Questions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and 'stressed'?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
  ];

  const answerOptions = ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"];
  const answerValues = [0, 1, 2, 3, 4];

  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [answers, setAnswers] = useState(Array(pss10Questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = async () => {
    if (answers.includes(null)) {
      // Instead of just logging, perhaps show an alert or a message to the user
      // For now, we'll keep the log but note that user feedback is crucial here.
      console.log("Please answer all questions before calculating the score.");
      // Example of a simple alert (consider a custom modal for better UX)
      // Alert.alert("Incomplete", "Please answer all questions before calculating the score.");
      return;
    }

    let totalScore = 0;
    for (let i = 0; i < pss10Questions.length; i++) {
      let value = answerValues[answers[i]];
      // Reverse scoring for positive questions (indices 3, 4, 6, 7)
      // These are "How often have you felt confident...", "How often have you felt that things were going your way?",
      // "How often have you been able to control irritations in your life?", "How often have you felt that you were on top of things?"
      if ([3, 4, 6, 7].includes(i)) {
        value = 4 - value; // Reverse the score (0->4, 1->3, 2->2, 3->1, 4->0)
      }
      totalScore += value;
    }
    setScore(totalScore);

    if (userId && db) {
      try {
        const scoresCollectionRef = collection(db, 'pss10_scores');
        await addDoc(scoresCollectionRef, {
          userId: userId,
          score: totalScore,
          timestamp: new Date(),
        });
        console.log("PSS-10 score saved to Firestore!");
      } catch (error) {
        console.error("Error saving PSS-10 score to Firestore:", error);
      }
    } else {
      console.log("Could not save score: User not authenticated or Firestore not initialized.");
    }

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const getInterpretation = (currentScore) => {
    if (currentScore >= 0 && currentScore <= 13) {
      return "Low perceived stress. You are likely coping well with daily demands.";
    } else if (currentScore >= 14 && currentScore <= 26) {
      return "Moderate perceived stress. You may be experiencing some stress, consider implementing stress-reducing techniques.";
    } else if (currentScore >= 27 && currentScore <= 40) {
      return "High perceived stress. You are likely experiencing significant stress. It might be beneficial to seek professional support.";
    }
    return "Score out of range. Please review answers."; // Fallback for unexpected scores
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perceived Stress Scale</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Title is now in the header */}
        {pss10Questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{`${index + 1}. ${question}`}</Text>
            <View style={styles.optionsContainer}>
              {answerOptions.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    answers[index] === optionIndex && styles.selectedOption,
                  ]}
                  onPress={() => handleAnswer(index, optionIndex)}
                >
                  <Text style={[styles.optionText, answers[index] === optionIndex && styles.selectedOptionText]}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.calculateButton} onPress={calculateScore}>
          <Text style={styles.buttonText}>Calculate Score</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Your PSS-10 Score</Text>
            {score !== null && (
              <>
                <Text style={styles.modalScore}>{score}</Text>
                <Text style={styles.modalInterpretation}>{getInterpretation(score)}</Text>
                {score > 26 && ( // Only show suggestion button for high stress
                  <TouchableOpacity
                    style={styles.modalSuggestionButton}
                    onPress={() => {
                        setModalVisible(false); // Close modal first
                        navigation.navigate('More', { screen: 'ProfessionalSupport' }); // Navigate to ProfessionalSupport section
                    }}
                  >
                    <Text style={styles.modalSuggestionText}>Connect with Professional Support</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'flex-start', // Align items to the start
  },
  backButton: {
    padding: 5,
    marginRight: 15, // Space between arrow and title
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20, // Slightly smaller to fit nicely
    color: '#333',
    flex: 1, // Allow title to take remaining space
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10, // Adjust top padding as title is in header
  },
  // Removed the old 'title' style as it's replaced by 'headerTitle'
  questionContainer: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Changed to space-between for consistent spacing
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    width: '48%', // Adjusted width to fit two options per row with space-between
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#5B86E5',
    borderColor: '#5B86E5',
  },
  optionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
  },
  calculateButton: {
    backgroundColor: '#5B86E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScore: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#5B86E5',
    marginBottom: 10,
  },
  modalInterpretation: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalCloseButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  modalCloseText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  modalSuggestionButton: {
    backgroundColor: '#4CAF50', // A more calming green
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
  },
  modalSuggestionText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});

export default PSS10Screen;
