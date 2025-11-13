import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker, Region } from "react-native-maps";

const { width, height } = Dimensions.get('window');

// Tipos TypeScript
type WaterPointType = 'fountain' | 'refill_station' | 'public_building' | 'transport' | 'sports';

interface WaterPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: WaterPointType;
  rating: number;
  distance: string;
}

// Dados mock para pontos de água
const waterPoints: WaterPoint[] = [
  {
    id: 1,
    name: "Central Park Fountain",
    latitude: 40.7829,
    longitude: -73.9654,
    type: "fountain",
    rating: 4.5,
    distance: "0.2 km"
  },
  {
    id: 2,
    name: "City Mall Refill",
    latitude: 40.7589,
    longitude: -73.9851,
    type: "refill_station",
    rating: 4.2,
    distance: "0.5 km"
  },
  {
    id: 3,
    name: "Public Library",
    latitude: 40.7536,
    longitude: -73.9822,
    type: "public_building",
    rating: 4.7,
    distance: "0.8 km"
  },
  {
    id: 4,
    name: "Train Station",
    latitude: 40.7505,
    longitude: -73.9934,
    type: "transport",
    rating: 4.0,
    distance: "1.2 km"
  },
  {
    id: 5,
    name: "Sports Center",
    latitude: 40.7685,
    longitude: -73.9818,
    type: "sports",
    rating: 4.3,
    distance: "1.5 km"
  }
];

export default () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<WaterPoint | null>(null);

  const filteredLocations = waterPoints.filter(point =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPinColor = (type: WaterPointType): string => {
    const colors: Record<WaterPointType, string> = {
      fountain: "#60A7D2",
      refill_station: "#4A90BF",
      public_building: "#357ABD",
      transport: "#2C3E50",
      sports: "#27AE60"
    };
    return colors[type];
  };

  const getPinIcon = (type: WaterPointType): string => {
    const icons: Record<WaterPointType, string> = {
      fountain: "water",
      refill_station: "refresh",
      public_building: "business",
      transport: "train",
      sports: "fitness"
    };
    return icons[type];
  };

  const initialRegion: Region = {
    latitude: 40.7829,
    longitude: -73.9654,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
  

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#7F8C8D" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for water points..."
            placeholderTextColor="#95A5A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#7F8C8D" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          {filteredLocations.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              onPress={() => setSelectedLocation(point)}
            >
              <View style={[styles.marker, { backgroundColor: getPinColor(point.type) }]}>
                <Ionicons name={getPinIcon(point.type) as any} size={16} color="#FFFFFF" />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Selected Location Card */}
        {selectedLocation && (
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={[styles.locationIcon, { backgroundColor: getPinColor(selectedLocation.type) }]}>
                <Ionicons name={getPinIcon(selectedLocation.type) as any} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{selectedLocation.name}</Text>
                <Text style={styles.locationDetails}>
                  {selectedLocation.distance} • ⭐ {selectedLocation.rating}
                </Text>
              </View>
              <TouchableOpacity style={styles.directionsButton}>
                <Ionicons name="navigate" size={20} color="#60A7D2" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
              <Text style={[styles.filterText, styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="water" size={16} color="#7F8C8D" />
              <Text style={styles.filterText}>Fountains</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="refresh" size={16} color="#7F8C8D" />
              <Text style={styles.filterText}>Refill Stations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="business" size={16} color="#7F8C8D" />
              <Text style={styles.filterText}>Public Buildings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="train" size={16} color="#7F8C8D" />
              <Text style={styles.filterText}>Transport</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

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
                   <Text style={styles.navText}>Account</Text>
                 </TouchableOpacity>
               </View>
             </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  
  searchContainer: {
	marginTop:40,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#2C3E50",
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  locationCard: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationDetails: {
    color: "#7F8C8D",
    fontSize: 14,
  },
  directionsButton: {
    padding: 8,
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
  },
  filterContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: "#60A7D2",
  },
  filterText: {
    color: "#7F8C8D",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  filterTextActive: {
    color: "#FFFFFF",
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