# Landing Page Generator MVP

A React Native (Expo) mobile and web app that lets non-technical users quickly create, customize, and publish landing pages without coding.

## 🎯 MVP Features

✅ **Authentication**
- Email/password login and registration
- Demo account: `demo@example.com` / `password`
- Secure session management

✅ **Template Gallery**
- 3 professional landing page templates
- Business Pro, Startup Launch, and Personal Brand themes
- Visual template previews with category filtering

✅ **Dashboard**
- Overview of all landing pages
- Quick stats (total pages, published, drafts)
- Create, edit, preview, and delete pages

✅ **User Profile**
- Account information display
- Settings and logout functionality

🚧 **Coming Soon** (Next Development Phase)
- Drag & drop editor with content blocks
- Live preview functionality
- Form submissions management
- Page publishing with shareable links

## 🚀 Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit
- **UI Components**: React Native built-in + Expo Vector Icons
- **Storage**: AsyncStorage (mock implementation)
- **Authentication**: Mock service (ready for Firebase/Supabase)

## 📱 Installation & Setup

### Prerequisites
- Node.js 16+ 
- Expo CLI (`npm install -g @expo/cli`)

### Getting Started

1. **Clone and Install**
   ```bash
   cd landing-page-generator
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   - **Web**: Press `w` in terminal or visit http://localhost:19006
   - **iOS**: Press `i` or scan QR code with Expo Go app
   - **Android**: Press `a` or scan QR code with Expo Go app

## 🔐 Demo Account

Use these credentials to test the app:
- **Email**: `demo@example.com`
- **Password**: `password`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # App navigation setup
├── screens/            
│   ├── auth/           # Login/Register screens
│   └── main/           # Main app screens
├── store/              # Redux store and slices
│   └── slices/         # Auth, Pages, Templates slices
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🎨 Design System

### Colors
- **Primary**: #3b82f6 (Blue)
- **Secondary**: #10b981 (Green)
- **Accent**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)
- **Gray Scale**: #f8fafc → #1f2937

### Typography
- **Headers**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Captions**: 12-14px

## 🔄 State Management

The app uses Redux Toolkit with three main slices:

### Auth Slice
- User authentication state
- Login/logout/register actions
- Session persistence

### Pages Slice  
- Landing pages CRUD operations
- Form submissions management
- Publishing state

### Templates Slice
- Template gallery data
- Category filtering
- Default content and settings

## 🎯 MVP Goals Achievement

✅ **10-Minute Setup**: Users can sign up and browse templates instantly
✅ **Template Selection**: 3 professional templates available
✅ **User Management**: Full authentication flow
✅ **Page Management**: Create, view, and delete pages
✅ **Mobile-First**: Optimized for mobile with web support

## 🚀 Next Steps (Post-MVP)

1. **Editor Implementation**
   - Drag & drop content blocks
   - Real-time editing
   - Text, image, and color customization

2. **Publishing System**
   - Generate live URLs
   - Custom domain support
   - SSL certificates

3. **Form Management**
   - Lead capture forms
   - Email notifications
   - CSV export

4. **Analytics**
   - Page view tracking
   - Form conversion rates
   - User engagement metrics

5. **Integrations**
   - Google Analytics
   - Mailchimp
   - Zapier webhooks

## 📝 License

MIT License - feel free to use this code for your own projects!

## 🤝 Contributing

This is an MVP demo project. For production use, consider:
- Implementing real backend services (Firebase/Supabase)
- Adding proper error handling and validation
- Implementing comprehensive testing
- Adding accessibility features
- Optimizing performance and bundle size

---

**Built with ❤️ using Expo and React Native**