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

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignUp = () => {
    let newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

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
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Submit form or navigate to next screen
      Alert.alert(
        "Account Created",
        "Your account has been created successfully!",
        [
          { 
            text: "Continue", 
            onPress: () => navigation.navigate('Dashboard')
          }
        ]
      );
    }
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
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.subText}>Sign up to begin your stress-free journey</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.lightText}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors({...errors, fullName: ''});
              }}
            />
          </View>
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
          
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
          
          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.lightText}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
              }}
            />
            <TouchableOpacity 
              style={styles.passwordVisibilityButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={COLORS.lightText} 
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={handleSignUp}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.signUpText}>Create Account</Text>
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
        
        <View style={styles.signInContainer}>
          <Text style={styles.haveAccountText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInText}>Sign In</Text>
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
    marginBottom: 30,
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
    marginBottom: 12,
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
    marginTop: -4,
    marginBottom: 12,
    marginLeft: 4,
  },
  termsContainer: {
    marginVertical: 16,
  },
  termsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'Poppins_500Medium',
    color: COLORS.primary,
  },
  signUpButton: {
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
  signUpText: {
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  haveAccountText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: COLORS.lightText,
  },
  signInText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: COLORS.primary,
  },
});