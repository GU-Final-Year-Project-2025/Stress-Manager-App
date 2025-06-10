// app/screens/MindfulnessScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MirrorAffirmationsScreen from './MirrorAffirmationsScreen';
import PositivityQuotesScreen from './PositivityQuotesScreen';
import { useFonts, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const MindfulnessScreen = () => {
  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [activeTab, setActiveTab] = useState('mirror'); // Default active tab

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'mirror' && styles.activeTab]}
            onPress={() => setActiveTab('mirror')}
          >
            <Text style={[styles.tabText, activeTab === 'mirror' && styles.activeTabText]}>My Mirror</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'positivity' && styles.activeTab]}
            onPress={() => setActiveTab('positivity')}
          >
            <Text style={[styles.tabText, activeTab === 'positivity' && styles.activeTabText]}>Positivity</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area based on activeTab */}
        <View style={styles.content}>
          {activeTab === 'mirror' && <MirrorAffirmationsScreen />}
          {activeTab === 'positivity' && <PositivityQuotesScreen />}
        </View>
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
    backgroundColor: '#F9F9F9', // Ensure background covers the whole screen
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Reduced shadow for a softer look
    shadowRadius: 3,
    elevation: 4, // Android shadow
    borderBottomWidth: 1, // Subtle bottom border
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center', // Center text vertically
  },
  activeTab: {
    borderBottomWidth: 3, // Thicker active indicator
    borderBottomColor: '#5B86E5', // Blue indicator
  },
  tabText: {
    fontSize: 16,
    color: '#666', // Default text color
    fontFamily: 'Poppins_500Medium',
  },
  activeTabText: {
    color: '#5B86E5', // Active tab text color
    fontFamily: 'Poppins_600SemiBold', // Slightly bolder for active
  },
  content: {
    flex: 1, // This ensures the content area takes up the remaining space
  },
});

export default MindfulnessScreen;