import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../../types';

// Mock authentication service - replace with real Firebase/Supabase implementation
const mockAuthService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'demo@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        email,
        name: 'Demo User',
        createdAt: new Date(),
      };
      await AsyncStorage.setItem('authToken', 'mock-token');
      return user;
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (email: string, password: string, name?: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
    };
    await AsyncStorage.setItem('authToken', 'mock-token');
    return user;
  },
  
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      return {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date(),
      };
    }
    return null;
  },
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    return await mockAuthService.login(email, password);
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    return await mockAuthService.register(email, password, name);
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await mockAuthService.logout();
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async () => {
  return await mockAuthService.getCurrentUser();
});

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      // Check auth status
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
        state.isLoading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;