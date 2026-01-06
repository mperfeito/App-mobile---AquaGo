import React, { useState, useEffect } from "react";
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  TextInput,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, { Marker, Region } from "react-native-maps";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

type SavedLocation = {
  id: string;
  name: string;
  type: 'fountain' | 'refill_station' | 'public_building' | 'transport' | 'sports';
  address: string;
  distance: string;
  rating: number;
  isFavorite: boolean;
  coordinates: {
    lat: number,
    lng: number
  },
  schedule: {
    opening_hour: number,
    closing_hour: number
  }
  lastVisited?: string;
};

export default () => {
  const navigation = useNavigation(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(null);
  const [locations, setLocations] = useState<SavedLocation[]>([]);

  useEffect( () => {
    try{
      let getAllTheLocations = async () => {
        const res = await axios.get('http://10.0.2.2:3001/waterPoint');
        let mappedLocations: SavedLocation[] = res.data.data.map((item: any) => ({
        id: item.id || item._id,
        name: item.name,
        type: item.type ?? 'fountain',
        address: item.address,
        distance: item.distance ?? '5 km',
        rating: item.rating ?? 3.5,
        isFavorite: item.isFavorite ?? false,
        coordinates: {
          lat: item.coordinates.lat,
          lng: item.coordinates.lng,
        },
        schedule: {
          opening_hour: item.schedule.opening_hour,
          closing_hour: item.schedule.closing_hour,
        },
        lastVisited: item.lastVisited
      }));
      setLocations(mappedLocations);
      console.log(locations)
      }
      getAllTheLocations()
    } catch(err){
      console.error(err);
    }
  }, []);

  const filters = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'favorite', label: 'Favorites', icon: 'heart' },
    { key: 'fountain', label: 'Fountains', icon: 'water' },
    { key: 'refill_station', label: 'Refill Stations', icon: 'refresh' },
    { key: 'recent', label: 'Recent', icon: 'time' }
  ];

  const getLocationIcon = (type: SavedLocation['type']): string => {
    const icons = {
      fountain: 'water',
      refill_station: 'refresh',
      public_building: 'business',
      transport: 'train',
      sports: 'fitness'
    };
    return icons[type];
  };

  const getLocationColor = (type: SavedLocation['type']): string => {
    const colors = {
      fountain: "#60A7D2",
      refill_station: "#4A90BF",
      public_building: "#357ABD",
      transport: "#2C3E50",
      sports: "#27AE60"
    };
    return colors[type];
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'favorite') return matchesSearch && location.isFavorite;
    if (activeFilter === 'recent') return matchesSearch && location.lastVisited;
    return matchesSearch && location.type === activeFilter;
  });

  const toggleFavorite = (locationId: string) => {
    // Implementar lógica para alternar favorito
    console.log('Toggle favorite:', locationId);
  };

  const getDirections = (location: SavedLocation) => {
    // Implementar navegação para direções
    console.log('Get directions to:', location.name);
  };

  const viewLocationDetails = async (location: SavedLocation) => {
    await AsyncStorage.setItem("pointID", location.id);
    navigation.navigate('BottomSheet');
  };
  

  const initialRegion: Region = {
    latitude: 41.1829,
    longitude: -8.6654,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>My Locations</Text>
              <Text style={styles.headerSubtitle}>
                {filteredLocations.length} saved water points
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#7F8C8D" style={styles.searchIcon} />
            <TextInput
              placeholder="Search your locations..."
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

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  activeFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={16} 
                  color={activeFilter === filter.key ? "#FFFFFF" : "#60A7D2"} 
                />
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.key && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mini Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
          >
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.coordinates.lat,
                  longitude: location.coordinates.lng,
                }}
                onPress={() => setSelectedLocation(location)}
              >
                <View style={[
                  styles.marker,
                  { backgroundColor: getLocationColor(location.type) },
                  selectedLocation?.id === location.id && styles.markerSelected
                ]}>
                  <Ionicons 
                    name={getLocationIcon(location.type) as any} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        </View>

        {/* Locations List */}
        <View style={styles.locationsContainer}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'all' ? 'All Locations' : 
             activeFilter === 'favorite' ? 'Favorite Locations' :
             activeFilter === 'recent' ? 'Recently Visited' :
             `${filters.find(f => f.key === activeFilter)?.label}`}
          </Text>

          {filteredLocations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={64} color="#E3F2FD" />
              <Text style={styles.emptyStateTitle}>No locations found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search term' : 'Save your first water point from the map'}
              </Text>
            </View>
          ) : (
            filteredLocations.map((location) => (
              <TouchableOpacity 
                key={location.id}
                style={[
                  styles.locationCard,
                  selectedLocation?.id === location.id && styles.locationCardSelected
                ]}
                onPress={() => setSelectedLocation(location)}
              >
                <View style={styles.locationHeader}>
                  <View style={styles.locationInfo}>
                    <View style={styles.locationType}>
                      <View style={[
                        styles.locationIcon,
                        { backgroundColor: getLocationColor(location.type) }
                      ]}>
                        <Ionicons 
                          name={getLocationIcon(location.type) as any} 
                          size={16} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <Text style={styles.locationName}>{location.name}</Text>
                    </View>
                    <Text style={styles.locationAddress}>{location.address}</Text>
                    
                    <View style={styles.locationMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="location" size={12} color="#7F8C8D" />
                        <Text style={styles.metaText}>{location.distance}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.metaText}>{location.rating}</Text>
                      </View>
                      {location.lastVisited && (
                        <View style={styles.metaItem}>
                          <Ionicons name="time" size={12} color="#7F8C8D" />
                          <Text style={styles.metaText}>{location.lastVisited}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.locationActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => toggleFavorite(location.id)}
                    >
                      <Ionicons 
                        name={location.isFavorite ? "heart" : "heart-outline"} 
                        size={20} 
                        color={location.isFavorite ? "#FF6B6B" : "#7F8C8D"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => getDirections(location)}
                    >
                      <Ionicons name="navigate" size={20} color="#60A7D2" />
                    </TouchableOpacity>
                  </View>
                </View>

                {selectedLocation?.id === location.id && (
                <View style={styles.locationDetails}>
                  <TouchableOpacity 
                    style={styles.detailButton}
                    onPress={() => getDirections(location)}
                  >
                    <LinearGradient
                      colors={['#60A7D2', '#4A90BF']}
                      style={styles.detailGradient}
                    >
                      <Ionicons name="navigate" size={16} color="#FFFFFF" />
                      <Text style={styles.detailButtonText}>Get Directions</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {/* BOTÃO ATUALIZADO - AGORA USA viewLocationDetails */}
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => viewLocationDetails(location)} // ← MUDOU AQUI
                  >
                    <Ionicons name="information-circle" size={16} color="#60A7D2" />
                    <Text style={styles.secondaryButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              )}
              </TouchableOpacity>
            ))
          )}
        </View>

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
  addButton: {
    padding: 8,
  },
  searchContainer: {
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
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingRight: 24,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#60A7D2",
    borderColor: "#60A7D2",
  },
  filterText: {
    color: "#60A7D2",
    fontSize: 12,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerSelected: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  locationsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#2C3E50",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#7F8C8D",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  locationCard: {
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
  },
  locationCardSelected: {
    borderColor: "#60A7D2",
    borderWidth: 2,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  locationInfo: {
    flex: 1,
  },
  locationType: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationName: {
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  locationAddress: {
    color: "#7F8C8D",
    fontSize: 14,
    marginBottom: 8,
  },
  locationMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#7F8C8D",
    fontSize: 12,
    fontWeight: "500",
  },
  locationActions: {
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FBFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  locationDetails: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  detailButton: {
    flex: 2,
    borderRadius: 12,
    shadowColor: "#60A7D2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  detailGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#60A7D2",
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  secondaryButtonText: {
    color: "#60A7D2",
    fontSize: 14,
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