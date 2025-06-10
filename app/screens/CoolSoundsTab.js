// app/screens/CoolSoundsTab.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CoolSoundsTab = () => {
  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cool Sounds</Text>
      <Text style={styles.instructions}>Choose a sound type:</Text>
      <TouchableOpacity style={styles.optionButton}>
        <MaterialCommunityIcons name="volume-high" size={30} color="#81C784" style={styles.icon} />
        <Text style={styles.optionText}>Relaxing Sounds</Text>
      </TouchableOpacity>
      {/* You could add a list of actual sounds here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#555',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
  },
});

export default CoolSoundsTab;