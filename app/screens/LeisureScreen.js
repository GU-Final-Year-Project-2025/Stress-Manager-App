import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Dimensions,
    Alert,
    StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Add this import

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LeisureScreen = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('cartoons');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [playingVideo, setPlayingVideo] = useState(null);
    const videoRefs = useRef({});
    const flatListRef = useRef();
    const insets = useSafeAreaInsets(); // Get safe area insets

    // Calculate the actual video height (screen height minus header and bottom safe area)
    const headerHeight = 60 + insets.top; // Approximate header height
    const videoHeight = screenHeight - insets.bottom; // Account for bottom safe area

    // Auto-play the first video when component loads
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentData = activeTab === 'cartoons' ? cartoonsData : funnyStuffData;
            if (currentData.length > 0) {
                handlePlayVideo(currentData[0].id);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [activeTab]);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
    });

    const cartoonsData = [
        {
            id: 'cartoon1',
            title: 'Stress Relief Animation',
            description: 'A calming animated short about letting go of worries',
            uri: require('../../assets/leisure/c1.mp4'),
            duration: '2:30'
        },
        {
            id: 'cartoon2',
            title: 'Mindfulness Cartoon',
            description: 'An uplifting story about staying present',
            uri: require('../../assets/leisure/c2.mp4'),
            duration: '3:15'
        },
        {
            id: 'cartoon3',
            title: 'Happy Thoughts',
            description: 'A cheerful animation to brighten your day',
            uri: require('../../assets/leisure/c3.mp4'),
            duration: '1:45'
        },
    ];

    const funnyStuffData = [
        {
            id: 'funny1',
            title: 'Comedy Sketches',
            description: 'Light-hearted comedy to make you smile',
            uri: require('../../assets/leisure/f1.mp4'),
            duration: '4:20'
        },
        {
            id: 'funny2',
            title: 'Silly Animals',
            description: 'Adorable and funny animal moments',
            uri: require('../../assets/leisure/f2.mp4'),
            duration: '3:30'
        },
        {
            id: 'funny3',
            title: 'Clean Jokes',
            description: 'Family-friendly humor for all ages',
            uri: require('../../assets/leisure/f3.mp4'),
            duration: '2:45'
        },
    ];

    const handlePlayVideo = async (videoId) => {
        try {
            // Pause all other videos
            Object.entries(videoRefs.current).forEach(([id, ref]) => {
                if (id !== videoId && ref) {
                    ref.pauseAsync();
                }
            });

            // Play the selected video
            if (videoRefs.current[videoId]) {
                const status = await videoRefs.current[videoId].getStatusAsync();
                if (!status.isPlaying) {
                    await videoRefs.current[videoId].playAsync();
                    setPlayingVideo(videoId);
                }
            }
        } catch (error) {
            console.error('Video play error:', error);
        }
    };

    const togglePlayPause = async (videoId) => {
        try {
            if (videoRefs.current[videoId]) {
                const status = await videoRefs.current[videoId].getStatusAsync();
                if (status.isPlaying) {
                    await videoRefs.current[videoId].pauseAsync();
                    setPlayingVideo(null);
                } else {
                    await videoRefs.current[videoId].playAsync();
                    setPlayingVideo(videoId);
                }
            }
        } catch (error) {
            console.error('Toggle play error:', error);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            const currentData = activeTab === 'cartoons' ? cartoonsData : funnyStuffData;
            const newVideoId = currentData[newIndex]?.id;
            
            // Only proceed if we have a valid new video
            if (!newVideoId) return;
            
            // If we're switching to a different video, pause the current one first
            if (playingVideo && playingVideo !== newVideoId) {
                if (videoRefs.current[playingVideo]) {
                    videoRefs.current[playingVideo].pauseAsync().catch(console.error);
                }
                setPlayingVideo(null);
            }
            
            setCurrentVideoIndex(newIndex);
            
            // Auto-play the new video after a brief delay to ensure smooth transition
            setTimeout(() => {
                handlePlayVideo(newVideoId);
            }, 100);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderVideoItem = ({ item, index }) => {
        const isPlaying = playingVideo === item.id;

        return (
            <View style={[styles.videoContainer, { height: videoHeight }]}>
                <Video
                    ref={ref => videoRefs.current[item.id] = ref}
                    style={styles.video}
                    source={item.uri}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    isLooping={true}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            setPlayingVideo(null);
                        }
                    }}
                    onError={(error) => {
                        console.error(`Video ${item.id} error:`, error);
                    }}
                />
                
                {/* Tap to play/pause overlay */}
                <TouchableOpacity
                    style={styles.videoOverlay}
                    onPress={() => togglePlayPause(item.id)}
                    activeOpacity={1}
                >
                    {/* Play/Pause Icon - only show when paused */}
                    {!isPlaying && (
                        <View style={styles.playIconContainer}>
                            <MaterialCommunityIcons
                                name="play"
                                size={80}
                                color="rgba(255, 255, 255, 0.9)"
                            />
                        </View>
                    )}
                </TouchableOpacity>

                {/* Video Info Overlay */}
                <View style={[styles.infoOverlay, { paddingBottom: 40 + insets.bottom }]}>
                    <View style={styles.videoInfo}>
                        <Text style={styles.videoTitle}>{item.title}</Text>
                        <Text style={styles.videoDescription}>{item.description}</Text>
                    </View>
                    
                    {/* Duration badge */}
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{item.duration}</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    const currentData = activeTab === 'cartoons' ? cartoonsData : funnyStuffData;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            
            {/* Header */}
            <SafeAreaView style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    
                    {/* Tab Pills */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'cartoons' && styles.activeTab]}
                            onPress={() => setActiveTab('cartoons')}
                        >
                            <Text style={[styles.tabText, activeTab === 'cartoons' && styles.activeTabText]}>
                                Cartoons
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'funny' && styles.activeTab]}
                            onPress={() => setActiveTab('funny')}
                        >
                            <Text style={[styles.tabText, activeTab === 'funny' && styles.activeTabText]}>
                                Funny
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.headerRight} />
                </View>
            </SafeAreaView>

            {/* Fullscreen Video Feed */}
            <FlatList
                ref={flatListRef}
                data={currentData}
                keyExtractor={(item) => item.id}
                renderItem={renderVideoItem}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={videoHeight}
                decelerationRate="fast"
                style={styles.videoFeed}
            />

            {/* Video Counter */}
            <View style={[styles.counterContainer, { bottom: 50 + insets.bottom }]}>
                <Text style={styles.counterText}>
                    {currentVideoIndex + 1} / {currentData.length}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
        width: 40,
    },
    headerRight: {
        width: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 3,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 17,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    tabText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    activeTabText: {
        color: '#333',
    },
    videoFeed: {
        flex: 1,
    },
    videoContainer: {
        width: screenWidth,
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    },
    videoInfo: {
        marginBottom: 10,
    },
    videoTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
    },
    videoDescription: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
    durationBadge: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    durationText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#fff',
    },
    counterContainer: {
        position: 'absolute',
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    counterText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 12,
        color: '#fff',
    },
});

export default LeisureScreen;