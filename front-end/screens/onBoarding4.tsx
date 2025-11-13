import React, { useState } from "react";
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get('window');

type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'veryActive';
type ClimateType = 'cold' | 'temperate' | 'hot' | 'veryHot';
type Gender = 'male' | 'female';

export default () => {
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [climateType, setClimateType] = useState<ClimateType>('temperate');
  const [customGoal, setCustomGoal] = useState(0);
  
  // Calcular meta diária baseada nos inputs
  const calculateDailyGoal = () => {
    if (customGoal > 0) return customGoal;
    
    let baseWater = 0;
    
    // Base por peso (30-40ml por kg)
    baseWater = weight * 35;
    
    // Ajuste por idade
    if (age < 18) baseWater *= 0.9;
    else if (age > 65) baseWater *= 0.85;
    
    // Ajuste por gênero
    if (gender === 'female') baseWater *= 0.9;
    
    // Ajuste por nível de atividade
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.0,
      moderate: 1.2,
      active: 1.4,
      veryActive: 1.6
    };
    baseWater *= activityMultipliers[activityLevel];
    
    // Ajuste por clima
    const climateMultipliers: Record<ClimateType, number> = {
      cold: 0.9,
      temperate: 1.0,
      hot: 1.2,
      veryHot: 1.4
    };
    baseWater *= climateMultipliers[climateType];
    
    return Math.round(baseWater / 50) * 50; // Arredondar para múltiplos de 50
  };

  const dailyGoal = calculateDailyGoal();

  const handleContinue = () => {
    alert(`Daily water goal set to: ${dailyGoal} ml`);
  };

  // Funções para ajustar valores
  const adjustWeight = (increment: boolean) => {
    setWeight(prev => {
      const newWeight = increment ? prev + 5 : prev - 5;
      return Math.max(40, Math.min(150, newWeight)); // Limite entre 40-150kg
    });
    setCustomGoal(0); // Reset custom goal quando ajustar outros parâmetros
  };

  const adjustAge = (increment: boolean) => {
    setAge(prev => {
      const newAge = increment ? prev + 5 : prev - 5;
      return Math.max(10, Math.min(100, newAge)); // Limite entre 10-100 anos
    });
    setCustomGoal(0);
  };

  const adjustCustomGoal = (increment: boolean) => {
    setCustomGoal(prev => {
      const change = increment ? 100 : -100;
      const newGoal = prev === 0 ? (increment ? 2000 : 0) : prev + change;
      return Math.max(0, Math.min(10000, newGoal)); // Limite entre 0-10000ml
    });
  };

  const cycleActivityLevel = () => {
    const levels: ActivityLevel[] = ['sedentary', 'moderate', 'active', 'veryActive'];
    const currentIndex = levels.indexOf(activityLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setActivityLevel(levels[nextIndex]);
    setCustomGoal(0);
  };

  const cycleClimateType = () => {
    const climates: ClimateType[] = ['cold', 'temperate', 'hot', 'veryHot'];
    const currentIndex = climates.indexOf(climateType);
    const nextIndex = (currentIndex + 1) % climates.length;
    setClimateType(climates[nextIndex]);
    setCustomGoal(0);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#60A7D2', '#4A90BF', '#357ABD']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Daily Water Goal Display */}
          <View style={styles.goalSection}>
            <Text style={styles.goalTitle}>Daily Water Goal</Text>
            <Text style={styles.goalAmount}>{dailyGoal} ml</Text>
            <Text style={styles.goalSubtitle}>
              {customGoal > 0 ? 'Custom goal set' : 'Personalized based on your profile'}
            </Text>
          </View>

          {/* Input Sections */}
          <View style={styles.inputsContainer}>
            {/* Weight */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons name="barbell-outline" size={24} color="#60A7D2" style={styles.inputIcon} />
                <Text style={styles.inputTitle}>Weight</Text>
              </View>
              <View style={styles.inputControls}>
                <TouchableOpacity onPress={() => adjustWeight(false)} style={styles.controlButton}>
                  <Ionicons name="remove-circle-outline" size={28} color="#60A7D2" />
                </TouchableOpacity>
                <Text style={styles.inputValue}>{weight} kg</Text>
                <TouchableOpacity onPress={() => adjustWeight(true)} style={styles.controlButton}>
                  <Ionicons name="add-circle-outline" size={28} color="#60A7D2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons name="calendar-outline" size={24} color="#60A7D2" style={styles.inputIcon} />
                <Text style={styles.inputTitle}>Age</Text>
              </View>
              <View style={styles.inputControls}>
                <TouchableOpacity onPress={() => adjustAge(false)} style={styles.controlButton}>
                  <Ionicons name="remove-circle-outline" size={28} color="#60A7D2" />
                </TouchableOpacity>
                <Text style={styles.inputValue}>{age} years</Text>
                <TouchableOpacity onPress={() => adjustAge(true)} style={styles.controlButton}>
                  <Ionicons name="add-circle-outline" size={28} color="#60A7D2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons name="person-outline" size={24} color="#60A7D2" style={styles.inputIcon} />
                <Text style={styles.inputTitle}>Gender</Text>
              </View>
              <View style={styles.inputControls}>
                <TouchableOpacity 
                  onPress={() => {
                    setGender('male');
                    setCustomGoal(0);
                  }} 
                  style={styles.controlButton}
                >
                  <Ionicons 
                    name="male" 
                    size={28} 
                    color={gender === 'male' ? "#60A7D2" : "#BDC3C7"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setGender('female');
                    setCustomGoal(0);
                  }} 
                  style={styles.controlButton}
                >
                  <Ionicons 
                    name="female" 
                    size={28} 
                    color={gender === 'female' ? "#60A7D2" : "#BDC3C7"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons name="walk-outline" size={24} color="#60A7D2" style={styles.inputIcon} />
                <Text style={styles.inputTitle}>Activity Level</Text>
              </View>
              <TouchableOpacity onPress={cycleActivityLevel} style={styles.inputControls}>
                <Text style={styles.inputValue}>
                  {activityLevel === 'sedentary' ? 'Sedentary' :
                   activityLevel === 'moderate' ? 'Moderate' :
                   activityLevel === 'active' ? 'Active' : 'Very Active'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#60A7D2" />
              </TouchableOpacity>
            </View>

            {/* Climate Type */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons name="partly-sunny-outline" size={24} color="#60A7D2" style={styles.inputIcon} />
                <Text style={styles.inputTitle}>Climate Type</Text>
              </View>
              <TouchableOpacity onPress={cycleClimateType} style={styles.inputControls}>
                <Text style={styles.inputValue}>
                  {climateType === 'cold' ? 'Cold' :
                   climateType === 'temperate' ? 'Temperate' :
                   climateType === 'hot' ? 'Hot' : 'Very Hot'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#60A7D2" />
              </TouchableOpacity>
            </View>

            {/* Custom Goal */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <Ionicons name="water-outline" size={24} color="#60A7D2" style={styles.inputIcon} />
                <Text style={styles.inputTitle}>Custom Goal</Text>
              </View>
              <View style={styles.inputControls}>
                <TouchableOpacity onPress={() => adjustCustomGoal(false)} style={styles.controlButton}>
                  <Ionicons name="remove-circle-outline" size={28} color="#60A7D2" />
                </TouchableOpacity>
                <Text style={styles.inputValue}>
                  {customGoal > 0 ? `${customGoal} ml` : 'Auto'}
                </Text>
                <TouchableOpacity onPress={() => adjustCustomGoal(true)} style={styles.controlButton}>
                  <Ionicons name="add-circle-outline" size={28} color="#60A7D2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FBFF']}
              style={styles.gradientButton}
            >
              <Text style={styles.continueButtonText}>Continue with {dailyGoal} ml</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  goalSection: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
  },
  goalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  goalAmount: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 8,
  },
  goalSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  inputsContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  inputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputTitle: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "600",
  },
  inputControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  inputValue: {
    color: "#60A7D2",
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 12,
    textAlign: "center",
    minWidth: 10,
  },
  controlButton: {
    padding: 4,
  },
  continueButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#60A7D2",
    fontSize: 16,
    fontWeight: "600",
  },
});