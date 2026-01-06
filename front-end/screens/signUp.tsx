import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import {Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }: any ) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUpActive, setIsSignUpActive] = useState(true);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const payload = {
      name: name,
      email: email,
      password: password
    }
    try{
      const res = await axios.post('http://10.0.2.2:3001/user/register', payload);
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.setItem("authToken", res.data.token);
      console.log(res.data.token);
      Alert.alert(
        "Success",
        "Account created successfully!",
        [
        {
            text: "OK",
            onPress: () => navigation.navigate("Map")
        },
        ]
      );
    }
    catch(err){
      console.log("REGISTER ERROR: ", err);
    };
  };

  const handleLoginRedirect = () => {
    alert("Navigate to login screen");
    navigation.navigate("Map");
  };

  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", met: password.length >= 8 },
    { id: 2, text: "At least 1 number", met: /\d/.test(password) },
    { id: 3, text: "Both upper and lower case letters", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6acb921b-70f7-46b2-a3fc-b728aaab6a09",
              }}
              style={styles.logo}
            />
            <Text style={styles.logoText}>AquaGo</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome to AquaGo</Text>
          <Text style={styles.welcomeSubtitle}>Become a member</Text>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, !isSignUpActive && styles.activeTab]}
          onPress={() => navigation.navigate('Login')} // ← Muda aqui
        >
          <Text style={[styles.tabText, !isSignUpActive && styles.activeTabText]}>
            Login
          </Text>
        </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, isSignUpActive && styles.activeTab]}
            onPress={() => setIsSignUpActive(true)}
          >
            <Text style={[styles.tabText, isSignUpActive && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabIndicator}>
          <View style={[styles.indicator, isSignUpActive ? styles.indicatorRight : styles.indicatorLeft]} />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#9E9E9E"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={setPassword}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#60A7D2"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#60A7D2" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor="#9E9E9E"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.passwordInput}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#60A7D2"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            {passwordRequirements.map((requirement) => (
              <View key={requirement.id} style={styles.requirementRow}>
                <Ionicons
                  name={requirement.met ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={requirement.met ? "#27AE60" : "#95A5A6"}
                  style={styles.requirementIcon}
                />
                <Text style={[
                  styles.requirementText,
                  requirement.met && styles.requirementMet
                ]}>
                  {requirement.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[
              styles.signUpButton, 
              (!name || !email || !password || !confirmPassword) && styles.signUpButtonDisabled
            ]}
            onPress={handleSignUp}
            disabled={!name || !email || !password || !confirmPassword}
          >
            <LinearGradient
              colors={['#60A7D2', '#4A90BF']}
              style={styles.gradientButton}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerLink} onPress={handleLoginRedirect}>
              Log in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 32,
    height: 45,
    marginRight: 12,
  },
  logoText: {
    color: "#60A7D2",
    fontSize: 28,
    fontWeight: "400",
  },
  welcomeTitle: {
    color: "#2C3E50",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: "#7F8C8D",
    fontSize: 16,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    // Background handled by indicator
  },
  tabText: {
    color: "#95A5A6",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#60A7D2",
    fontWeight: "600",
  },
  tabIndicator: {
    height: 3,
    marginHorizontal: 30,
    marginBottom: 30,
    backgroundColor: "#ECF0F1",
    borderRadius: 2,
  },
  indicator: {
    height: "100%",
    width: "50%",
    backgroundColor: "#60A7D2",
    borderRadius: 2,
  },
  indicatorLeft: {
    alignSelf: "flex-start",
  },
  indicatorRight: {
    alignSelf: "flex-end",
  },
  formContainer: {
    marginHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
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
    paddingVertical: 16,
  },
  passwordInput: {
    flex: 1,
    color: "#2C3E50",
    fontSize: 16,
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  requirementsContainer: {
    backgroundColor: "#F8FBFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  requirementsTitle: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    color: "#7F8C8D",
    fontSize: 14,
  },
  requirementMet: {
    color: "#27AE60",
    fontWeight: "500",
  },
  signUpButton: {
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#60A7D2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  footerText: {
    color: "#7F8C8D",
    fontSize: 16,
    textAlign: "center",
  },
  footerLink: {
    color: "#60A7D2",
    fontWeight: "600",
  },
});