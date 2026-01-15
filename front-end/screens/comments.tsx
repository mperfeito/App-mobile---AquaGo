import React, { useState, useEffect } from "react";
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {Alert} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import * as ImagePicker from 'expo-image-picker';


type locationObj = {
  id: string, 
  name: string,
  coordinates: {
    lat: number,
    lng: number,
  },
  address: string,
  rating: number,
  type: string,
  schedule: {
    opening_hour: number,
    closing_hour: number,
  },

};

type CommentObj = {
  id: string,
  user_email: string,
  point_id: string,
  rating: number[],
  comment: string,
  image_url: string | null,
  created_at: string,
};

type newCommentObj = {
  rating: number,
  comment: string,
  uri: string | null,
  type: string | null
};

type decode = {
  email: string,
}

type newImgObj = {
  uri: string,
  type: string,
}


const { width, height } = Dimensions.get('window');

// Componente de botão com animação para os transportes
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
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<string>("null");
  const [comments, setComments] = useState<CommentObj[]>([{
    id:"692c6e409ead93fbb322f360",
    user_email: "rodando@gmail.com",
    point_id: "692c6c32b9dcd82c054b1e7a",
    rating: [1,2,3],
    comment: "Love this place!",
    image_url: null,
    created_at: "2026-01-06T12:30:00.000Z"

  }]);
  const [commentToSave, setCommentToSave] = useState<newCommentObj>({rating: 0, comment: "", uri: null, type: null})
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showComments, setShowComments] = useState(true);
  const [theLocation, setTheLocation] = useState<locationObj>({
    id: '69592e433e83bedc149ff86a',
    name: 'Loading',
    coordinates: {
      lat: 41,
      lng: -8.6,
    },
    address: 'Rua do carregamento',
    rating: 3.0,
    type: 'fountain',
    schedule: {
      opening_hour: 0,
      closing_hour: 24
    }
  });

  const [newImage, setNewImage] = useState<newImgObj>({
    uri: "Em Espera",
    type: "Em Espera",
  })

  useEffect(() => {
  try{
    const getLocationInfo = async () => {
      const locationID = await AsyncStorage.getItem("pointID") || '69592e433e83bedc149ff86a';
      try{
        const res = await axios.get(`http://10.0.2.2:3001/waterPoint/${locationID}`);
        setTheLocation(res.data.data);
      } catch(err){
        console.error(err)
      }
    }
    const getComments = async () => {
      const locationID = await AsyncStorage.getItem("pointID") || '69592e433e83bedc149ff86a';
      try{
        const res = await axios.get(`http://10.0.2.2:3001/feedback/${locationID}`)
        for(let i = 0; i < res.data.data.length; i++){
          const myNumb = Math.floor(res.data.data[i].rating);
          switch(myNumb){
            case 1: 
            res.data.data[i].rating = [1];
            break;
            case 2: 
            res.data.data[i].rating = [1,2]
            break;
            case 3: 
            res.data.data[i].rating = [1,2,3]
            break;
            case 4:
            res.data.data[i].rating = [1,2,3,4]
            break;
            case 5:
            res.data.data[i].rating = [1,2,3,4,5]
            break;
          }   
        }
        setComments(res.data.data);
      } catch(err){
        console.error(err);
      }
    }
    getLocationInfo();
    getComments();
  } catch(err){
    console.error(err)
  }
}, []);

useEffect(() => {
}, [commentToSave]);

useEffect(() => {
}, [newImage]);

