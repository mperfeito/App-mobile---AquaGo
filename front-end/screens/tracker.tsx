import React, { useState, useEffect } from "react";
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LineChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 200;

// Define your navigation stack types (same as in map.tsx)
type RootStackParamList = {
  Splash: undefined;
  OnBoarding1: undefined;
  OnBoarding2: undefined;
  OnBoarding3: undefined;
  OnBoarding4: undefined;
  Login: undefined;
  SignUp: undefined;
  Account: undefined;
  Comments: undefined;
  BottomSheet: undefined;
  Locations: undefined;
  Map: undefined;
  Profile: undefined;
  Tracker: undefined;
};

type userDataObj = {
  amount_intake: number;
  daily_water: number; 
}

// Create navigation prop type
type TrackerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;


// Definir tipos para as props
interface AnimatedStatCardProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
}

// Componente de card animado (igual ao dos transportes)
const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ 
  children, 
  onPress, 
  style 
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const [opacityValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.statCardWrapper}
    >
      <Animated.View
        style={[
          styles.statCard,
          style,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const StatsScreen: React.FC = () => {
  const navigation = useNavigation<TrackerScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userData, setUserData] = useState<userDataObj>({
    amount_intake: 2300,
    daily_water: 2500
  });
  const progressPercentage = Math.round(userData.amount_intake / userData.daily_water * 100);

useEffect(() => {
    const loadInfo = async () => {
      const token = await AsyncStorage.getItem("authToken");
      await axios.get('http://10.0.2.2:3001/user/logged',{
        headers: {
          Authorization: `Bearer ${token}`,
        }}
      )
      .then(res => {
        const {amount_intake, daily_water} = res.data.data
        setUserData((prev) => ({
          ...prev,
          amount_intake: amount_intake,
          daily_water: daily_water
        }))
      })
    }
    loadInfo();
  }, []);

  // Dados mock para gráficos
  const dailyData = {
    labels: ["6h", "8h", "10h", "12h", "14h", "16h", "18h"],
    datasets: [{
      data: [200, 300, 250, 400, 350, 500, 300],
    }]
  };

  const weeklyData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    datasets: [{
      data: [1800, 2200, 1900, 2500, 2300, 2000],
    }]
  };

  const monthlyData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    datasets: [{
      data: [8200, 9500, 8800, 9200],
    }]
  };

  const hourlyConsumption = [
    { time: "06:00", amount: 200, percentage: 8 },
    { time: "08:00", amount: 300, percentage: 12 },
    { time: "10:00", amount: 250, percentage: 10 },
    { time: "12:00", amount: 400, percentage: 16 },
    { time: "14:00", amount: 350, percentage: 14 },
    { time: "16:00", amount: 500, percentage: 20 },
    { time: "18:00", amount: 300, percentage: 12 },
  ];

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(96, 167, 210, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#60A7D2"
    },
    propsForLabels: {
      fontSize: 10,
    },
    barPercentage: 0.5,
  };

  const renderDailyChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Consumo Horário - Hoje</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={dailyData}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          withHorizontalLines={false}
          withInnerLines={false}
          segments={5}
        />
      </View>
    </View>
  );

  const renderWeeklyChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Consumo Semanal</Text>
      <View style={styles.chartWrapper}>
        <BarChart
          data={weeklyData}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          withCustomBarColorFromData={true}
          flatColor={true}
          fromZero
        />
      </View>
    </View>
  );

  const renderMonthlyChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Consumo Mensal</Text>
      <View style={styles.chartWrapper}>
        <BarChart
          data={monthlyData}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          withCustomBarColorFromData={true}
          flatColor={true}
          fromZero
        />
      </View>
    </View>
  );

  const renderHourlyBreakdown = () => (
    <View style={styles.hourlyContainer}>
      <Text style={styles.sectionTitle}>Detalhe por Hora</Text>
      {hourlyConsumption.map((hour, index) => (
        <View key={index} style={styles.hourlyItem}>
          <Text style={styles.hourTime}>{hour.time}</Text>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${hour.percentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.hourAmount}>{hour.amount} ml</Text>
        </View>
      ))}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <AnimatedStatCard 
        onPress={() => console.log('Consumo hoje pressed')}
      >
        <View style={styles.statContent}>
          <LinearGradient
            colors={['#60A7D2', '#4A90BF']}
            style={styles.statIconContainer}
          >
            <Ionicons name="water-outline" size={20} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.statValue}>{userData.amount_intake}</Text>
          <Text style={styles.statLabel}>Consumo Hoje</Text>
        </View>
      </AnimatedStatCard>

      <AnimatedStatCard 
        onPress={() => console.log('Trend pressed')}
      >
        <View style={styles.statContent}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="trending-up" size={20} color="#27AE60" />
          </View>
          <Text style={[styles.statValue, styles.positiveValue]}>+12%</Text>
          <Text style={styles.statLabel}>vs. Ontem</Text>
        </View>
      </AnimatedStatCard>

      <AnimatedStatCard 
        onPress={() => console.log('Meta pressed')}
      >
        <View style={styles.statContent}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF9E6' }]}>
            <Ionicons name="trophy-outline" size={20} color="#FFD700" />
          </View>
          <Text style={styles.statValue}>5/7</Text>
          <Text style={styles.statLabel}>Dias Meta</Text>
        </View>
      </AnimatedStatCard>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={['#60A7D2', '#4A90BF']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Hidratação</Text>
              <Text style={styles.headerSubtitle}>Acompanhe seu consumo de água</Text>
            </View>
            <TouchableOpacity style={styles.calendarButton}>
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
            onPress={() => setActiveTab('daily')}
          >
            <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
              Diário
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
              Semanal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
              Mensal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards - Agora com o mesmo estilo dos transportes */}
        {renderStats()}

        {/* Chart Section */}
        <View style={styles.chartSection}>
          {activeTab === 'daily' && renderDailyChart()}
          {activeTab === 'weekly' && renderWeeklyChart()}
          {activeTab === 'monthly' && renderMonthlyChart()}

          {/* Hourly Breakdown (only for daily view) */}
          {activeTab === 'daily' && renderHourlyBreakdown()}
        </View>

        {/* Goals Section */}
        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Suas Metas</Text>
          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Meta Diária</Text>
              <Text style={styles.goalValue}>{userData.daily_water}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.goalPercentage}>{progressPercentage}%</Text>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>Consistência Semanal</Text>
              <Text style={styles.goalValue}>5/7 dias</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: '71%' }]} />
            </View>
            <Text style={styles.goalPercentage}>71%</Text>
          </View>
        </View>

        {/* Navigation Menu - Updated with proper navigation */}
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
    </View>
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 24,
   
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "500",
  },
  calendarButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: "#F8FBFF",
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#60A7D2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#60A7D2",
  },
  // Novos estilos para os stats cards (iguais aos de transporte)
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
    justifyContent: "space-between",
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    borderRadius: 16,
    minHeight: 100,
    justifyContent: "center",
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  positiveValue: {
    color: "#27AE60",
  },
  statLabel: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  chartSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E3F2FD",
    alignItems: "center",
  },
  chartWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
  },
  chartTitle: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  hourlyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  sectionTitle: {
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  hourlyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  hourTime: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "600",
    width: 50,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#60A7D2",
    borderRadius: 4,
  },
  hourAmount: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "600",
    width: 60,
    textAlign: "right",
  },
  goalsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E3F2FD",
    gap: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  goalValue: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
  },
  goalPercentage: {
    color: "#60A7D2",
    fontSize: 14,
    fontWeight: "700",
    width: 40,
    textAlign: "right",
  },
  navigation: {
    marginHorizontal: 15,
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  navItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
});

export default StatsScreen;