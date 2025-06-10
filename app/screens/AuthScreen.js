import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/images/logo.png'; // Import your app logo

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
  };

  const handleAuthAction = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully!");
        // Navigate to MainTabs after successful login
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }], // Changed from 'Dashboard' to 'MainTabs'
        });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User account created successfully!");
        // Navigate to MainTabs after successful signup
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }], // Changed from 'Dashboard' to 'MainTabs'
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for better error messages
  const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'This email is already in use';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      default:
        return error.message || 'An error occurred. Please try again';
    }
  };

// Also update the handleSkip function:
const handleSkip = () => {
  // Navigate to MainTabs for testing
  navigation.reset({
    index: 0,
    routes: [{ name: 'MainTabs' }], // Changed from 'Dashboard' to 'MainTabs'
  });
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={styles.logo}
            accessibilityLabel="App Logo"
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAuthAction}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleAuthMode}
          disabled={isLoading}
        >
          <Text style={styles.toggleButtonText}>
            {isLogin ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>

        {/* Temporary skip button for testing */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
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
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: { // Added logo style
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#5B86E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  toggleButtonText: {
    color: '#5B86E5',
    fontSize: 15,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
  },
  skipButtonText: {
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default AuthScreen;
