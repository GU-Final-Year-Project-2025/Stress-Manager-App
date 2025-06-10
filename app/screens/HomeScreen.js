import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
  });

  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const user = auth.currentUser;

  const [latestScore, setLatestScore] = useState(null);
  const [scoreInterpretation, setScoreInterpretation] = useState('');
  const [scoreColor, setScoreColor] = useState('#FF9800');
  const [historicalScores, setHistoricalScores] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setProfilePictureUrl(user.photoURL);
    }
  }, [user]);

  useEffect(() => {
    if (userId && db) {
      const scoresRef = collection(db, 'pss10_scores');
      const latestScoreQuery = query(scoresRef, where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(1));

      const unsubscribeLatest = onSnapshot(latestScoreQuery, (snapshot) => {
        if (!snapshot.empty) {
          const latestDoc = snapshot.docs[0].data();
          const score = latestDoc.score;
          setLatestScore(score);
          const interpretation = getInterpretation(score);
          setScoreInterpretation(interpretation.text);
          setScoreColor(interpretation.color);
        } else {
          setLatestScore(null);
          setScoreInterpretation('');
          setScoreColor('#FF9800');
        }
      });

      // Query for the last 7 historical scores
      const historicalScoresQuery = query(
        scoresRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'), // Order by latest first
        limit(7) // Limit to the last 7
      );

      const unsubscribeHistorical = onSnapshot(historicalScoresQuery, (snapshot) => {
        const scoresData = [];
        snapshot.forEach(doc => {
          scoresData.push({ timestamp: doc.data().timestamp.toDate(), score: doc.data().score });
        });
        // Since we ordered by desc, reverse the array to have chronological order for the chart
        setHistoricalScores(scoresData.reverse());
      });

      return () => {
        unsubscribeLatest();
        unsubscribeHistorical();
      };
    }
  }, [userId, db]);

  const getInterpretation = (score) => {
    if (score < 14) {
      return { text: "Low", color: '#4CAF50' };
    } else if (score >= 14 && score <= 26) {
      return { text: "Moderate", color: '#FFC107' };
    } else {
      return { text: "High", color: '#F44336' };
    }
  };

  const chartData = {
    labels: historicalScores.map((item, index) => `${index + 1}`),
    datasets: [
      {
        data: historicalScores.map(item => item.score),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleNotificationsPress = () => {
    console.log("Notifications pressed");
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen');
  };

  const handleChatPress = () => {
    navigation.navigate('ChatScreen');
  };

  const handleBreathingPress = () => {
    navigation.navigate('Breathing');
  };

  const handleMindfulnessPress = () => {
    navigation.navigate('Mindfulness');
  };

  const handleMeditationPress = () => {
    navigation.navigate('Meditate');
  };

  const handlePSS10Press = () => {
    navigation.navigate('PSS10Screen');
  };

  const quickActions = [
    { 
      id: 'breathing', 
      icon: 'air-purifier', 
      label: 'Breathing', 
      colors: ['#5B86E5', '#4FC3F7'],
      onPress: handleBreathingPress
    },
    { 
      id: 'mindfulness', 
      icon: 'eye-outline', 
      label: 'Mindfulness', 
      colors: ['#74518D', '#AB47BC'],
      onPress: handleMindfulnessPress
    },
    { 
      id: 'meditate', 
      icon: 'yoga', 
      label: 'Meditate', 
      colors: ['#E97777', '#FF7043'],
      onPress: handleMeditationPress
    },
    { 
      id: 'pss10', 
      icon: 'scale-balance', 
      label: 'PSS-10', 
      colors: ['#4CAF50', '#66BB6A'],
      onPress: handlePSS10Press
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>How are you feeling today?</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleChatPress} style={styles.iconButton}>
              <Icon name="message-text-outline" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotificationsPress} style={styles.iconButton}>
              <Icon name="bell-outline" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
              {profilePictureUrl ? (
                <Image source={{ uri: profilePictureUrl }} style={styles.profileImage} />
              ) : (
                <View style={styles.defaultProfileIcon}>
                  <Icon name="account-circle" size={28} color="#5B86E5" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={action.id} 
                style={[styles.enhancedQuickActionButton, { backgroundColor: action.colors[0] }]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionIconContainer}>
                  <Icon name={action.icon} size={28} color="white" />
                </View>
                <Text style={styles.enhancedQuickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Stress Level Section */}
        <View style={styles.stressSection}>
          <View style={styles.sectionHeader}>
            <Icon name="brain" size={24} color="#5B86E5" />
            <Text style={styles.sectionTitle}>Your Stress Level</Text>
          </View>
          
          <View style={styles.enhancedStressContainer}>
            {/* Current Score Display */}
            <View style={styles.scoreDisplayContainer}>
              <View style={styles.scoreLeftSection}>
                <View style={styles.scoreIndicator}>
                  <View style={[styles.scoreColorDot, { backgroundColor: scoreColor }]} />
                  <Text style={[styles.scoreNumber, { color: scoreColor }]}>
                    {latestScore !== null ? latestScore : '--'}
                  </Text>
                </View>
                <View style={styles.scoreDetails}>
                  <Text style={styles.scoreLabel}>PSS-10 Stress Score</Text>
                  <Text style={[styles.scoreInterpretation, { color: scoreColor }]}>
                    {latestScore !== null ? `${scoreInterpretation} Stress` : 'Not yet taken'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.enhancedPSSButton} onPress={handlePSS10Press}>
                <Text style={styles.enhancedButtonText}>
                  {latestScore !== null ? 'Retake' : 'Take Test'}
                </Text>
                <Icon name="arrow-right" size={16} color="white" style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>

            {/* Stress Level Indicators */}
            <View style={styles.stressIndicators}>
              <View style={styles.stressIndicatorItem}>
                <View style={[styles.indicatorDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.indicatorLabel}>Low</Text>
                <Text style={styles.indicatorRange}>0-13</Text>
              </View>
              <View style={styles.stressIndicatorItem}>
                <View style={[styles.indicatorDot, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.indicatorLabel}>Moderate</Text>
                <Text style={styles.indicatorRange}>14-26</Text>
              </View>
              <View style={styles.stressIndicatorItem}>
                <View style={[styles.indicatorDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.indicatorLabel}>High</Text>
                <Text style={styles.indicatorRange}>27-40</Text>
              </View>
            </View>

            {/* Enhanced Chart */}
            {historicalScores.length > 1 && (
              <View style={styles.enhancedChartContainer}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Historical Trend</Text>
                  <View style={styles.trendIndicator}>
                    <Icon name="trending-up" size={16} color="#666" />
                    <Text style={styles.trendText}>Progress</Text>
                  </View>
                </View>
                
                <View style={styles.chartWrapper}>
                  <LineChart
                    data={chartData}
                    width={screenWidth - 80}
                    height={200}
                    yAxisInterval={5}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#f8f9fa',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(91, 134, 229, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.6})`,
                      style: {
                        borderRadius: 12,
                      },
                      propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: "#5B86E5",
                        fill: "#ffffff"
                      },
                      propsForBackgroundLines: {
                        strokeDasharray: "3,3",
                        stroke: "#e0e0e0"
                      },
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    bezier
                    style={styles.chartStyle}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    withDots={true}
                    withShadow={false}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Enhanced Insights Section */}
        <View style={styles.insightsSection}>
          <View style={styles.sectionHeader}>
            <Icon name="target" size={24} color="#00BCD4" />
            <Text style={styles.sectionTitle}>Insights</Text>
          </View>
          
          <View style={styles.enhancedInfoCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIconContainer}>
                <Icon name="heart" size={20} color="#00BCD4" />
              </View>
              <Text style={styles.insightTitle}>Stress Management Tip</Text>
            </View>
            
            <Text style={styles.enhancedInfoText}>
              Continue your mindful activities to manage stress. Regular practice of breathing exercises and meditation can help maintain your current stress levels.
            </Text>
            
            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Weekly Goal Progress</Text>
                <Text style={styles.progressValue}>5/7 days</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '71%' }]} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: '#2c3e50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#7f8c8d',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  profileButton: {
    marginLeft: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultProfileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#2c3e50',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  enhancedQuickActionButton: {
    width: (screenWidth - 55) / 2,
    height: 70,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  quickActionIconContainer: {
    marginBottom: 12,
  },
  enhancedQuickActionText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  stressSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  enhancedStressContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  scoreDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLeftSection: {
    flex: 1,
  },
  scoreIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  scoreNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreDetails: {
    marginLeft: 24,
  },
  scoreLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  scoreInterpretation: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  enhancedPSSButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  enhancedButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginRight: 6,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  stressIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stressIndicatorItem: {
    alignItems: 'center',
    flex: 1,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  indicatorLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 2,
  },
  indicatorRange: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    color: '#7f8c8d',
  },
  enhancedChartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#2c3e50',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#666',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chartStyle: {
    borderRadius: 12,
    marginVertical: 8,
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  enhancedInfoCard: {
    backgroundColor: '#e0f7ff',
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#b3e5fc',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#b3e5fc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#2c3e50',
  },
  enhancedInfoText: {
    color: '#2c3e50',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  progressSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#666',
  },
  progressValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#00BCD4',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#00BCD4',
    borderRadius: 3,
  },
});

export default HomeScreen;