import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import { RootState, AppDispatch } from '../../store';
import { fetchTemplates } from '../../store/slices/templatesSlice';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Template } from '../../types';

type TemplatesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with padding

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return '#3b82f6';
      case 'personal':
        return '#10b981';
      case 'event':
        return '#f59e0b';
      case 'product':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business':
        return '💼';
      case 'personal':
        return '👤';
      case 'event':
        return '🎉';
      case 'product':
        return '📦';
      default:
        return '📄';
    }
  };

  return (
    <TouchableOpacity style={styles.templateCard} onPress={onSelect}>
      <View style={styles.templatePreview}>
        <LinearGradient
          colors={[template.defaultContent.hero.backgroundColor, template.defaultSettings.primaryColor]}
          style={styles.previewGradient}
        >
          <Text style={[styles.previewTitle, { color: template.defaultContent.hero.textColor }]} numberOfLines={2}>
            {template.defaultContent.hero.title}
          </Text>
          <Text style={[styles.previewSubtitle, { color: template.defaultContent.hero.textColor }]} numberOfLines={1}>
            {template.defaultContent.hero.subtitle}
          </Text>
          <View style={[styles.previewButton, { backgroundColor: template.defaultContent.hero.buttonColor }]}>
            <Text style={styles.previewButtonText} numberOfLines={1}>
              {template.defaultContent.hero.buttonText}
            </Text>
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.templateInfo}>
        <View style={styles.templateHeader}>
          <Text style={styles.templateName} numberOfLines={1}>
            {template.name}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(template.category) }]}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(template.category)}</Text>
          </View>
        </View>
        <Text style={styles.templateDescription} numberOfLines={2}>
          {template.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TemplatesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<TemplatesScreenNavigationProp>();
  const { templates, isLoading } = useSelector((state: RootState) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleSelectTemplate = (templateId: string) => {
    navigation.navigate('Editor', { templateId });
  };

  const renderTemplate = ({ item }: { item: Template }) => (
    <TemplateCard
      template={item}
      onSelect={() => handleSelectTemplate(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Choose a Template</Text>
      <Text style={styles.headerSubtitle}>
        Start with a professional template and customize it to match your brand
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.templatesList}
        columnWrapperStyle={styles.templateRow}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  templatesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  templateRow: {
    justifyContent: 'space-between',
  },
  templateCard: {
    width: cardWidth,
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
  templatePreview: {
    height: 140,
  },
  previewGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  previewSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 8,
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  previewButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  templateInfo: {
    padding: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryIcon: {
    fontSize: 12,
  },
  templateDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
});