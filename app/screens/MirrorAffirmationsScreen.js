// app/screens/MirrorAffirmationsScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const MirrorAffirmationsScreen = () => {
  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Mirror</Text>
        <Text style={styles.placeholderText}>
          Front camera mirror with positive affirmations will be implemented here.
        </Text>
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
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#333',
    marginBottom: 30,
  },
  placeholderText: {
    fontFamily: 'Poppins_500Medium', // Assuming Poppins_500Medium is available from your main app
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MirrorAffirmationsScreen;