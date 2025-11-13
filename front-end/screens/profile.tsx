import React, { useState } from "react";
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  Switch,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

// Definir tipos TypeScript
type UserData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dailyWaterGoal: number;
  weight: number;
  activityLevel: string;
  climateType: string;
  notifications: boolean;
 
};

type ActivityLevel = "sedentary" | "moderate" | "active" | "veryActive";
type ClimateType = "cold" | "temperate" | "hot" | "veryHot";

export default () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phoneNumber: "+1 234 567 8900",
    dailyWaterGoal: 2500,
    weight: 70,
    activityLevel: "moderate",
    climateType: "temperate",
    notifications: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState("");

  const activityLevels: { value: ActivityLevel; label: string; icon: string }[] = [
    { value: "sedentary", label: "Sedentary", icon: "desktop-outline" },
    { value: "moderate", label: "Moderate", icon: "walk-outline" },
    { value: "active", label: "Active", icon: "bicycle-outline" },
    { value: "veryActive", label: "Very Active", icon: "fitness-outline" }
  ];

  const climateTypes: { value: ClimateType; label: string; icon: string }[] = [
    { value: "cold", label: "Cold", icon: "snow-outline" },
    { value: "temperate", label: "Temperate", icon: "partly-sunny-outline" },
    { value: "hot", label: "Hot", icon: "sunny-outline" },
    { value: "veryHot", label: "Very Hot", icon: "flame-outline" }
  ];

  const handleSave = () => {
    if (isEditing) {
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleValueChange = (field: keyof UserData, value: string | number | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adjustWaterGoal = (increment: boolean) => {
    const newValue = userData.dailyWaterGoal + (increment ? 100 : -100);
    if (newValue >= 500 && newValue <= 10000) {
      handleValueChange('dailyWaterGoal', newValue);
    }
  };

  const adjustWeight = (increment: boolean) => {
    const newValue = userData.weight + (increment ? 1 : -1);
    if (newValue >= 30 && newValue <= 200) {
      handleValueChange('weight', newValue);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#60A7D2', '#4A90BF']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5747d283-5cd8-4eef-ab39-c0088e4590dd" }}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editPhotoButton}>
                  <Ionicons name="camera" size={16} color="#60A7D2" />
                </TouchableOpacity>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userData.fullName}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleSave}
            >
              <LinearGradient
                colors={isEditing ? ['#27AE60', '#219955'] : ['#FFFFFF', '#F8FBFF']}
                style={styles.editGradient}
              >
                <Ionicons 
                  name={isEditing ? "checkmark" : "pencil"} 
                  size={16} 
                  color={isEditing ? "#FFFFFF" : "#60A7D2"} 
                />
                <Text style={[
                  styles.editButtonText,
                  isEditing && styles.editButtonTextActive
                ]}>
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userData.fullName}
                onChangeText={(value: string) => handleValueChange('fullName', value)}
                editable={isEditing}
                placeholder="Enter your full name"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userData.email}
                onChangeText={(value: string) => handleValueChange('email', value)}
                editable={isEditing}
                keyboardType="email-address"
                placeholder="Enter your email"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userData.phoneNumber}
                onChangeText={(value: string) => handleValueChange('phoneNumber', value)}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                />
              </View>
            </View>
          )}
        </View>

        {/* Hydration Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hydration Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Ionicons name="water-outline" size={24} color="#60A7D2" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Water Goal</Text>
                <Text style={styles.settingDescription}>Recommended: 2,500 ml</Text>
              </View>
            </View>
            <View style={styles.valueControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => adjustWaterGoal(false)}
                disabled={!isEditing}
              >
                <Ionicons name="remove" size={20} color={isEditing ? "#60A7D2" : "#CCCCCC"} />
              </TouchableOpacity>
              <Text style={styles.valueText}>{userData.dailyWaterGoal} ml</Text>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => adjustWaterGoal(true)}
                disabled={!isEditing}
              >
                <Ionicons name="add" size={20} color={isEditing ? "#60A7D2" : "#CCCCCC"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Ionicons name="barbell-outline" size={24} color="#60A7D2" />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Weight</Text>
                <Text style={styles.settingDescription}>Affects water needs</Text>
              </View>
            </View>
            <View style={styles.valueControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => adjustWeight(false)}
                disabled={!isEditing}
              >
                <Ionicons name="remove" size={20} color={isEditing ? "#60A7D2" : "#CCCCCC"} />
              </TouchableOpacity>
              <Text style={styles.valueText}>{userData.weight} kg</Text>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => adjustWeight(true)}
                disabled={!isEditing}
              >
                <Ionicons name="add" size={20} color={isEditing ? "#60A7D2" : "#CCCCCC"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Activity & Climate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity & Environment</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Ionicons name="walk-outline" size={24} color="#60A7D2" />
              <Text style={styles.settingTitle}>Activity Level</Text>
            </View>
            <View style={styles.optionsGrid}>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionButton,
                    userData.activityLevel === level.value && styles.optionButtonActive
                  ]}
                  onPress={() => isEditing && handleValueChange('activityLevel', level.value)}
                  disabled={!isEditing}
                >
                  <Ionicons 
                    name={level.icon as any} 
                    size={16} 
                    color={userData.activityLevel === level.value ? "#FFFFFF" : "#60A7D2"} 
                  />
                  <Text style={[
                    styles.optionText,
                    userData.activityLevel === level.value && styles.optionTextActive
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Ionicons name="partly-sunny-outline" size={24} color="#60A7D2" />
              <Text style={styles.settingTitle}>Climate Type</Text>
            </View>
            <View style={styles.optionsGrid}>
              {climateTypes.map((climate) => (
                <TouchableOpacity
                  key={climate.value}
                  style={[
                    styles.optionButton,
                    userData.climateType === climate.value && styles.optionButtonActive
                  ]}
                  onPress={() => isEditing && handleValueChange('climateType', climate.value)}
                  disabled={!isEditing}
                >
                  <Ionicons 
                    name={climate.icon as any} 
                    size={16} 
                    color={userData.climateType === climate.value ? "#FFFFFF" : "#60A7D2"} 
                  />
                  <Text style={[
                    styles.optionText,
                    userData.climateType === climate.value && styles.optionTextActive
                  ]}>
                    {climate.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={20} color="#60A7D2" />
                <Text style={styles.settingTitle}>Push Notifications</Text>
              </View>
              <Switch
                value={userData.notifications}
                onValueChange={(value: boolean) => handleValueChange('notifications', value)}
                trackColor={{ false: "#E3F2FD", true: "#60A7D2" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

        
        </View>

        {/* Danger Zone */}
        {isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.dangerButton}>
              <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
              <Text style={styles.dangerButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Navigation Menu */}
        <LinearGradient
          colors={['#60A7D2', '#4A90BF']}
          style={styles.navigation}
        >
          <View style={styles.navItems}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="map" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="location" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Locations</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
              <Text style={styles.navText}>Profile</Text>
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
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  editButton: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: "#60A7D2",
    fontSize: 14,
    fontWeight: "600",
  },
  editButtonTextActive: {
    color: "#FFFFFF",
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sectionTitle: {
    color: "#2C3E50",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3F2FD",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#2C3E50",
    fontSize: 16,
    paddingVertical: 14,
  },
  inputDisabled: {
    color: "#7F8C8D",
  },
  settingCard: {
    backgroundColor: "#F8FBFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "600",
  },
  settingDescription: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  valueControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  valueText: {
    color: "#60A7D2",
    fontSize: 18,
    fontWeight: "700",
    minWidth: 80,
    textAlign: "center",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    minWidth: 100,
  },
  optionButtonActive: {
    backgroundColor: "#60A7D2",
    borderColor: "#60A7D2",
  },
  optionText: {
    color: "#60A7D2",
    fontSize: 12,
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFE0E0",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  dangerButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
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