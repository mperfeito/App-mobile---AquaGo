import React, { useState } from "react";
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  Animated
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get('window');

// Componente de botão com animação
const AnimatedTransportCard = ({ 
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
      style={styles.transportCardWrapper}
    >
      <Animated.View
        style={[
          styles.transportCard,
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

export default () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);

  const handleTransportPress = (transport) => {
    setSelectedTransport(transport);
    // Aqui você pode adicionar a lógica de navegação
    console.log(`Transport selected: ${transport}`);
  };

  const getTransportStyle = (transport) => {
    if (selectedTransport === transport) {
      return {
        borderColor: "#60A7D2",
        backgroundColor: "#F0F8FF",
        borderWidth: 2,
      };
    }
    return {};
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header com ações */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? "#FF6B6B" : "#2C3E50"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="navigate-outline" size={24} color="#2C3E50" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Conteúdo principal */}
          <View style={styles.mainContent}>
            {/* Título e informações */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Crystal Fountain</Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Public Fountain</Text>
                <View style={styles.statusBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#27AE60" />
                  <Text style={styles.statusText}>Working</Text>
                </View>
              </View>
              
              {/* Rating e Distância */}
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>4.8</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location" size={16} color="#60A7D2" />
                  <Text style={styles.metaText}>0.2 km</Text>
                </View>
              </View>
            </View>

            {/* Transportation Options */}
            <View style={styles.transportSection}>
              <Text style={styles.sectionTitle}>Get Directions</Text>
              <View style={styles.transportGrid}>
                <AnimatedTransportCard 
                  onPress={() => handleTransportPress('walk')}
                >
                  <View style={[
                    styles.transportContent,
                    getTransportStyle('walk')
                  ]}>
                    <Ionicons 
                      name="walk-outline" 
                      size={24} 
                      color={selectedTransport === 'walk' ? "#60A7D2" : "#7F8C8D"} 
                    />
                    <Text style={[
                      styles.transportTime,
                      selectedTransport === 'walk' && styles.transportTimeSelected
                    ]}>6 min</Text>
                    <Text style={[
                      styles.transportLabel,
                      selectedTransport === 'walk' && styles.transportLabelSelected
                    ]}>Walk</Text>
                  </View>
                </AnimatedTransportCard>
                
                <AnimatedTransportCard 
                  onPress={() => handleTransportPress('bike')}
                >
                  <View style={[
                    styles.transportContent,
                    getTransportStyle('bike')
                  ]}>
                    <Ionicons 
                      name="bicycle-outline" 
                      size={24} 
                      color={selectedTransport === 'bike' ? "#60A7D2" : "#7F8C8D"} 
                    />
                    <Text style={[
                      styles.transportTime,
                      selectedTransport === 'bike' && styles.transportTimeSelected
                    ]}>2 min</Text>
                    <Text style={[
                      styles.transportLabel,
                      selectedTransport === 'bike' && styles.transportLabelSelected
                    ]}>Bike</Text>
                  </View>
                </AnimatedTransportCard>
                
                <AnimatedTransportCard 
                  onPress={() => handleTransportPress('drive')}
                >
                  <View style={[
                    styles.transportContent,
                    getTransportStyle('drive')
                  ]}>
                    <Ionicons 
                      name="car-outline" 
                      size={24} 
                      color={selectedTransport === 'drive' ? "#60A7D2" : "#7F8C8D"} 
                    />
                    <Text style={[
                      styles.transportTime,
                      selectedTransport === 'drive' && styles.transportTimeSelected
                    ]}>1 min</Text>
                    <Text style={[
                      styles.transportLabel,
                      selectedTransport === 'drive' && styles.transportLabelSelected
                    ]}>Drive</Text>
                  </View>
                </AnimatedTransportCard>
              </View>
            </View>

            {/* Resto do conteúdo permanece igual */}
            {/* Details Section */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Location Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="location-outline" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Address</Text>
                    <Text style={styles.detailValue}>123 Green Park Avenue</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="time-outline" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Opening Hours</Text>
                    <Text style={styles.detailValue}>Always open</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="water-outline" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Water Type</Text>
                    <Text style={styles.detailValue}>Cold, Potable</Text>
                  </View>
                </View>

              
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={() => alert('View Feedbacks')}
              >
                <View style={styles.feedbackButtonContent}>
                  <Ionicons name="chatbubble-ellipses-outline" size={22} color="#60A7D2" />
                  <Text style={styles.feedbackButtonText}>View Feedbacks</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: height * 0.3,
    minHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F8FBFF",
  },
  mainContent: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    color: "#2C3E50",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  subtitle: {
    color: "#7F8C8D",
    fontSize: 18,
    fontWeight: "500",
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#27AE60",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  metaInfo: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "500",
  },
  transportSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  transportGrid: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  transportCardWrapper: {
    flex: 1,
  },
  transportCard: {
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
  transportContent: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    borderRadius: 16,
    minHeight: 90,
    justifyContent: "center",
  },
  transportTime: {
    color: "#7F8C8D",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 2,
  },
  transportTimeSelected: {
    color: "#2C3E50",
    fontWeight: "700",
  },
  transportLabel: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
  },
  transportLabelSelected: {
    color: "#60A7D2",
    fontWeight: "600",
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsGrid: {
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#60A7D2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: {
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "500",
  },
  actionSection: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#60A7D2",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  feedbackButtonText: {
    color: "#60A7D2",
    fontSize: 16,
    fontWeight: "600",
  },
});