# UI Design Documentation - Yritystili App

## Overview
This document describes the visual design and user experience of the Yritystili – Helsinki eBike Service Oy mobile banking application.

## Design Philosophy
The app follows a **minimalist fintech aesthetic** inspired by Apple Pay and Revolut, featuring:
- **Dark theme**: Black background with white text for premium feel
- **Neon-green accents** (#00FFAE): Used strategically for CTAs and highlights
- **Elegant shadows**: Subtle neon-green glow effects for depth
- **Smooth animations**: Powered by React Native Reanimated
- **Haptic feedback**: Tactile responses on all interactions

## Color Palette

### Primary Colors
- **Black**: `#000000` - Main background
- **White**: `#FFFFFF` - Primary text
- **Neon Green**: `#00FFAE` - Brand accent, CTAs, success states

### Secondary Colors
- **Dark Gray**: `#0A0A0A` - Card backgrounds
- **Gray**: `#1A1A1A` - Secondary backgrounds
- **Light Gray**: `#333333` - Borders, dividers
- **Text Secondary**: `#999999` - Secondary text

### Status Colors
- **Success**: `#00FFAE` - Positive actions, income
- **Danger**: `#FF006E` - Negative actions, expenses
- **Warning**: `#FFB800` - Alerts

## Screen-by-Screen Design

### 1. Home Screen (`app/index.tsx`)

#### Layout Structure
```
┌─────────────────────────────────┐
│ Good day                        │
│ Helsinki eBike Service Oy    👤│
├─────────────────────────────────┤
│ ╔═════════════════════════════╗ │
│ ║  Total Balance          🚲  ║ │
│ ║  12,847.50 €                ║ │
│ ║  FI21 1234 5678 9012 34     ║ │
│ ╚═════════════════════════════╝ │
├─────────────────────────────────┤
│  (Send) (Request) (Exchange)    │
│  (Top Up)                        │
├─────────────────────────────────┤
│ Recent Activity         See All │
│ ┌─────────────────────────────┐ │
│ │ ↑ eBike Day Pass    -15.90€│ │
│ │ ↓ Salary           +3500€  │ │
│ │ ↑ eBike Monthly    -49.90€ │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Key Features
- **Balance Card**: Gradient background (gray to dark gray), neon-green shadow
- **Profile Icon**: Neon-green circular icon in header
- **Quick Actions**: 4 circular buttons with neon-green background
- **Transaction List**: Icons showing direction (↑ debit, ↓ credit)
- **Animations**: Scale animation on balance card press
- **Haptics**: Light impact on all taps

### 2. Payment Screen (`app/payment.tsx`)

#### Layout Structure
```
┌─────────────────────────────────┐
│ New Payment                      │
│ Send money instantly             │
├─────────────────────────────────┤
│ Available Balance                │
│ 12,847.50 €                      │
├─────────────────────────────────┤
│ Quick Send                       │
│ (Anna) (Mikko) (Sofia) (Janne)  │
├─────────────────────────────────┤
│ Payment Details                  │
│ ┌─────────────────────────────┐ │
│ │ 👤 Recipient                │ │
│ │ 💰 Amount                   │ │
│ │    [10€] [25€] [50€] [100€]│ │
│ │ 💬 Message (Optional)       │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │    Send Payment         →   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Key Features
- **Available Balance Card**: Green-accented card at top
- **Quick Contacts**: Horizontal scrolling contact chips
  - Unselected: Gray background with green icon
  - Selected: Neon-green background with black icon
- **Amount Presets**: Quick select buttons for common amounts
- **Send Button**: Large neon-green CTA with arrow
- **Haptics**: Medium impact on send, light on selections
- **Animation**: Scale animation on send button press

### 3. Statement Screen (`app/statement.tsx`)

#### Layout Structure
```
┌─────────────────────────────────┐
│ Statement                        │
│ Transaction history              │
├─────────────────────────────────┤
│ ┌───────────┐  ┌───────────┐   │
│ │ ↗ Income  │  │ ↘ Expenses│   │
│ │ +4350.00€ │  │ -330.15€  │   │
│ └───────────┘  └───────────┘   │
├─────────────────────────────────┤
│ [All] [Income] [Expenses]       │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ↑ eBike Day Pass            │ │
│ │   Nov 5 • Transport         │ │
│ │                     -15.90€ │ │
│ ├─────────────────────────────┤ │
│ │ ↓ Salary                    │ │
│ │   Nov 1 • Income            │ │
│ │                   +3500.00€ │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Key Features
- **Summary Cards**: Two cards showing total income (green border) and expenses (red border)
- **Filter Tabs**: Three tabs for All/Income/Expenses
  - Active: Neon-green background with black text
  - Inactive: Gray background with gray text
- **Transaction Cards**: Individual cards per transaction
  - Credit: Green circular icon
  - Debit: Gray circular icon
- **Metadata**: Calendar and tag icons with dates/categories
- **Animation**: Fade animation when switching filters
- **Haptics**: Light impact on filter change

### 4. Receipt Screen (`app/receipt.tsx`)

#### Layout Structure
```
┌─────────────────────────────────┐
│ Receipt                          │
│ Transaction details              │
├─────────────────────────────────┤
│ ╔═════════════════════════════╗ │
│ ║       🚲                    ║ │
│ ║ Helsinki eBike Service Oy   ║ │
│ ║       Yritystili            ║ │
│ ║                             ║ │
│ ║   ✓ COMPLETED               ║ │
│ ║ ─────────────────────────── ║ │
│ ║      Amount                 ║ │
│ ║      -15.90 €               ║ │
│ ║ ─────────────────────────── ║ │
│ ║ Transaction ID: #00000001   ║ │
│ ║ Date: Nov 5, 2025 14:30     ║ │
│ ║ Description: eBike Day Pass ║ │
│ ║ Recipient: Helsinki eBike   ║ │
│ ║ Category: Transport         ║ │
│ ║                             ║ │
│ ║      [QR CODE]              ║ │
│ ║    Scan to verify           ║ │
│ ╚═════════════════════════════╝ │
├─────────────────────────────────┤
│ [Share] [Download] [Print]      │
└─────────────────────────────────┘
```

#### Key Features
- **Receipt Card**: Large gradient card with border
- **Company Logo**: Circular neon-green bordered icon
- **Status Badge**: Green checkmark with rounded pill background
- **Detail Rows**: Two-column layout for transaction details
- **QR Code**: Placeholder for verification code
- **Action Buttons**: Three equal-width buttons for share/download/print
- **Haptics**: Medium impact on share, success notification on download

## Typography

### Font Sizes
- **XXXL**: 48px - Large amounts
- **XXL**: 32px - Primary amounts
- **XL**: 24px - Section headers
- **LG**: 18px - Screen titles
- **MD**: 16px - Body text
- **SM**: 14px - Secondary text
- **XS**: 12px - Metadata, labels

### Font Weights
- **700 (Bold)**: Titles, amounts, CTAs
- **600 (Semi-bold)**: Section headers, labels
- **400 (Regular)**: Body text

## Spacing System
Based on 8px grid:
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

## Border Radius
- **SM**: 8px - Small cards, buttons
- **MD**: 12px - Input fields
- **LG**: 16px - Large cards
- **XL**: 24px - Modal headers
- **Full**: 999px - Circular elements

## Shadows & Elevation
All shadows use neon-green tint for brand consistency:
- **Small**: 2px offset, 0.1 opacity, 4px radius
- **Medium**: 4px offset, 0.15 opacity, 8px radius
- **Large**: 8px offset, 0.2 opacity, 16px radius

## Animations

### Scale Animation
- Used for: Button presses, card interactions
- Duration: 100ms down, 100ms up
- Scale: 0.95 → 1.0

### Fade Animation
- Used for: Content switching (filters)
- Duration: 150ms out, 150ms in
- Opacity: 1.0 → 0.3 → 1.0

### Slide Animation
- Used for: Screen transitions (Expo Router)
- Duration: 300ms
- Easing: Default platform easing

## Haptic Feedback

### Impact Styles
- **Light**: Navigation, list items, filter changes
- **Medium**: Primary actions, quick actions
- **Heavy**: Not used (avoid fatigue)

### Notification Styles
- **Success**: Payment sent, download complete
- **Warning**: Not used currently
- **Error**: Not used currently

## Icons
Using Ionicons from @expo/vector-icons:
- **Home**: home, bicycle, send, download, swap-horizontal, wallet
- **Payment**: send, person, cash, chatbox
- **Statement**: trending-up, trending-down, calendar, pricetag
- **Receipt**: bicycle, checkmark-circle, qr-code, share, download, print
- **Navigation**: arrow-up, arrow-down, arrow-forward

## Tab Bar
- **Background**: Gray (#1A1A1A)
- **Border**: Light gray top border
- **Active Color**: Neon green
- **Inactive Color**: Text secondary
- **Height**: 85px (iOS), 65px (Android)
- **Icons**: 24px, labels 12px semi-bold

## Responsive Design
- Safe area support for notched devices
- Keyboard avoiding for input forms
- ScrollView for all content to handle different screen sizes
- Platform-specific adjustments (iOS vs Android)

## Accessibility Considerations
- High contrast ratios (white on black)
- Touch targets: 44-56px minimum
- Clear visual hierarchy
- Icon + text labels for all actions
- Haptic feedback for touch confirmation

## Performance Optimizations
- React.useRef for animations
- Animated.Value for smooth 60fps animations
- Native driver enabled for transforms
- Lazy loading not needed (offline data)
- Optimized re-renders with React.memo potential

## Brand Identity
- **Company**: Helsinki eBike Service Oy
- **Product**: Yritystili
- **Icon**: Bicycle (🚲)
- **Tagline**: Implied sustainable, urban mobility
- **Accent**: Neon green suggests electric/eco-friendly
