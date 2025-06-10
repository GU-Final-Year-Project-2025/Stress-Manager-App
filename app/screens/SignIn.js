import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins';

// Theme colors
const COLORS = {
  primary: '#6D63FF', // Purple
  secondary: '#FF7D85', // Coral
  tertiary: '#68D391', // Green
  accent: '#63B3ED', // Blue
  background: '#F7FAFC',
  white: '#FFFFFF',
  text: '#2D3748',
  lightText: '#718096',
  inputBg: '#EDF2F7',
  error: '#FD5B61'
};

export default function SignInScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignIn = () => {
    let newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Submit form or navigate to dashboard
      navigation.navigate('Dashboard');
    }
  };

  // Navigate to SignUp screen
  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };
 // Navigate to Home screen
 const goToDashboard = () => {
  navigation.navigate('Dashboard');
};
  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Background Circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Sign in to continue your journey</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.lightText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({...errors, email: ''});
              }}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.lightText}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({...errors, password: ''});
              }}
            />
            <TouchableOpacity 
              style={styles.passwordVisibilityButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={COLORS.lightText} 
              />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.signUpContainer}>
          <Text style={styles.noAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={goToSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.noAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={goToDashboard}>
            <Text style={styles.signUpText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 500,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(109, 99, 255, 0.1)', // Primary with low opacity
    top: -100,
    right: -100,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(255, 125, 133, 0.1)', // Secondary with low opacity
    top: 150,
    left: -100,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(104, 211, 145, 0.1)', // Tertiary with low opacity
    bottom: -50,
    right: -50,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContainer: {
    marginBottom: 40,
  },
  welcomeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
  },
  subText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: COLORS.lightText,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    marginBottom: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: COLORS.text,
  },
  passwordVisibilityButton: {
    padding: 5,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: COLORS.error,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  signInButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: COLORS.white,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(113, 128, 150, 0.2)',
  },
  orText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: COLORS.lightText,
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  noAccountText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: COLORS.lightText,
  },
  signUpText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: COLORS.primary,
  },
});