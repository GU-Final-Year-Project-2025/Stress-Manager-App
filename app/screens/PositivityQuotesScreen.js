// app/screens/PositivityQuotesScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
];

const colors = ['#331aff', '#2412b3', '#8000ff', '#0074ff', '#0051b3']; // Your provided color palette
const imagePath = '../../assets/images/UGDA202102308.jpeg'; // Path to your image

const PositivityQuotesScreen = () => {
  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const goToPreviousQuote = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollViewRef.current?.scrollTo({ x: (currentIndex - 1) * width, animated: true });
    }
  };

  const goToNextQuote = () => {
    if (currentIndex < quotes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    }
  };

  const handleScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffset / width);
    setCurrentIndex(newIndex);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image source={require(imagePath)} style={styles.fullWidthImage} />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={200}
      >
        {quotes.map((item, index) => (
          <View
            key={index}
            style={[
              styles.quoteContainer,
              { backgroundColor: colors[index % colors.length], width: width, height: height * 0.6 }, // Adjusted height
            ]}
          >
            <Text style={styles.quoteText}>"{item.text}"</Text>
            <Text style={styles.authorText}>- {item.author}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <TouchableOpacity style={styles.navButtonLeft} onPress={goToPreviousQuote}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
      )}
      {currentIndex < quotes.length - 1 && (
        <TouchableOpacity style={styles.navButtonRight} onPress={goToNextQuote}>
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fullWidthImage: {
    width: '100%',
    height: height * 0.3, // Adjust as needed
    resizeMode: 'cover',
  },
  scrollView: {
    flex: 1,
  },
  quoteContainer: {
    padding: 30,
    width: width,
    height: height * 0.5, // Adjusted height for quote area
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to the top
  },
  quoteText: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    lineHeight: 30,
    marginBottom: 15,
    marginTop: 20, // Add some top margin to the quote
  },
  authorText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
  },
  navButtonLeft: {
    position: 'absolute',
    top: '70%',
    left: 30,
    transform: [{ translateY: -15 }],
    zIndex: 10,
  },
  navButtonRight: {
    position: 'absolute',
    top: '70%',
    right: 30,
    transform: [{ translateY: -15 }],
    zIndex: 10,
  },
});
export default PositivityQuotesScreen;