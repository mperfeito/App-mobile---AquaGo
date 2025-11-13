import React from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

export default () => {
  const handleContinue = () => {
    alert("Continue to next screen!");
  };

  const handleSkip = () => {
    alert("Skip onboarding!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={styles.progressDot} />
          </View>
          
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
            <Image
              source={{ uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2445ec06-d042-4f83-b3b7-e3ffdd5440a0" }}
              resizeMode="contain"
              style={styles.arrowImage}
            />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/75ef1f54-791b-4123-b124-2ad2d057cef7" }}
            resizeMode="contain"
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>AquaGo</Text>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Main Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d4edd79c-5130-40c9-b41f-ef9775790ef2" }}
              resizeMode="cover"
              style={styles.mainImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(96, 167, 210, 0.1)']}
              style={styles.imageOverlay}
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Recycle Plastic, Earn Rewards</Text>
            <Text style={styles.description}>
              Bring your used plastic bottles to our partner collection points and exchange them for eco-friendly reusable bottles or exclusive items
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#60A7D2', '#4A90BF']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E3F2FD",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#60A7D2",
    width: 24,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  skipText: {
    color: "#7F8C8D",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  arrowImage: {
    width: 6,
    height: 12,
    tintColor: "#7F8C8D",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  logoImage: {
    width: 32,
    height: 45,
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "400",
    color: "#60A7D2",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    width: width - 48,
    height: 280,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 40,
    shadowColor: "#60A7D2",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },
  button: {
    width: "100%",
    borderRadius: 16,
    shadowColor: "#60A7D2",
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
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});