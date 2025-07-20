import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LandingPage, PagesState, FormSubmission } from '../../types';

// Mock storage service - replace with real Firebase/Supabase implementation
const mockPagesService = {
  getPages: async (userId: string): Promise<LandingPage[]> => {
    const stored = await AsyncStorage.getItem(`pages_${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  
  savePage: async (page: LandingPage): Promise<LandingPage> => {
    const pages = await mockPagesService.getPages(page.userId);
    const existingIndex = pages.findIndex(p => p.id === page.id);
    
    if (existingIndex >= 0) {
      pages[existingIndex] = { ...page, updatedAt: new Date() };
    } else {
      pages.push(page);
    }
    
    await AsyncStorage.setItem(`pages_${page.userId}`, JSON.stringify(pages));
    return page;
  },
  
  deletePage: async (userId: string, pageId: string): Promise<void> => {
    const pages = await mockPagesService.getPages(userId);
    const filtered = pages.filter(p => p.id !== pageId);
    await AsyncStorage.setItem(`pages_${userId}`, JSON.stringify(filtered));
  },
  
  publishPage: async (userId: string, pageId: string): Promise<LandingPage> => {
    const pages = await mockPagesService.getPages(userId);
    const page = pages.find(p => p.id === pageId);
    if (!page) throw new Error('Page not found');
    
    const updatedPage = { ...page, isPublished: true, updatedAt: new Date() };
    return await mockPagesService.savePage(updatedPage);
  },
  
  submitForm: async (submission: FormSubmission): Promise<void> => {
    const submissions = await AsyncStorage.getItem(`submissions_${submission.landingPageId}`);
    const existing = submissions ? JSON.parse(submissions) : [];
    existing.push(submission);
    await AsyncStorage.setItem(`submissions_${submission.landingPageId}`, JSON.stringify(existing));
  },
  
  getFormSubmissions: async (landingPageId: string): Promise<FormSubmission[]> => {
    const stored = await AsyncStorage.getItem(`submissions_${landingPageId}`);
    return stored ? JSON.parse(stored) : [];
  },
};

export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (userId: string) => {
    return await mockPagesService.getPages(userId);
  }
);

export const savePage = createAsyncThunk(
  'pages/savePage',
  async (page: LandingPage) => {
    return await mockPagesService.savePage(page);
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async ({ userId, pageId }: { userId: string; pageId: string }) => {
    await mockPagesService.deletePage(userId, pageId);
    return pageId;
  }
);

export const publishPage = createAsyncThunk(
  'pages/publishPage',
  async ({ userId, pageId }: { userId: string; pageId: string }) => {
    return await mockPagesService.publishPage(userId, pageId);
  }
);

export const submitForm = createAsyncThunk(
  'pages/submitForm',
  async (submission: FormSubmission) => {
    await mockPagesService.submitForm(submission);
    return submission;
  }
);

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  isLoading: false,
  error: null,
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<LandingPage | null>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCurrentPageContent: (state, action: PayloadAction<Partial<LandingPage>>) => {
      if (state.currentPage) {
        state.currentPage = { ...state.currentPage, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pages
      .addCase(fetchPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action: PayloadAction<LandingPage[]>) => {
        state.isLoading = false;
        state.pages = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch pages';
      })
      // Save page
      .addCase(savePage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(savePage.fulfilled, (state, action: PayloadAction<LandingPage>) => {
        state.isLoading = false;
        const existingIndex = state.pages.findIndex(p => p.id === action.payload.id);
        if (existingIndex >= 0) {
          state.pages[existingIndex] = action.payload;
        } else {
          state.pages.push(action.payload);
        }
        if (state.currentPage?.id === action.payload.id) {
          state.currentPage = action.payload;
        }
      })
      .addCase(savePage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save page';
      })
      // Delete page
      .addCase(deletePage.fulfilled, (state, action: PayloadAction<string>) => {
        state.pages = state.pages.filter(p => p.id !== action.payload);
        if (state.currentPage?.id === action.payload) {
          state.currentPage = null;
        }
      })
      // Publish page
      .addCase(publishPage.fulfilled, (state, action: PayloadAction<LandingPage>) => {
        const existingIndex = state.pages.findIndex(p => p.id === action.payload.id);
        if (existingIndex >= 0) {
          state.pages[existingIndex] = action.payload;
        }
        if (state.currentPage?.id === action.payload.id) {
          state.currentPage = action.payload;
        }
      });
  },
});

export const { setCurrentPage, clearError, updateCurrentPageContent } = pagesSlice.actions;
export default pagesSlice.reducer;