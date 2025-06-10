// app/screens/OnboardingScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import logo from '../../assets/images/logo.png'; // Import your app logo

const OnboardingScreen = () => {
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleGetStarted = () => {
    navigation.navigate('TermsAndConditionsScreen'); // Navigate to T&C screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={logo}
          style={styles.logo}
          accessibilityLabel="App Logo"
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Stress Manager App</Text>
        <Text style={styles.subtitle}>
          Your personal companion for managing stress and enhancing well-being.
        </Text>
        <Text style={styles.description}>
          Discover guided meditations, breathing exercises, mindfulness practices, and connect with professionals to find your calm.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#5B86E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
});

export default OnboardingScreen;