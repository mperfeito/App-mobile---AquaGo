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

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    alert(`Login successful!\nEmail: ${email}`);
  };

  const handleGoogleLogin = () => {
    alert("Google login pressed!");
  };

  const handleCreateAccount = () => {
    alert("Navigate to sign up screen");
  };

  const handleForgotPassword = () => {
    alert("Forgot password pressed!");
  };

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
                uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e2daa059-c980-4969-8899-73c365afddfb",
              }}
              style={styles.logo}
            />
            <Text style={styles.logoText}>AquaGo</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome to AquaGo</Text>
          <Text style={styles.welcomeSubtitle}>Access your account to continue</Text>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, isLoginActive && styles.activeTab]}
            onPress={() => setIsLoginActive(true)}
          >
            <Text style={[styles.tabText, isLoginActive && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, !isLoginActive && styles.activeTab]}
            onPress={() => setIsLoginActive(false)}
          >
            <Text style={[styles.tabText, !isLoginActive && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabIndicator}>
          <View style={[styles.indicator, isLoginActive ? styles.indicatorLeft : styles.indicatorRight]} />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
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

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password}
          >
            <LinearGradient
              colors={['#60A7D2', '#4A90BF']}
              style={styles.gradientButton}
            >
              <Text style={styles.loginButtonText}>
                {isLoginActive ? 'Login' : 'Sign Up'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Login */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <Image
              source={{
                uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/95acd31d-e2ae-4666-b680-b0aadc7162a4",
              }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Login With Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Not a member?{" "}
            <Text style={styles.footerLink} onPress={handleCreateAccount}>
              Create an account
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
    paddingBottom: 50,
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
    paddingHorizontal: 40,
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#60A7D2",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ECF0F1",
  },
  dividerText: {
    color: "#95A5A6",
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E3F2FD",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    borderRadius: 10,
  },
  googleButtonText: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
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