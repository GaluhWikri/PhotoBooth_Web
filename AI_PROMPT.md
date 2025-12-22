# AI Agent Prompt: Build PhotoBooth Web Application

## Project Overview
Create a modern, professional web-based photobooth application called **G.Studio** that allows users to take photos using their webcam, customize them with stickers and backgrounds, arrange them in various layouts, and download the final photo strips. The application should feature a stunning, premium UI with smooth animations and a delightful user experience.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend/Storage**: Supabase (for stickers, paper templates, and layouts)
- **Key Libraries**:
  - `@supabase/supabase-js` - Supabase client
  - `lucide-react` - Icon library
  - `react-draggable` - For draggable stickers
  - `dom-to-image-more` - Canvas rendering for downloads
  - `gsap` - Animations (optional)

## Application Architecture

### Page Flow
1. **Landing Page** → User sees hero section with floating photo strip decorations
2. **Layout Selection** → User chooses from 4 different photo strip layouts
3. **Photo Booth** → User captures/uploads photos, customizes with stickers and backgrounds
4. **Download** → User downloads the final photo strip

### Additional Pages
- About page
- Privacy Policy page
- Contact page

## Detailed Requirements

### 1. Landing Page (`LandingPage.tsx`)
**Features:**
- Hero section with large serif "photobooth" title
- Animated breathing blue gradient background (800px x 400px ellipse with blur)
- Random decorative stickers floating in the background (12 stickers, opacity 40%)
- Two decorative photo strips floating on left and right sides with animations
- "START" button with camera icon leading to layout selection
- Responsive navbar component
- Instagram link in footer: `@galuh.wikri`

**Design Details:**
- Background color: `#F0F7FF`
- Main title: Large serif font (6xl to 9xl responsive)
- Tagline: "Capture the moment, cherish the magic, relive the love"
- Left strip: White background, grayscale photos, -6deg rotation
- Right strip: Dark `#1a1a1a` background, sepia photos, +6deg rotation
- Breathing animation: scale from 0.85 to 1.15 over 4s

### 2. Layout Selection Page (`ChooseLayout.tsx`)
**Features:**
- Display 4 layout options in a grid (1 col mobile, 2 col tablet, 4 col desktop)
- Each layout shows a preview image
- "POPULAR" badge on strip-4 and grid-6 layouts

**Layout Types:**
1. **The Signature** (strip-4): 2x6 strip, 4 photos vertically
2. **Portrait Mode** (strip-2): 2x6 strip, 2 photos vertically  
3. **Mix & Match** (grid-6): 4x6 grid, 6 photos (2x3 grid)
4. **Quad Grid** (grid-4): 4x6 grid, 4 photos (2x2 grid)

**Layout Configuration:**
```typescript
interface LayoutConfig {
  id: string;
  type: 'strip-2' | 'strip-4' | 'grid-4' | 'grid-6';
  title: string;
  description: string;
  photoCount: number;
  aspectRatio: number;
  cssClass: string;
  previewImage: string;
}
```

**Data Source:**
- Fetch from Supabase `layouts` table
- Fallback to local defaults if Supabase unavailable
- Preview images stored in `/LayoutType/` (type 1.png, type 2.png, etc.)

### 3. Photo Booth Main Interface (`PhotoBooth.tsx`)
**Layout:**
- Two-column layout (5 cols preview, 7 cols controls on desktop)
- Left: Sticky preview of photo strip with Download and Retake buttons
- Right: Camera/upload controls, template/color picker, sticker gallery

**Features:**

#### A. Photo Capture
- Live camera view with:
  - 3-2-1 countdown timer
  - Filter selection (10 filters: Normal, Vintage, Grayscale, Smooth, BW, Warm, Cool, Focus, Candy, 80s)
  - Grid overlay option
  - Timer duration selection (0s, 3s, 5s)
  - Front/back camera toggle
  - Manual capture button
- Upload photo option as alternative
- Track progress: `${photos.length}/${layout.photoCount}`
- Auto-close camera when all photos captured

