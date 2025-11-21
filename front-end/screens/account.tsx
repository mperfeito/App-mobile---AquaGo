import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native"; 
import Ionicons from "react-native-vector-icons/Ionicons";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Definir tipos para as props
interface WaterDropProps {
  waterLevel: Animated.Value;
  currentHydration: number;
  dailyGoal: number;
}

// Componente da gota de água animada simplificado
const WaterDrop: React.FC<WaterDropProps> = ({ waterLevel, currentHydration, dailyGoal }) => {
  const dropHeight = 280;
  
  return (
    <View style={styles.waterDropContainer}>
      {/* Container da gota */}
      <View style={styles.dropOutline}>
        {/* Água dentro da gota */}
        <Animated.View 
          style={[
            styles.waterFill,
            {
              height: waterLevel.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '85%'],
              }),
            }
          ]} 
        />
        
        {/* Contorno da gota */}
        <Svg width={180} height={dropHeight} style={styles.waterDropSvg}>
          <Path
            d="M90 20 C40 20 20 90 20 150 C20 210 60 260 90 260 C120 260 160 210 160 150 C160 90 140 20 90 20 Z"
            fill="none"
            stroke="#60A7D2"
            strokeWidth="3"
          />
        </Svg>
      </View>
      
      {/* Indicador de nível */}
      <View style={styles.waterLevelIndicator}>
        <Text style={styles.waterLevelText}>
          {currentHydration}ml
        </Text>
        <Text style={styles.waterLevelSubtext}>
          {Math.round((currentHydration / dailyGoal) * 100)}%
        </Text>
      </View>
      
      {/* Bolhas de ar animadas */}
      <Animated.View style={[styles.bubble, styles.bubble1]} />
      <Animated.View style={[styles.bubble, styles.bubble2]} />
      <Animated.View style={[styles.bubble, styles.bubble3]} />
    </View>
  );
};

