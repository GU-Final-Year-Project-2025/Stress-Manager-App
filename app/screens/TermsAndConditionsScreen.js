import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useNavigation } from '@react-navigation/native';

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleAccept = () => {
    // Logic for accepting terms, e.g., navigate to AuthScreen or directly to MainTabs
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthScreen' }], // Navigate to AuthScreen after accepting terms
    });
  };

  const handleDecline = () => {
    // Logic for declining terms, e.g., go back to Onboarding or exit app
    navigation.goBack(); // Go back to the previous screen (Onboarding)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to the Stress Manager App. These Terms and Conditions govern your use of our mobile application and services. By accessing or using the App, you agree to be bound by these Terms.
          </Text>

          <Text style={styles.sectionTitle}>2. Use of the App</Text>
          <Text style={styles.paragraph}>
            The App is designed to provide tools and resources for stress management, including guided meditations, breathing exercises, and mindfulness practices. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            To access certain features of the App, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </Text>

          <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy, which is incorporated by reference into these Terms, describes how we collect, use, and disclose your personal information. Please review it carefully.
          </Text>

          <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content and materials available on the App, including but not limited to text, graphics, logos, icons, images, and software, are the property of the Stress Manager App or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </Text>

          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            The Stress Manager App and its affiliates will not be liable for any damages of any kind arising from your use of the App, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
          </Text>

          <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on the App. Your continued use of the App after any such changes constitutes your acceptance of the new Terms.
          </Text>

          <Text style={styles.sectionTitle}>8. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
          </Text>

          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at support@stressmanagerapp.com.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={handleDecline}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept}
        >
          <Text style={styles.acceptButtonText}>Accept and Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: '#333',
  },
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  contentContainer: {
    paddingBottom: 20, // Add padding at the bottom for scroll comfort
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  acceptButton: {
    backgroundColor: '#5B86E5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 150, // Give a minimum width
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  acceptButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  declineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    minWidth: 100, // Give a minimum width
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'tomato',
  },
  declineButtonText: {
    color: '#5B86E5',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
});

export default TermsAndConditionsScreen;
