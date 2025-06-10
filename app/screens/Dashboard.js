import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';

const HomeScreen = () => {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    // Dummy data for progress
    const progressData = [
        { key: 'meditation', value: 20, label: 'Meditation' },
        { key: 'breathing', value: 15, label: 'Breathing' },
    ];
    const totalMinutes = progressData.reduce((sum, data) => sum + data.value, 0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello User,</Text>
                    <MaterialCommunityIcons name="account-circle" size={40} color="#5B86E5" />
                </View>

                {/* Daily Check-in */}
                <View style={styles.checkinContainer}>
                    <Text style={styles.sectionTitle}>How are you feeling today?</Text>
                    <View style={styles.moodIcons}>
                        <TouchableOpacity style={styles.moodButton}>
                            <MaterialCommunityIcons name="emoticon-happy-outline" size={30} color="#FFD54F" />
                            <Text style={styles.moodText}>Good</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.moodButton}>
                            <MaterialCommunityIcons name="emoticon-neutral-outline" size={30} color="#A1887F" />
                            <Text style={styles.moodText}>Okay</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.moodButton}>
                            <MaterialCommunityIcons name="emoticon-sad-outline" size={30} color="#90CAF9" />
                            <Text style={styles.moodText}>Stressed</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialCommunityIcons name="meditation" size={30} color="#fff" />
                        <Text style={styles.actionText}>Meditation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialCommunityIcons name="breath" size={30} color="#fff" />
                        <Text style={styles.actionText}>Breathing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="music" size={30} color="#fff" />
                        <Text style={styles.actionText}>Relax Music</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Overview (Text-based) */}
                <View style={styles.progressContainer}>
                    <Text style={styles.sectionTitle}>Your Progress</Text>
                    {progressData.map((item) => (
                        <Text key={item.key} style={styles.progressText}>
                            {item.label}: {item.value} min
                        </Text>
                    ))}
                    <Text style={styles.progressTotal}>Total: {totalMinutes} min</Text>
                </View>

                {/* Recommended Sessions */}
                <View style={styles.recommendationsContainer}>
                    <Text style={styles.sectionTitle}>Recommended for You</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.recommendationItem}>
                            <Text style={styles.recommendationTitle}>Quick Calm Meditation</Text>
                            <Text style={styles.recommendationDuration}>5 min</Text>
                        </View>
                        <View style={styles.recommendationItem}>
                            <Text style={styles.recommendationTitle}>Soothing Sounds for Sleep</Text>
                            <Text style={styles.recommendationDuration}>15 min</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Mindfulness Quote/Tip of the Day */}
                <View style={styles.tipContainer}>
                    <FontAwesome5 name="quote-left" size={16} color="#5B86E5" />
                    <Text style={styles.tipText}>"The only way to do great work is to love what you do."</Text>
                    <FontAwesome5 name="quote-right" size={16} color="#5B86E5" />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 24,
        color: '#333',
    },
    sectionTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    checkinContainer: {
        marginBottom: 20,
    },
    moodIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    moodButton: {
        alignItems: 'center',
    },
    moodText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#5B86E5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: 100,
    },
    actionText: {
        color: '#fff',
        fontFamily: 'Poppins_500Medium',
        marginTop: 5,
        textAlign: 'center',
    },
    progressContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    progressText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    progressTotal: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    recommendationsContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    recommendationItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginRight: 10,
        width: 180,
        justifyContent: 'space-between',
    },
    recommendationTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    recommendationDuration: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 12,
        color: '#666',
    },
    tipContainer: {
        backgroundColor: '#E6EEFF',
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    tipText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default HomeScreen;