#### B. Background Customization
- 7 preset colors:
  - `#948979` (pink/beige)
  - `#1E3E62` (Navy Blue)
  - `#52A5CE` (Blueberry)
  - `#2B2B23` (Forest)
  - `#AFAB23` (Olive Green)
  - `#876029` (Dry Earth)
  - `#EF6F4C` (Blood Orange)
- Paper texture templates from Supabase `paper` table
- Custom image upload option
- Display as circular buttons in a grid (6-8 columns)

#### C. Stickers
- Fetch from Supabase `stickers` table
- Display in scrollable grid (6-8 columns)
- Draggable with react-draggable
- Features per sticker:
  - Drag to reposition
  - Scale with zoom buttons
  - Rotate with rotation button
  - Delete with X button
  - Active sticker gets blue border

**Sticker Object:**
```typescript
interface StickerObject {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}
```

### 4. Camera Component (`Camera.tsx`)
**Features:**
- Request camera permission
- Mirror effect on video (scaleX(-1))
- Aspect ratio matching layout (3:2 for photos)
- Apply CSS filters in real-time
- Optional grid overlay (3x3)
- Countdown timer with animations
- Capture photo to canvas with proper aspect ratio
- Modern UI with glassmorphism effects

**Filter Definitions:**
```javascript
const filters = [
  { name: 'Normal', value: 'none' },
  { name: 'Vintage', value: 'sepia(0.4) contrast(1.2) brightness(0.9)' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Smooth', value: 'contrast(0.9) brightness(1.1) blur(0.5px)' },
  { name: 'BW', value: 'grayscale(1) contrast(1.3)' },
  { name: 'Warm', value: 'sepia(0.3) saturate(1.2) brightness(1.1)' },
  { name: 'Cool', value: 'hue-rotate(180deg) saturate(0.8)' },
  { name: 'Focus', value: 'contrast(1.2) brightness(1.1)' },
  { name: 'Candy', value: 'brightness(1.1) saturate(1.5) hue-rotate(-10deg)' },
  { name: '80s', value: 'contrast(1.1) brightness(1.1) saturate(1.5) sepia(0.2)' }
];
```

### 5. Photo Strip Component (`PhotoStrip.tsx`)
**Features:**
- Display photos in selected layout
- Show empty slots with camera icon for missing photos
- Delete individual photos
- Render stickers on top of photos
- Background color/image support
- Signature text at bottom: "G.STUDIO"

**Download Functionality:**
- Use high-resolution canvas (multiply by 3 for quality)
- Maintain aspect ratio
- Export as PNG
- Filename format: `photostrip_${timestamp}.png`

**Layout Rendering:**
For strip layouts (strip-2, strip-4):
- Vertical arrangement
- Each photo 3:2 aspect ratio
- Small gaps between photos

For grid layouts (grid-4, grid-6):
- CSS Grid with 2 columns
- grid-4: 2 rows
- grid-6: 3 rows
- Proper gaps and aspect ratios

### 6. Navbar Component (`Navbar.tsx`)
**Features:**
- Logo/Title: "G.STUDIO" (left side)
- Navigation links: Home, About, Privacy, Contact
- Active page indicator
- Responsive hamburger menu on mobile
- Modern design with hover effects

### 7. Supabase Integration

**Environment Variables (.env):**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Database Tables:**

**stickers table:**
```sql
CREATE TABLE stickers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamp DEFAULT now()
);
```

**paper table:**
```sql
CREATE TABLE paper (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamp DEFAULT now()
);
```

**layouts table:**
```sql
CREATE TABLE layouts (
  id text PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  photo_count integer NOT NULL,
  aspect_ratio decimal NOT NULL,
  css_class text NOT NULL,
  preview_image_url text NOT NULL,
  display_order integer NOT NULL
);
```

**Supabase Client (`src/lib/supabaseClient.ts`):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
```

## Design System

### Colors
- Background: `#F0F7FF` (light blue)
- Primary: `#2563EB` (blue-600)
- Text: `#1c1917` (stone-800/900)
- Accent: Stone palette (100-900)

### Typography
- Font Family: 'Averia Serif Libre', serif
- Load from Google Fonts
- Use serif for headings, sans-serif for body text via Tailwind

