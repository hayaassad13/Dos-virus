import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootState, AppDispatch } from '../../store';
import { fetchPages, deletePage } from '../../store/slices/pagesSlice';
import { RootStackParamList, MainTabParamList } from '../../navigation/AppNavigator';
import { LandingPage } from '../../types';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  StackNavigationProp<RootStackParamList>
>;

interface PageCardProps {
  page: LandingPage;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onPublish: () => void;
}

function PageCard({ page, onEdit, onPreview, onDelete, onPublish }: PageCardProps) {
  return (
    <View style={styles.pageCard}>
      <View style={styles.pageHeader}>
        <View style={styles.pageInfo}>
          <Text style={styles.pageTitle} numberOfLines={1}>
            {page.title}
          </Text>
          <Text style={styles.pageSubtitle}>
            {page.isPublished ? '🟢 Published' : '🟡 Draft'}
          </Text>
          <Text style={styles.pageDate}>
            Updated {new Date(page.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.pageActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onPreview}>
            <Ionicons name="eye-outline" size={20} color="#10b981" />
          </TouchableOpacity>
          {!page.isPublished && (
            <TouchableOpacity style={styles.actionButton} onPress={onPublish}>
              <Ionicons name="cloud-upload-outline" size={20} color="#f59e0b" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.pagePreview}>
        <LinearGradient
          colors={[page.content.hero.backgroundColor, page.settings.primaryColor]}
          style={styles.previewGradient}
        >
          <Text style={[styles.previewTitle, { color: page.content.hero.textColor }]} numberOfLines={2}>
            {page.content.hero.title}
          </Text>
          <Text style={[styles.previewSubtitle, { color: page.content.hero.textColor }]} numberOfLines={1}>
            {page.content.hero.subtitle}
          </Text>
        </LinearGradient>
      </View>
      
      {page.isPublished && (
        <View style={styles.publishedInfo}>
          <Text style={styles.publishedUrl} numberOfLines={1}>
            🔗 {page.slug}.yoursite.com
          </Text>
        </View>
      )}
    </View>
  );
}

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { pages, isLoading } = useSelector((state: RootState) => state.pages);

  useEffect(() => {
    if (user) {
      dispatch(fetchPages(user.id));
    }
  }, [user, dispatch]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await dispatch(fetchPages(user.id));
      setRefreshing(false);
    }
  };

  const handleCreateNew = () => {
    navigation.navigate('Templates');
  };

  const handleEditPage = (pageId: string) => {
    navigation.navigate('Editor', { pageId });
  };

  const handlePreviewPage = (pageId: string) => {
    navigation.navigate('Preview', { pageId });
  };

  const handleDeletePage = (pageId: string, title: string) => {
    Alert.alert(
      'Delete Page',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (user) {
              dispatch(deletePage({ userId: user.id, pageId }));
            }
          },
        },
      ]
    );
  };

  const handlePublishPage = (pageId: string) => {
    // For now, navigate to editor to complete the page first
    navigation.navigate('Editor', { pageId });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={80} color="#9ca3af" />
      <Text style={styles.emptyTitle}>No Landing Pages Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first landing page to start collecting leads and growing your business.
      </Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
        <Text style={styles.createButtonText}>Create Your First Page</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPage = ({ item }: { item: LandingPage }) => (
    <PageCard
      page={item}
      onEdit={() => handleEditPage(item.id)}
      onPreview={() => handlePreviewPage(item.id)}
      onDelete={() => handleDeletePage(item.id, item.title)}
      onPublish={() => handlePublishPage(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Landing Pages</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back, {user?.name || 'Creator'}! 
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateNew}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pages.length}</Text>
          <Text style={styles.statLabel}>Total Pages</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pages.filter(p => p.isPublished).length}</Text>
          <Text style={styles.statLabel}>Published</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pages.filter(p => !p.isPublished).length}</Text>
          <Text style={styles.statLabel}>Drafts</Text>
        </View>
      </View>

      {pages.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={pages}
          renderItem={renderPage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.pagesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  pagesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  pageInfo: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  pageDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  pageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  pagePreview: {
    height: 100,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  publishedInfo: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  publishedUrl: {
    fontSize: 14,
    color: '#166534',
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});