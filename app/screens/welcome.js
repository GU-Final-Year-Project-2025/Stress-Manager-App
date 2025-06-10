import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';

const { width, height } = Dimensions.get('window');

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
  gradientStart: 'rgba(109, 99, 255, 0.9)', // Primary with opacity
  gradientEnd: 'rgba(255, 125, 133, 0.9)', // Secondary with opacity
};

export default function WelcomeScreen() {
  const navigation = useNavigation();
  
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleGetStarted = () => {
    navigation.navigate('SignIn');
  };

  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Background Circles */}
      <View style={[styles.circle, styles.circle1]} />
      <View style={[styles.circle, styles.circle2]} />
      <View style={[styles.circle, styles.circle3]} />
      <View style={[styles.circle, styles.circle4]} />
      <View style={[styles.circle, styles.circle5]} />
      
      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[COLORS.tertiary, COLORS.primary]}
            style={styles.logoBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="leaf" size={50} color={COLORS.white} />
          </LinearGradient>
        </View>
        
        <Text style={styles.appTitle}>Stress Manager</Text>
        <Text style={styles.appSlogan}>Your Personal Stress Relief Companion</Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(109, 99, 255, 0.15)' }]}>
              <Ionicons name="fitness" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.featureText}>Guided Breathing</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(255, 125, 133, 0.15)' }]}>
              <Ionicons name="water" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.featureText}>Stress Tracking</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(104, 211, 145, 0.15)' }]}>
              <Ionicons name="moon" size={24} color={COLORS.tertiary} />
            </View>
            <Text style={styles.featureText}>Sleep Sounds</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: 'rgba(109, 99, 255, 0.1)', // Primary with low opacity
    top: -width * 0.2,
    left: -width * 0.2,
  },
  circle2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(255, 125, 133, 0.1)', // Secondary with low opacity
    top: height * 0.1,
    right: -width * 0.3,
  },
  circle3: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(104, 211, 145, 0.1)', // Tertiary with low opacity
    bottom: height * 0.2,
    left: width * 0.1,
  },
  circle4: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: 'rgba(99, 179, 237, 0.1)', // Accent with low opacity
    bottom: -width * 0.3,
    right: width * 0.1,
  },
  circle5: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: 'rgba(109, 99, 255, 0.05)', // Primary with very low opacity
    top: height * 0.4,
    left: width * 0.4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    color: COLORS.text,
    marginBottom: 12,
  },
  appSlogan: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 48,
  },
  featureContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  featureItem: {
    alignItems: 'center',
    width: '30%',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: COLORS.white,
    marginRight: 8,
  },
});