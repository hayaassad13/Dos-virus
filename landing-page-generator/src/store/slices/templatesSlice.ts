import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Template, TemplatesState } from '../../types';

// Predefined templates for the MVP
const defaultTemplates: Template[] = [
  {
    id: 'business-pro',
    name: 'Business Pro',
    description: 'Professional business landing page with clean design',
    thumbnail: 'https://via.placeholder.com/300x200?text=Business+Pro',
    category: 'business',
    defaultContent: {
      hero: {
        title: 'Grow Your Business Today',
        subtitle: 'Transform your ideas into profitable ventures with our proven strategies and expert guidance.',
        backgroundColor: '#1e3a8a',
        textColor: '#ffffff',
        buttonText: 'Get Started',
        buttonColor: '#f59e0b',
      },
      features: [
        {
          id: '1',
          title: 'Expert Consultation',
          description: 'Get personalized advice from industry experts to accelerate your growth.',
          icon: '👥',
        },
        {
          id: '2',
          title: 'Proven Strategies',
          description: 'Implement battle-tested methods that have helped thousands of businesses succeed.',
          icon: '📈',
        },
        {
          id: '3',
          title: '24/7 Support',
          description: 'Round-the-clock assistance to ensure you never miss an opportunity.',
          icon: '🔧',
        },
      ],
      cta: {
        title: 'Ready to Scale Your Business?',
        subtitle: 'Join thousands of successful entrepreneurs who trust our platform.',
        buttonText: 'Start Free Trial',
        buttonColor: '#10b981',
        backgroundColor: '#f3f4f6',
      },
      footer: {
        text: '© 2024 Your Business. All rights reserved.',
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
      },
      form: {
        id: 'contact-form',
        title: 'Get Your Free Consultation',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true,
          },
          {
            id: 'company',
            type: 'text',
            label: 'Company Name',
            placeholder: 'Enter your company name',
            required: false,
          },
        ],
        submitButtonText: 'Get Free Consultation',
        successMessage: 'Thank you! We\'ll contact you within 24 hours.',
      },
    },
    defaultSettings: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#f59e0b',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'startup-launch',
    name: 'Startup Launch',
    description: 'Perfect for launching new products and startups',
    thumbnail: 'https://via.placeholder.com/300x200?text=Startup+Launch',
    category: 'business',
    defaultContent: {
      hero: {
        title: 'Launch Your Startup Successfully',
        subtitle: 'Turn your innovative ideas into reality with our comprehensive startup toolkit.',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        buttonText: 'Start Building',
        buttonColor: '#ec4899',
      },
      features: [
        {
          id: '1',
          title: 'Rapid MVP Development',
          description: 'Build and validate your minimum viable product in weeks, not months.',
          icon: '🚀',
        },
        {
          id: '2',
          title: 'Investor Ready',
          description: 'Prepare compelling pitch decks and financial models for fundraising.',
          icon: '💰',
        },
        {
          id: '3',
          title: 'Market Validation',
          description: 'Test your ideas with real customers before full-scale development.',
          icon: '✅',
        },
      ],
      cta: {
        title: 'Ready to Disrupt the Market?',
        subtitle: 'Join our accelerator program and turn your vision into reality.',
        buttonText: 'Apply Now',
        buttonColor: '#7c3aed',
        backgroundColor: '#fef3c7',
      },
      footer: {
        text: '© 2024 Startup Accelerator. Empowering innovators worldwide.',
        backgroundColor: '#374151',
        textColor: '#f9fafb',
      },
      form: {
        id: 'startup-form',
        title: 'Join Our Accelerator Program',
        fields: [
          {
            id: 'founder-name',
            type: 'text',
            label: 'Founder Name',
            placeholder: 'Your name',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'founder@startup.com',
            required: true,
          },
          {
            id: 'startup-idea',
            type: 'textarea',
            label: 'Startup Idea',
            placeholder: 'Briefly describe your startup idea...',
            required: true,
          },
        ],
        submitButtonText: 'Apply to Accelerator',
        successMessage: 'Application submitted! We\'ll review and get back to you soon.',
      },
    },
    defaultSettings: {
      primaryColor: '#7c3aed',
      secondaryColor: '#ec4899',
      fontFamily: 'Poppins',
    },
  },
  {
    id: 'personal-brand',
    name: 'Personal Brand',
    description: 'Showcase your personal brand and expertise',
    thumbnail: 'https://via.placeholder.com/300x200?text=Personal+Brand',
    category: 'personal',
    defaultContent: {
      hero: {
        title: 'Build Your Personal Brand',
        subtitle: 'Establish yourself as an industry thought leader and grow your influence.',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        buttonText: 'Learn More',
        buttonColor: '#fbbf24',
      },
      features: [
        {
          id: '1',
          title: 'Content Strategy',
          description: 'Develop a consistent content plan that resonates with your audience.',
          icon: '📝',
        },
        {
          id: '2',
          title: 'Social Media Growth',
          description: 'Build a strong social media presence across all platforms.',
          icon: '📱',
        },
        {
          id: '3',
          title: 'Thought Leadership',
          description: 'Position yourself as an expert in your field through strategic content.',
          icon: '🧠',
        },
      ],
      cta: {
        title: 'Ready to Become an Industry Leader?',
        subtitle: 'Start building your personal brand today with our proven framework.',
        buttonText: 'Get Started',
        buttonColor: '#059669',
        backgroundColor: '#ecfdf5',
      },
      footer: {
        text: '© 2024 Personal Brand Builder. Your success is our mission.',
        backgroundColor: '#064e3b',
        textColor: '#ecfdf5',
      },
      form: {
        id: 'brand-form',
        title: 'Start Your Brand Journey',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Your full name',
            required: true,
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'your@email.com',
            required: true,
          },
          {
            id: 'industry',
            type: 'text',
            label: 'Industry',
            placeholder: 'What industry are you in?',
            required: true,
          },
        ],
        submitButtonText: 'Start Building',
        successMessage: 'Welcome! Check your email for your brand building guide.',
      },
    },
    defaultSettings: {
      primaryColor: '#059669',
      secondaryColor: '#fbbf24',
      fontFamily: 'Montserrat',
    },
  },
];

export const fetchTemplates = createAsyncThunk('templates/fetchTemplates', async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return defaultTemplates;
});

const initialState: TemplatesState = {
  templates: [],
  isLoading: false,
  error: null,
};

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action: PayloadAction<Template[]>) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      });
  },
});

export const { clearError } = templatesSlice.actions;
export default templatesSlice.reducer;