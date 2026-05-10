// src/screens/CommunityScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, Send, Plus, Image as ImageIcon, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../contexts/SubscriptionContext';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: any;
    location: string;
  };
  content: string;
  image?: any;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { canPostToCommunity, communityPostsThisMonth, maxCommunityPosts, upgradeToPremium } = useSubscription();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        name: 'Rajesh Kumar',
        avatar: require('../assets/avatar1.png'),
        location: 'Punjab, India',
      },
      content: 'Just harvested my wheat crop! Best yield ever thanks to the smart farming tips. 🌾',
      image: require('../assets/post1.png'),
      likes: 124,
      comments: 23,
      timeAgo: '2 hours ago',
      isLiked: false,
    },
    {
      id: '2',
      user: {
        name: 'Priya Sharma',
        avatar: require('../assets/avatar2.png'),
        location: 'Maharashtra, India',
      },
      content: 'Using drip irrigation has reduced my water usage by 40%! Highly recommend.',
      likes: 89,
      comments: 15,
      timeAgo: '5 hours ago',
      isLiked: true,
    },
    {
      id: '3',
      user: {
        name: 'Amit Patel',
        avatar: require('../assets/avatar3.png'),
        location: 'Gujarat, India',
      },
      content: 'Anyone facing issues with pest control in cotton crops? Looking for organic solutions.',
      likes: 45,
      comments: 34,
      timeAgo: '1 day ago',
      isLiked: false,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    if (!canPostToCommunity) {
      Alert.alert(
        'Post Limit Reached',
        `You have reached your monthly post limit of ${maxCommunityPosts} posts. Upgrade to Premium for unlimited posts!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: upgradeToPremium },
        ]
      );
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: require('../assets/default-avatar.png'),
        location: 'Your Farm',
      },
      content: newPostContent,
      image: selectedImage,
      likes: 0,
      comments: 0,
      timeAgo: 'Just now',
      isLiked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedImage(null);
    setShowCreateModal(false);
  };

  const renderPost = ({ item, index }: { item: Post; index: number }) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.postCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.postHeader}>
          <Image source={item.user.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.userLocation}>{item.user.location}</Text>
          </View>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        {item.image && (
          <Image source={item.image} style={styles.postImage} resizeMode="cover" />
        )}

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Heart
              size={20}
              color={item.isLiked ? '#FF5252' : '#999'}
              fill={item.isLiked ? '#FF5252' : 'none'}
            />
            <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>
              {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color="#999" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color="#999" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F3D1E', '#2E7D32'] as [string, string]} style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with fellow farmers</Text>
      </LinearGradient>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.postsList, { paddingBottom: insets.bottom + 80 }]}
        ListHeaderComponent={
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>567</Text>
              <Text style={styles.statLabel}>Posts Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>Online Now</Text>
            </View>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient colors={['#2E7D32', '#43A047'] as [string, string]} style={styles.fabGradient}>
          <Plus size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.postLimitInfo}>
              <Text style={styles.postLimitText}>
                Posts this month: {communityPostsThisMonth} / {maxCommunityPosts === Infinity ? 'Unlimited' : maxCommunityPosts}
              </Text>
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="Share your farming experience..."
              placeholderTextColor="#999"
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
            />

            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <Image source={selectedImage} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.imagePickerButton}>
                <ImageIcon size={24} color="#999" />
                <Text style={styles.imagePickerText}>Add Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreatePost}
              >
                <Send size={20} color="#fff" />
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  postsList: {
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#999',
  },
  actionTextActive: {
    color: '#FF5252',
  },
  fab: {
    position: 'absolute',
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  postLimitInfo: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  postLimitText: {
    fontSize: 12,
    color: '#F57C00',
    textAlign: 'center',
  },
  postInput: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 8,
  },
  imagePickerText: {
    fontSize: 14,
    color: '#666',
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});