### Animations (CSS)
```css
@keyframes breathe {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.85);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 1;
  }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(-6deg); }
  50% { transform: translateY(-20px) rotate(-6deg); }
  100% { transform: translateY(0px) rotate(-6deg); }
}

@keyframes float-right {
  0% { transform: translateY(0px) rotate(6deg); }
  50% { transform: translateY(-20px) rotate(6deg); }
  100% { transform: translateY(0px) rotate(6deg); }
}
```

### Component Styling Guidelines
- Use rounded corners (rounded-full, rounded-3xl)
- Shadow effects for depth (shadow-xl, shadow-2xl)
- Hover effects with scale transformations
- Smooth transitions (transition-all)
- Glassmorphism for camera UI (backdrop-blur-md, bg-black/30)

## File Structure
```
photobooth/
├── public/
│   ├── Icon/
│   │   └── icons8-web-camera-100.png
│   ├── LayoutType/
│   │   ├── type 1.png (strip-4)
│   │   ├── type 2.png (strip-2)
│   │   ├── type 3.png (grid-6)
│   │   └── type 4.png (grid-4)
│   ├── Paper/
│   │   └── [1-17].jpeg (texture templates)
│   └── Stickers/
│       └── sticker[1-32].png
├── src/
│   ├── components/
│   │   ├── PhotoBooth.tsx (main component)
│   │   ├── LandingPage.tsx
│   │   ├── ChooseLayout.tsx
│   │   ├── Camera.tsx
│   │   ├── PhotoStrip.tsx
│   │   ├── Navbar.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── PrivacyPolicy.tsx
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Key Features to Implement

### 1. Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack layout vertically on mobile
- Hamburger menu for navigation

### 2. Camera Permissions
- Request permission with user-friendly messaging
- Handle permission denied gracefully
- Show fallback upload option

### 3. Photo Management
- Store photos in state as data URLs
- Allow deletion of individual photos
- Clear all and retake functionality
- Prevent exceeding layout photo count

### 4. Download Quality
- Render at 3x resolution for crisp output
- Proper canvas sizing based on layout
- Maintain aspect ratios
- Include background and stickers in export

### 5. Error Handling
- Supabase connection failures → fall back to local assets
- Camera access denied → show upload option
- Missing images → show placeholders

### 6. Performance
- Lazy load images
- Optimize sticker rendering
- Debounce drag/scale operations
- Use React.memo where appropriate

## Content Requirements

### About Page
- Brief description of the photobooth application
- How to use instructions
- Technology stack used
- Contact information

### Privacy Policy Page
- Camera permission usage
- Data storage (local only, no server storage)
- Third-party services (Supabase for assets only)

### Contact Page
- Email or contact form
- Social media links (Instagram: @galuh.wikri)

## Testing Checklist
- [ ] Camera works on desktop and mobile
- [ ] All layouts render correctly
- [ ] Stickers are draggable and controllable
- [ ] Background colors and textures apply properly
- [ ] Download produces high-quality image
- [ ] Responsive design works on all screen sizes
- [ ] Supabase integration with fallback works
- [ ] All filters apply correctly
- [ ] Navigation between pages works smoothly

## Final Polish
1. Add loading states (spinners for Supabase fetches)
2. Smooth page transitions
3. Accessibility: keyboard navigation, ARIA labels
4. SEO: meta tags, title, description
5. Favicon and app icons
6. Error boundaries for React components

## Deployment
- Platform: Vercel (recommended)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: Add Supabase credentials
- Live URL: https://photo-booth-web.vercel.app/

---

## Additional Notes
- The application emphasizes premium aesthetics with smooth animations
- User experience should feel delightful and professional
- All interactions should have visual feedback
- Minimize loading times wherever possible
- Ensure cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## Success Criteria
The application should allow users to:
1. See a beautiful landing page that makes them want to use the app
2. Choose a layout that fits their needs
3. Capture or upload photos with ease
4. Customize with fun stickers and backgrounds
5. Download a professional-looking photo strip
6. Navigate the app intuitively without instructions

This is a complete, professional photobooth web application ready for deployment and real-world use.