const pickImage = async () => {

  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }
  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].mimeType;
      if((type != undefined)){
        setNewImage(
         { uri: uri,
          type: type
        });
      }
    }
};

  const calculateTime = async (date: string) => {
    const now = new Date();
    let dateD: Date = new Date(date)

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = now.getTime() - dateD.getTime();

    return Math.floor(diffMs / msPerDay) + ' ' + "days ago";
  }
  const handleTransportPress = (transport: string) => {
    setSelectedTransport(transport);
    console.log(`Transport selected: ${transport}`);
  };

  const handleSave = async () => {
    if (comment.trim() === "") {
      alert("Please add a comment before saving");
      return;
    }
    const locationID = await AsyncStorage.getItem("pointID") || '69592e433e83bedc149ff86a';
    const token = await AsyncStorage.getItem("authToken");
    if(!token){
      console.log("No token found");
      return;
    }
    const decoded = jwtDecode<decode>(token);
    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    if (newImage.uri != "Em Espera") {
    const file = {
        uri: newImage.uri,
        type: newImage.type,
        name: newImage.uri.split("/").pop(),
    } as any;
    formData.append("image", file);
}

console.log(formData);

const res = await axios.post(
    `http://10.0.2.2:3001/feedback/${decoded.email}/${locationID}`,
    formData,
    {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    }
).then(res => {
      Alert.alert(
        "Sucess",
        `Your comment was sucessfully saved`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('Comments'),
          },
        ]
      );
    })
    .catch(err => {
      Alert.alert(
        "Error",
        "An error ocurred while saving the comment!",
        [
          {
            text: "TRY AGAIN",
            onPress: () => navigation.navigate('Comments'),
          },
        ]
      );
    })
  };

  const handleClose = () => {
    navigation.navigate("BottomSheet");
  };

  const getTransportStyle = (transport: string) => {
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
      <StatusBar barStyle="light-content" backgroundColor="#60A7D2" />
      
      {/* Header com gradiente - Agora parte integral da página */}
      <LinearGradient
        colors={['#60A7D2', '#4A90BF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#FF6B6B" : "#FFFFFF"} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Conteúdo Principal */}
        <View style={styles.content}>
          {/* Location Header */}
          <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>{theLocation.name}</Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.locationSubtitle}>{theLocation.type}</Text>
                <View style={styles.statusBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#27AE60" />
                  <Text style={styles.statusText}>Working</Text>
                </View>
              </View>
              
              {/* Rating e Distância */}
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.metaText}>{theLocation.rating}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location" size={16} color="#60A7D2" />
                  <Text style={styles.metaText}>0.2 km</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={16} color="#60A7D2" />
                  <Text style={styles.metaText}>Always open</Text>
                </View>
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

          {/* Location Details */}
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
                  <Ionicons name="water-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Water Type</Text>
                  <Text style={styles.detailValue}>Cold, Potable</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="accessibility-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Accessibility</Text>
                  <Text style={styles.detailValue}>Wheelchair friendly</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Additional Info</Text>
                  <Text style={styles.detailValue}>Dog-friendly area nearby</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
              <TouchableOpacity onPress={() => setShowComments(!showComments)}>
                <Ionicons 
                  name={showComments ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#7F8C8D" 
                />
              </TouchableOpacity>
            </View>

            {showComments && (
              <>
              {comments.map((comment) => (
                <View style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentUser}>
                      <Image
                        source={{uri: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5b753d2c-072c-48b6-bfb2-4caf6e8c56b1"}}
                        style={styles.avatar}
                      />
                      <View>
                        <Text style={styles.userName} key={comment.user_email}>{comment.user_email}</Text>
                        <View style={styles.commentRating}>
                          {comment.rating.map((comment) => (
                            <Ionicons key={comment} name="star" size={12} color="#FFD700" />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text style={styles.commentTime} key={comment.created_at}>{calculateTime(comment.created_at)}</Text>
                  </View>
                  <Text style={styles.commentText} key={comment.comment}>
                    {comment.comment}
                  </Text>
                  {comment.image_url && (
                  <Image
                    source={{ uri: comment.image_url }}
                    style={{ width: 250, height: 200 }}
                  />
)}
                </View>
              ))}  
              </>
            )}
          </View>

          {/* Add Comment Section */}
          <View style={styles.addCommentSection}>
            <Text style={styles.sectionTitle}>Share Your Experience</Text>
            
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={24}
              color={star <= rating ? "#FFD700" : "#CCCCCC"}
            />
          </TouchableOpacity>
        ))}
      </View>
            
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#95A5A6"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity 
              style={styles.addPhotoButton}
              onPress={pickImage}
            >
              <LinearGradient
                colors={['#60A7D2', '#4A90BF']}
                style={styles.addPhotoGradient}
              >
                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                <Text style={styles.addPhotoText}>Add a Photo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <LinearGradient
                colors={['#60A7D2', '#4A90BF']}
                style={styles.saveGradient}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Comment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
  },
  closeButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    padding: 24,
  },
  locationHeader: {
    marginBottom: 24,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    color: "#2C3E50",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  locationSubtitle: {
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
    flexWrap: "wrap",
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
  commentsSection: {
    marginBottom: 24,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  commentCard: {
    backgroundColor: "#F8FBFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  commentRating: {
    flexDirection: "row",
    gap: 2,
  },
  commentTime: {
    color: "#95A5A6",
    fontSize: 12,
    fontWeight: "500",
  },
  commentText: {
    color: "#2C3E50",
    fontSize: 14,
    lineHeight: 20,
  },
  addCommentSection: {
    marginBottom: 40,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  commentInput: {
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#2C3E50",
    marginBottom: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  addPhotoButton: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#60A7D2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addPhotoGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    borderRadius: 12,
    gap: 8,
  },
  addPhotoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
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
  saveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});