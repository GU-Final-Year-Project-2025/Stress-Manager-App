import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Placeholder for when we install expo-camera
const CAMERA_PLACEHOLDER = 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Camera+Preview';

// List of positive affirmations for users to say
const AFFIRMATIONS = [
  "I am capable of handling whatever comes my way today.",
  "My challenges help me grow stronger each day.",
  "I choose to focus on what I can control.",
  "I am worthy of peace and happiness.",
  "My mind becomes calm when I focus on my breath.",
  "I release tension and embrace tranquility.",
  "I am exactly where I need to be right now.",
  "I approach challenges with curiosity instead of fear.",
  "Every breath brings me deeper into the present moment.",
  "I trust myself to make good decisions.",
];

const MindfulnessScreen = () => {
  // State management
  const [currentAffirmation, setCurrentAffirmation] = useState(AFFIRMATIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [recordings, setRecordings] = useState([
    // Sample recordings for UI demonstration
    {
      id: 'sample_1',
      name: 'Sample Reflection 1',
      date: new Date().toLocaleString()
    },
    {
      id: 'sample_2',
      name: 'Sample Reflection 2',
      date: new Date(Date.now() - 86400000).toLocaleString() // Yesterday
    }
  ]);
  
  // Generate a new random affirmation
  const getNewAffirmation = () => {
    const currentIndex = AFFIRMATIONS.indexOf(currentAffirmation);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
    } while (newIndex === currentIndex && AFFIRMATIONS.length > 1);
    
    setCurrentAffirmation(AFFIRMATIONS[newIndex]);
  };
  
  // Placeholder functions for camera features
  const startRecording = () => {
    Alert.alert(
      "Camera Required",
      "To use this feature, please install the expo-camera package:\n\nnpx expo install expo-camera",
      [{ text: "OK" }]
    );
  };
  
  const toggleCameraType = () => {
    Alert.alert(
      "Camera Required",
      "To use this feature, please install the expo-camera package:\n\nnpx expo install expo-camera",
      [{ text: "OK" }]
    );
  };
  
  // Handle recording playback (will require expo-av)
  const openVideoViewer = (recording) => {
    Alert.alert(
      "Video Playback",
      "To enable video playback, please install the expo-av package:\n\nnpx expo install expo-av",
      [{ text: "OK" }]
    );
  };
  
  // Delete a recording (placeholder)
  const deleteRecording = (recordingId) => {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this reflection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Filter out the deleted recording
            setRecordings(prevRecordings => 
              prevRecordings.filter(recording => recording.id !== recordingId)
            );
          }
        }
      ]
    );
  };
  
  // Render recording item in FlatList
  const renderRecordingItem = ({ item }) => (
    <View style={styles.recordingItem}>
      <TouchableOpacity 
        style={styles.recordingInfo}
        onPress={() => openVideoViewer(item)}
      >
        <MaterialIcons name="video-library" size={24} color="#4A90E2" />
        <View style={styles.recordingTextContainer}>
          <Text style={styles.recordingTitle}>Reflection</Text>
          <Text style={styles.recordingDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteRecording(item.id)}
      >
        <MaterialIcons name="delete" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Camera View Placeholder */}
      <View style={styles.cameraContainer}>
        <Image
          source={{ uri: CAMERA_PLACEHOLDER }}
          style={styles.camera}
          resizeMode="cover"
        />
        <View style={styles.affirmationOverlay}>
          <Text style={styles.affirmationText}>{currentAffirmation}</Text>
        </View>
      </View>
      
      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCameraType}
        >
          <MaterialIcons name="flip-camera-android" size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.recordButton}
          onPress={startRecording}
        >
          <MaterialIcons name="fiber-manual-record" size={36} color="#FF6B6B" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={getNewAffirmation}
        >
          <MaterialIcons name="refresh" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Past Recordings Section */}
      <View style={styles.recordingsContainer}>
        <Text style={styles.sectionTitle}>My Reflections</Text>
        
        {isLoading ? (
          <ActivityIndicator size="small" color="#4A90E2" />
        ) : recordings.length > 0 ? (
          <FlatList
            data={recordings}
            renderItem={renderRecordingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.recordingsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome5 name="video-slash" size={32} color="#CCC" />
            <Text style={styles.emptyStateText}>
              No reflections yet. Record your first one!
            </Text>
          </View>
        )}
      </View>
      
      {/* Installation Instructions */}
      <View style={styles.installInstructions}>
        <Text style={styles.instructionsTitle}>📱 Setup Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Install camera package:
        </Text>
        <Text style={styles.codeText}>
          npx expo install expo-camera
        </Text>
        <Text style={styles.instructionsText}>
          2. Install video playback:
        </Text>
        <Text style={styles.codeText}>
          npx expo install expo-av
        </Text>
        <Text style={styles.instructionsText}>
          3. Install file system:
        </Text>
        <Text style={styles.codeText}>
          npx expo install expo-file-system
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  cameraContainer: {
    height: '40%',
    overflow: 'hidden',
    borderRadius: 15,
    margin: 15,
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  affirmationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    alignItems: 'center',
  },
  affirmationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#4A90E2',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF6B6B',
  },
  recordingsContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  recordingsList: {
    flexGrow: 1,
  },
  recordingItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordingInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  recordingTextContainer: {
    marginLeft: 12,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  recordingDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  installInstructions: {
    padding: 15,
    backgroundColor: '#F0F8FF',
    margin: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
    fontSize: 12,
  }
});

export default MindfulnessScreen;