const HydrationTracker: React.FC = () => {
  const navigation = useNavigation();
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [currentHydration, setCurrentHydration] = useState<number>(750);
  const waterLevel = useRef(new Animated.Value(750 / 2500)).current;
  const [bubbleAnim1] = useState<Animated.Value>(new Animated.Value(0));
  const [bubbleAnim2] = useState<Animated.Value>(new Animated.Value(0));
  const [bubbleAnim3] = useState<Animated.Value>(new Animated.Value(0));

  const waterAmounts: number[] = [100, 250, 500, 750];
  const dailyGoal: number = 2500;

  // Animação das bolhas
  const animateBubbles = (): void => {
    const createBubbleAnimation = (anim: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.parallel([
      createBubbleAnimation(bubbleAnim1),
      createBubbleAnimation(bubbleAnim2),
      createBubbleAnimation(bubbleAnim3),
    ]).start();
  };

  const calculateWaterLevel = (amount: number): void => {
    const newTotal = Math.min(currentHydration + amount, dailyGoal);
    const newPercentage = Math.min(newTotal / dailyGoal, 1);

    // Animação do nível da água
    Animated.spring(waterLevel, {
      toValue: newPercentage,
      tension: 50,
      friction: 10,
      useNativeDriver: false,
    }).start();

    // Animação das bolhas
    animateBubbles();

    setCurrentHydration(newTotal);
    setSelectedAmount(amount);
  };

  const resetHydration = (): void => {
    Animated.spring(waterLevel, {
      toValue: 0,
      tension: 50,
      friction: 10,
      useNativeDriver: false,
    }).start();
    
    setCurrentHydration(0);
    setSelectedAmount(250);
  };

  // Estilos animados para as bolhas
  const bubble1Style = {
    transform: [{
      translateY: bubbleAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -120],
      }),
    }],
    opacity: bubbleAnim1.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.8, 0],
    }),
  };

  const bubble2Style = {
    transform: [{
      translateY: bubbleAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -150],
      }),
    }],
    opacity: bubbleAnim2.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.8, 0],
    }),
  };

  const bubble3Style = {
    transform: [{
      translateY: bubbleAnim3.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -180],
      }),
    }],
    opacity: bubbleAnim3.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.8, 0],
    }),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Melhorado */}
        <LinearGradient
          colors={["#60A7D2", "#4A90BF"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{
                  uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5747d283-5cd8-4eef-ab39-c0088e4590dd",
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
              <View>
                <Text style={styles.greeting}>Hello,</Text>
                <Text style={styles.username}>user123</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Daily Goal Card */}
        <View style={styles.goalCard}>
          <LinearGradient
            colors={["#60A7D2", "#4A90BF"]}
            style={styles.goalGradient}
          >
            <View style={styles.goalContent}>
              <View>
                <Text style={styles.goalLabel}>Daily Goal</Text>
                <Text style={styles.goalAmount}>{dailyGoal} ml</Text>
              </View>
              <View style={styles.goalProgress}>
                <Text style={styles.goalPercentage}>
                  {Math.round((currentHydration / dailyGoal) * 100)}%
                </Text>
                <Text style={styles.goalSubtext}>Completed</Text>
              </View>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.goalProgressBar}>
              <View style={styles.progressBackground} />
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: waterLevel.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]} 
              />
            </View>
          </LinearGradient>
        </View>

        {/* Gota de Água Animada */}
        <View style={styles.waterSection}>
          <WaterDrop 
            waterLevel={waterLevel} 
            currentHydration={currentHydration}
            dailyGoal={dailyGoal}
          />
        </View>

        {/* Water Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Add Water</Text>
          
          {/* Amount Selector */}
          <View style={styles.amountSelector}>
            {waterAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonSelected
                ]}
                onPress={() => calculateWaterLevel(amount)}
              >
                <Text style={[
                  styles.amountButtonText,
                  selectedAmount === amount && styles.amountButtonTextSelected
                ]}>
                  +{amount}ml
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount */}
          <TouchableOpacity style={styles.customButton}>
            <Ionicons name="add-circle-outline" size={20} color="#60A7D2" />
            <Text style={styles.customButtonText}>Custom Amount</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="water-outline" size={24} color="#60A7D2" />
            <Text style={styles.statValue}>{currentHydration}ml</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color="#60A7D2" />
            <Text style={styles.statValue}>
              {Math.round((currentHydration / dailyGoal) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#60A7D2" />
            <Text style={styles.statValue}>
              {Math.ceil((dailyGoal - currentHydration) / 250)}
            </Text>
            <Text style={styles.statLabel}>Cups Left</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={resetHydration}
          >
            <Ionicons name="refresh" size={20} color="#FF6B6B" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.historyButton}
          >
            <Ionicons name="stats-chart" size={20} color="#60A7D2" />
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation */}
        {/* Navigation Menu */}
        <LinearGradient
          colors={['#60A7D2', '#4A90BF']}
          style={styles.navigation}
        >
          <View style={styles.navItems}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate('Tracker')}
            >
              <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Stats</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => navigation.navigate('Map')}
            >
              <Ionicons name="map" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Map</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('Locations')}
            >
              <Ionicons name="location" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Locations</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={styles.navItem} 
              onPress={() => navigation.navigate('Account')}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Account</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  username: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  settingsButton: {
    padding: 8,
  },
  goalCard: {
    marginHorizontal: 24,
    marginTop: -40,
    borderRadius: 20,
    shadowColor: "#60A7D2",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  goalGradient: {
    padding: 24,
    borderRadius: 20,
  },
  goalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    opacity: 0.9,
  },
  goalAmount: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  goalProgress: {
    alignItems: "flex-end",
  },
  goalPercentage: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  goalSubtext: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  waterSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  waterDropContainer: {
    width: 180,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dropOutline: {
    width: 180,
    height: 280,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  waterFill: {
    position: "absolute",
    bottom: 0,
    width: "80%",
    backgroundColor: "rgba(96, 167, 210, 0.6)",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  waterDropSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  waterLevelIndicator: {
    position: "absolute",
    alignItems: "center",
    top: "50%",
  },
  waterLevelText: {
    color: "#2C3E50",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  waterLevelSubtext: {
    color: "#60A7D2",
    fontSize: 16,
    fontWeight: "600",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 50,
  },
  bubble1: {
    width: 8,
    height: 8,
    left: 60,
    bottom: 60,
  },
  bubble2: {
    width: 6,
    height: 6,
    left: 100,
    bottom: 40,
  },
  bubble3: {
    width: 4,
    height: 4,
    left: 80,
    bottom: 80,
  },
  selectionSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  selectionTitle: {
    color: "#2C3E50",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  amountSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  amountButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E3F2FD",
    minWidth: 80,
    alignItems: "center",
  },
  amountButtonSelected: {
    backgroundColor: "#60A7D2",
    borderColor: "#60A7D2",
  },
  amountButtonText: {
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "600",
  },
  amountButtonTextSelected: {
    color: "#FFFFFF",
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#60A7D2",
    gap: 8,
  },
  customButtonText: {
    color: "#60A7D2",
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 8,
  },
  statLabel: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 30,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    gap: 8,
  },
  resetButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  historyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#60A7D2",
    gap: 8,
  },
  historyButtonText: {
    color: "#60A7D2",
    fontSize: 16,
    fontWeight: "600",
  },
  navigation: {
    marginHorizontal: 15,
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: "#60A7D2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  navItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  navItemCenter: {
    marginTop: -30,
  },
  centerNavButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});

export default HydrationTracker;