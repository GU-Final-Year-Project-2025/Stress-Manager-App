// app/screens/GuidedMeditationTab.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { Video, Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Helper function to format time from milliseconds to MM:SS
const formatTime = (milliseconds) => {
  if (!milliseconds) return '0:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const GuidedMeditationTab = () => {
  const [showMediaTypeDropdown, setShowMediaTypeDropdown] = useState(false);                                                                                                                                               
  const [selectedMediaType, setSelectedMediaType] = useState('audio'); // Default to audio
  const [guidedMeditations, setGuidedMeditations] = useState([
    { id: 'gaudio1', type: 'audio', category: 'guided', title: 'Clear the Clutter in your Mind', uri: require('../../assets/meditation/guided/audio1.mp3') },
    { id: 'gvideo1', type: 'video', category: 'guided-video', title: 'Video 1', uri: require('../../assets/meditation/guided/video1.mp4') },
    { id: 'gaudio2', type: 'audio', category: 'guided', title: 'Nature Sounds Guide', uri: require('../../assets/meditation/guided/audio2.mp3') },
    { id: 'gvideo2', type: 'video', category: 'guided-video', title: 'Video 2', uri: require('../../assets/meditation/guided/video2.mp4') },
    { id: 'gcontent1', type: 'content', category: 'guided-content', title: 'Text Guidance 1', body: '...'}, // Example of other content
  ]);
  const [videoGuidedMeditations, setVideoGuidedMeditations] = useState([]);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioSound, setAudioSound] = useState(null);
  const [audioStatus, setAudioStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const videos = guidedMeditations.filter(item => item.type === 'video' && item.category === 'guided-video');
    setVideoGuidedMeditations(videos);
  }, [guidedMeditations]);

  const toggleMediaTypeDropdown = () => {
    setShowMediaTypeDropdown(!showMediaTypeDropdown);
  };

  const handleMediaTypeSelect = (type) => {
    setSelectedMediaType(type);
    setShowMediaTypeDropdown(false);
  };

  const playVideo = (videoItem) => {
    setCurrentVideo(videoItem);
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
    setVideoStatus({});
  };

  const playAudio = async (audioItem, playlist = null, trackIndex = 0) => {
    try {
      // Stop any currently playing audio
      if (audioSound) {
        await audioSound.unloadAsync();
        setAudioSound(null);
      }

      // Set up playlist if provided
      if (playlist) {
        setCurrentPlaylist(playlist);
        setCurrentTrackIndex(trackIndex);
      } else {
        // Create playlist from all audio meditations
        const audioMeditations = guidedMeditations.filter(item => item.type === 'audio' && item.category === 'guided');
        const currentIndex = audioMeditations.findIndex(item => item.id === audioItem.id);
        setCurrentPlaylist(audioMeditations);
        setCurrentTrackIndex(currentIndex >= 0 ? currentIndex : 0);
      }

      // Create and load new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioItem.uri },
        { shouldPlay: false }
      );
      
      setAudioSound(sound);
      setCurrentAudio(audioItem);
      setShowAudioPlayer(true);
      setIsPlaying(false);

      // Set up status updates
      sound.setOnPlaybackStatusUpdate((status) => {
        setAudioStatus(status);
        setIsPlaying(status.isPlaying || false);
        
        // Auto-play next track when current track ends
        if (status.didJustFinish && !status.isLooping) {
          playNextTrack();
        }
      });
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const closeAudioPlayer = async () => {
    if (audioSound) {
      await audioSound.unloadAsync();
      setAudioSound(null);
    }
    setShowAudioPlayer(false);
    setCurrentAudio(null);
    setAudioStatus({});
    setIsPlaying(false);
    setShowPlaylist(false);
    setCurrentPlaylist([]);
    setCurrentTrackIndex(0);
  };

  const toggleAudioPlayback = async () => {
    if (audioSound) {
      if (isPlaying) {
        await audioSound.pauseAsync();
      } else {
        await audioSound.playAsync();
      }
    }
  };

  const playNextTrack = async () => {
    if (currentPlaylist.length === 0) return;
    
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    const nextTrack = currentPlaylist[nextIndex];
    
    if (nextTrack) {
      await playAudio(nextTrack, currentPlaylist, nextIndex);
    }
  };

  const playPreviousTrack = async () => {
    if (currentPlaylist.length === 0) return;
    
    const prevIndex = currentTrackIndex === 0 ? currentPlaylist.length - 1 : currentTrackIndex - 1;
    const prevTrack = currentPlaylist[prevIndex];
    
    if (prevTrack) {
      await playAudio(prevTrack, currentPlaylist, prevIndex);
    }
  };

  const selectTrackFromPlaylist = async (track, index) => {
    await playAudio(track, currentPlaylist, index);
    setShowPlaylist(false);
  };

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  const seekAudio = async (position) => {
    if (audioSound && audioStatus.durationMillis) {
      const seekPosition = position * audioStatus.durationMillis;
      await audioSound.setPositionAsync(seekPosition);
    }
  };

  const renderMeditationItem = (item) => {
    if (selectedMediaType === 'all' || item.type === selectedMediaType) {
      return (
        <TouchableOpacity 
          key={item.id} 
          style={styles.meditationItem}
          onPress={() => {
            if (item.type === 'video') {
              playVideo(item);
            } else if (item.type === 'audio') {
              playAudio(item);
            }
          }}
        >
          <Text style={styles.meditationTitle}>{item.title}</Text>
          {item.type === 'video' && <Icon name="play-circle-outline" size={30} color="#5B86E5" />}
          {item.type === 'audio' && <Icon name="volume-high" size={30} color="#5B86E5" />}
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderVideoGuidedItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.meditationItem}
      onPress={() => playVideo(item)}
    >
      <View style={styles.videoItemContainer}>
        <Text style={styles.meditationTitle}>{item.title}</Text>
        <Icon name="play-circle-outline" size={30} color="#5B86E5" style={styles.playIcon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Media Type Selector */}
      <TouchableOpacity style={styles.mediaTypeSelector} onPress={toggleMediaTypeDropdown}>
        <Text style={styles.selectedMediaTypeText}>
          {selectedMediaType === 'all' ? 'All' : selectedMediaType.charAt(0).toUpperCase() + selectedMediaType.slice(1)} Guided Meditations
        </Text>
        <Icon name={showMediaTypeDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#777" />
      </TouchableOpacity>

      {/* Dropdown */}
      {showMediaTypeDropdown && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handleMediaTypeSelect('all')}>
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handleMediaTypeSelect('audio')}>
            <Text>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handleMediaTypeSelect('video')}>
            <Text>Video</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guided Meditation List */}
      <ScrollView style={styles.meditationListContainer}>
        {selectedMediaType === 'audio' && guidedMeditations.filter(item => item.type === 'audio' && item.category === 'guided').map(renderMeditationItem)}
        {selectedMediaType === 'video' && videoGuidedMeditations.map(renderVideoGuidedItem)}
        {selectedMediaType === 'all' && guidedMeditations.filter(item => item.category === 'guided' || item.category === 'guided-video').map(renderMeditationItem)}

        {(selectedMediaType === 'audio' && guidedMeditations.filter(item => item.type === 'audio' && item.category === 'guided').length === 0) && selectedMediaType !== 'all' && (
          <Text style={styles.emptyListText}>No audio guided meditations available.</Text>
        )}
        {(selectedMediaType === 'video' && videoGuidedMeditations.length === 0) && selectedMediaType !== 'all' && (
          <Text style={styles.emptyListText}>No video guided meditations available.</Text>
        )}
        {selectedMediaType === 'all' && guidedMeditations.filter(item => item.category === 'guided' || item.category === 'guided-video').length === 0 && (
          <Text style={styles.emptyListText}>No guided meditations available.</Text>
        )}
      </ScrollView>

      {/* Audio Player Modal */}
      <Modal
        visible={showAudioPlayer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAudioPlayer}
      >
        <View style={styles.audioPlayerContainer}>
          {/* Header */}
          <View style={styles.audioPlayerHeader}>
            <TouchableOpacity onPress={closeAudioPlayer} style={styles.closeButton}>
              <Icon name="chevron-down" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.audioPlayerHeaderTitle}>Now Playing</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Album Art / Visual */}
          <View style={styles.audioVisualContainer}>
            <View style={styles.audioAlbumArt}>
              <Icon name="music-note" size={60} color="#5B86E5" />
            </View>
          </View>

          {/* Track Info */}
          <View style={styles.audioInfoContainer}>
            <Text style={styles.audioTitle}>{currentAudio?.title}</Text>
            <Text style={styles.audioSubtitle}>Guided Meditation</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>
              {audioStatus.positionMillis ? formatTime(audioStatus.positionMillis) : '0:00'}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${audioStatus.durationMillis ? 
                        (audioStatus.positionMillis / audioStatus.durationMillis) * 100 : 0}%` 
                    }
                  ]} 
                />
              </View>
            </View>
            <Text style={styles.timeText}>
              {audioStatus.durationMillis ? formatTime(audioStatus.durationMillis) : '0:00'}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.audioControlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={playPreviousTrack}
              disabled={currentPlaylist.length <= 1}
            >
              <Icon 
                name="skip-previous" 
                size={32} 
                color={currentPlaylist.length <= 1 ? "#ccc" : "#333"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playPauseButton} 
              onPress={toggleAudioPlayback}
            >
              <Icon 
                name={isPlaying ? "pause" : "play"} 
                size={40} 
                color="#fff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={playNextTrack}
              disabled={currentPlaylist.length <= 1}
            >
              <Icon 
                name="skip-next" 
                size={32} 
                color={currentPlaylist.length <= 1 ? "#ccc" : "#333"} 
              />
            </TouchableOpacity>
          </View>

          {/* Additional Controls */}
          <View style={styles.additionalControls}>
            <TouchableOpacity style={styles.additionalControlButton}>
              <Icon name="repeat" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionalControlButton}>
              <Icon name="heart-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.additionalControlButton}
              onPress={togglePlaylist}
            >
              <Icon 
                name="playlist-music" 
                size={24} 
                color={showPlaylist ? "#5B86E5" : "#666"} 
              />
            </TouchableOpacity>
          </View>

          {/* Playlist Modal */}
          {showPlaylist && (
            <View style={styles.playlistOverlay}>
              <View style={styles.playlistContainer}>
                <View style={styles.playlistHeader}>
                  <Text style={styles.playlistTitle}>Playlist</Text>
                  <TouchableOpacity onPress={() => setShowPlaylist(false)}>
                    <Icon name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.playlistScrollView}>
                  {currentPlaylist.map((track, index) => (
                    <TouchableOpacity
                      key={track.id}
                      style={[
                        styles.playlistItem,
                        currentTrackIndex === index && styles.playlistItemActive
                      ]}
                      onPress={() => selectTrackFromPlaylist(track, index)}
                    >
                      <View style={styles.playlistItemContent}>
                        <Icon 
                          name={currentTrackIndex === index && isPlaying ? "volume-high" : "music-note"} 
                          size={20} 
                          color={currentTrackIndex === index ? "#5B86E5" : "#666"} 
                        />
                        <Text style={[
                          styles.playlistItemTitle,
                          currentTrackIndex === index && styles.playlistItemTitleActive
                        ]}>
                          {track.title}
                        </Text>
                      </View>
                      {currentTrackIndex === index && (
                        <Icon name="play" size={16} color="#5B86E5" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Video Player Modal */}
      <Modal
        visible={showVideoPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeVideoPlayer}
      >
        <View style={styles.videoPlayerContainer}>
          {/* Header */}
          <View style={styles.videoPlayerHeader}>
            <TouchableOpacity onPress={closeVideoPlayer} style={styles.closeButton}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.videoPlayerTitle}>
              {currentVideo?.title || 'Video Player'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Video Player */}
          <View style={styles.videoWrapper}>
            {currentVideo && (
              <Video
                source={{ uri: currentVideo.uri }}
                style={styles.video}
                useNativeControls
                resizeMode="cover"
                isLooping={false}
                shouldPlay={true}
                onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
              />
            )}
          </View>

          {/* Video Info */}
          <View style={styles.videoInfo}>
            <Text style={styles.videoInfoTitle}>{currentVideo?.title}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  mediaTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedMediaTypeText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  dropdownItemLastChild: {
    borderBottomWidth: 0,
  },
  meditationListContainer: {
    flex: 1,
  },
  meditationItem: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  playIcon: {},
  emptyListText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  // Video Player Styles
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50, // Account for status bar
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    padding: 5,
  },
  videoPlayerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    width: width,
    height: height - 100, // Full height minus header space
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  videoInfoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Audio Player Styles
  audioPlayerContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  audioPlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  audioPlayerHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  audioVisualContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  audioAlbumArt: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#e8f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  audioInfoContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  audioTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  audioSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  progressBarContainer: {
    marginVertical: 10,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5B86E5',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  audioControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 20,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5B86E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    shadowColor: '#5B86E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    paddingBottom: 40,
  },
  additionalControlButton: {
    padding: 10,
  },
});

export default GuidedMeditationTab;