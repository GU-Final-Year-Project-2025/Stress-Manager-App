import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import GuidedMeditationTab from './GuidedMeditationTab';
import CoolSoundsTab from './CoolSoundsTab';
import { useFonts, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const MeditateScreen = () => {
  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [activeTab, setActiveTab] = useState('guided'); // Default active tab

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'guided' && styles.activeTab]}
            onPress={() => setActiveTab('guided')}
          >
            <Text style={[styles.tabText, activeTab === 'guided' && styles.activeTabText]}>Guided Meditation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'sounds' && styles.activeTab]}
            onPress={() => setActiveTab('sounds')}
          >
            <Text style={[styles.tabText, activeTab === 'sounds' && styles.activeTabText]}>Cool Sounds</Text>
          </TouchableOpacity>
        </View>

        {/* Content Area based on activeTab */}
        <View style={styles.content}>
          {activeTab === 'guided' && <GuidedMeditationTab />}
          {activeTab === 'sounds' && <CoolSoundsTab />}
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
    backgroundColor: '#F9F9F9',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#8FBC8F', // A calm green color
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_500Medium',
  },
  activeTabText: {
    color: '#8FBC8F',
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
  },
});

export default MeditateScreen;