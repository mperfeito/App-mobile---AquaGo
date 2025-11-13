import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, Animated, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Animação em sequência
    Animated.sequence([
      // Fade in e scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Manter visível por mais tempo (aumentado de 1500 para 2500ms)
      Animated.delay(2500),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Callback quando a animação terminar
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#60A7D2" 
        barStyle="light-content" 
        translucent={true}
      />
      <LinearGradient
        colors={['#60A7D2', '#4A90BF', '#357ABD']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ],
              },
            ]}
          >
            <Image
              source={{
                uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/1b59814d-af6f-4afe-94f8-1bb24d9fe4cf",
              }}
              resizeMode="contain"
              style={styles.logo}
            />
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>AquaGo</Text>
              <Text style={styles.subtitle}>Stay Hydrated</Text>
            </View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Making hydration simple</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#60A7D2",
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    marginTop: StatusBar.currentHeight, // Compensa a status bar translucent
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
});