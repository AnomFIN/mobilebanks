# Feature Documentation - Yritystili App

## App Overview
**Yritystili – Helsinki eBike Service Oy** is a premium mobile banking application built with Expo and React Native. It features a minimalist fintech UI with offline functionality, haptic feedback, and smooth animations.

## Core Features

### 1. Account Overview (Home Screen)
**File**: `app/index.tsx`

#### Features:
- **Real-time Balance Display**
  - Large, prominent balance in euros
  - Account number in monospace font
  - Gradient card with neon-green shadow effect

- **User Greeting**
  - Time-appropriate greeting
  - Company name display
  - Profile icon button

- **Quick Actions**
  - Send money
  - Request payment
  - Currency exchange
  - Top up account
  - Each with haptic feedback

- **Recent Transactions**
  - Shows last 5 transactions
  - Transaction direction indicators (↑ debit, ↓ credit)
  - Amount color-coded (green for credit, white for debit)
  - Formatted dates
  - "See All" link to Statement screen

#### Interactions:
- Tap profile icon: Opens profile (placeholder)
- Tap balance card: Scale animation with haptic feedback
- Tap transaction: Opens detail view with haptic feedback
- Tap quick action: Executes action with medium haptic feedback

### 2. New Payment
**File**: `app/payment.tsx`

#### Features:
- **Available Balance Widget**
  - Shows current balance before payment
  - Green-accented card

- **Quick Contact Selection**
  - Horizontal scrollable list of favorite contacts
  - Visual selection state (gray/green toggle)
  - Haptic feedback on selection

- **Payment Form**
  - Recipient field (name or account number)
  - Amount input with decimal support
  - Quick amount buttons (€10, €25, €50, €100)
  - Optional message field
  - Icon-prefixed input fields

- **Send Button**
  - Large, prominent CTA
  - Disabled state when form incomplete
  - Success animation and haptic feedback
  - Alert confirmation (mock)

#### Interactions:
- Select contact: Updates selection state with haptic feedback
- Tap quick amount: Fills amount field with haptic feedback
- Type in fields: Standard keyboard input
- Tap send: Success notification with scale animation

#### Validation:
- Recipient required
- Amount required
- No validation for amount vs balance (mock data)

### 3. Statement (Transaction History)
**File**: `app/statement.tsx`

#### Features:
- **Summary Cards**
  - Total income (green border)
  - Total expenses (red border)
  - Icons and formatted amounts
  - Calculated from all transactions

- **Filter Tabs**
  - All transactions
  - Income only
  - Expenses only
  - Active state with green background
  - Smooth fade animation on filter change

- **Transaction List**
  - All 10 mock transactions
  - Detailed card per transaction
  - Color-coded icons (green for credit, gray for debit)
  - Full date display
  - Category tags
  - Recipient information

#### Interactions:
- Tap filter: Changes view with fade animation and haptic feedback
- Tap transaction: Opens detail (placeholder) with haptic feedback

#### Data Display:
- Transaction title
- Formatted date (weekday, month, day, year)
- Category with icon
- Amount with color coding
- Recipient name

### 4. Receipt
**File**: `app/receipt.tsx`

#### Features:
- **Digital Receipt Card**
  - Company header with logo
  - Status badge (completed/pending/failed)
  - Large amount display
  - Gradient background with border
  - Professional layout

- **Transaction Details**
  - Transaction ID
  - Full timestamp
  - Description
  - Recipient
  - Category
  - Account number
  - Transaction type

- **QR Code**
  - Placeholder for verification
  - "Scan to verify" text

- **Action Buttons**
  - Share: Opens native share sheet
  - Download: Mock download with success notification
  - Print: Mock print with alert

- **Footer**
  - Official receipt notice
  - Record-keeping reminder

#### Interactions:
- Tap share: Opens native share dialog with receipt details
- Tap download: Shows success alert with haptic feedback
- Tap print: Shows coming soon alert

#### Data Source:
- Currently shows most recent transaction (mockTransactions[0])
- Can be modified to show any transaction

## Navigation

### Tab Navigation
Implemented with Expo Router tabs:
- **Home** (index): House icon
- **Payment**: Send icon
- **Statement**: List icon
- **Receipt**: Document icon

#### Tab Bar Styling:
- Dark gray background
- Green active state
- Gray inactive state
- Icon + label
- Platform-specific height adjustments

### Screen Transitions:
- Smooth slide animations (default Expo Router)
- Maintained state between tab switches

## Mock Data Structure

### Account Data
**File**: `mockData.ts`

```typescript
{
  balance: 12847.50,
  accountNumber: 'FI21 1234 5678 9012 34',
  currency: 'EUR'
}
```

### Transaction Data
**File**: `mockData.ts`

10 sample transactions including:
- eBike rentals and subscriptions
- Salary deposits
- Shopping expenses
- Restaurant bills
- Gym memberships
- Freelance income
- Utility bills

Each transaction includes:
- Unique ID
- Title/description
- Amount (positive for credit, negative for debit)
- ISO date string
- Category
- Status (completed/pending/failed)
- Recipient name
- Type (credit/debit)

## Type Definitions
**File**: `types.ts`

### Transaction Interface
```typescript
interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  type: 'debit' | 'credit';
}
```

### Account Interface
```typescript
interface Account {
  balance: number;
  accountNumber: string;
  currency: string;
}
```

## Utility Functions

### Currency Formatting
```typescript
formatCurrency(amount: number): string
```
- Adds sign prefix (+ or -)
- Fixed 2 decimal places
- Appends € symbol
- Example: `formatCurrency(-15.90)` → "-15.90 €"

### Date Formatting
Multiple formats used:
1. **Short**: "Nov 5" (Home screen)
2. **Medium**: "Mon, Nov 5, 2025" (Statement)
3. **Full**: "Monday, November 5, 2025, 14:30" (Receipt)

All use Finnish locale (`en-FI`) for proper formatting.

## Animations

### Scale Animation
Used for button presses and interactive cards:
- Created with `useRef(new Animated.Value(1))`
- Sequence: 1 → 0.95 → 1
- Duration: 100ms each phase
- Native driver enabled

### Fade Animation
Used for content filtering:
- Created with `useRef(new Animated.Value(1))`
- Sequence: 1 → 0.3 → 1
- Duration: 150ms each phase
- Native driver enabled

## Haptic Feedback

### Implementation
Using `expo-haptics` library

### Feedback Types:
1. **Light Impact**
   - Navigation taps
   - List item selection
   - Filter changes

2. **Medium Impact**
   - Primary action buttons
   - Quick actions
   - Share/Print actions

3. **Success Notification**
   - Payment sent
   - Download complete

## Offline Functionality

### Data Storage
- All data in `mockData.ts`
- No network requests
- No persistent storage (resets on app restart)

### Advantages:
- Works without internet
- Instant responses
- No loading states
- Perfect for demos

### Limitations:
- Data not persisted
- No real transactions
- No sync across devices

## Platform Considerations

### iOS
- Tab bar height: 85px (includes safe area)
- Courier font for account numbers
- Proper safe area insets

### Android
- Tab bar height: 65px
- Monospace font for account numbers
- Edge-to-edge support

### Web (if enabled)
- Responsive layout
- Mouse hover states available
- Keyboard navigation support

## Dependencies

### Core
- **expo**: ~54.0.22
- **react**: 19.1.0
- **react-native**: 0.81.5

### Navigation
- **expo-router**: ^6.0.14
- **react-native-screens**: ^4.18.0
- **react-native-safe-area-context**: ^5.6.2

### UI/UX
- **expo-haptics**: ^15.0.7
- **expo-linear-gradient**: ^15.0.7
- **react-native-reanimated**: ^4.1.3
- **@expo/vector-icons**: (included with expo)

### Development
- **typescript**: ~5.9.2
- **@types/react**: ~19.1.0
- **babel-preset-expo**: (auto-installed)

## Performance

### Optimizations:
- Native driver for animations
- ScrollView with showsVerticalScrollIndicator={false}
- useRef for animation values (no re-renders)
- Minimal re-renders (no complex state management needed)

### Bundle Size:
- Optimized with Expo's built-in optimizations
- No unnecessary dependencies
- Tree-shaking enabled

## Security Considerations

### Current State (Mock App):
- No real authentication
- No encrypted storage
- No API tokens
- No sensitive data transmission

### For Production:
Would need:
- Biometric authentication
- Encrypted local storage
- Secure API communication (HTTPS)
- Token management
- PIN/password protection
- Transaction signing
- Account verification

## Testing Strategy

### Manual Testing:
1. Navigate between all tabs
2. Test all button interactions
3. Verify haptic feedback
4. Check animations
5. Test form inputs
6. Verify data display
7. Test share functionality

### Areas to Test:
- Tab navigation
- Quick actions
- Payment form validation
- Filter switching
- Date formatting
- Currency formatting
- Receipt generation
- Share dialog

## Future Enhancements

### Potential Features:
1. Biometric login
2. Push notifications
3. Card management
4. Budget tracking
5. Bill payments
6. Recurring payments
7. Transaction search
8. Export statements
9. Multi-currency support
10. Dark/light theme toggle

### Technical Improvements:
1. Real backend integration
2. Offline-first with sync
3. Unit tests
4. E2E tests
5. Analytics integration
6. Error tracking
7. Performance monitoring
8. A/B testing setup

## Troubleshooting

### Common Issues:

1. **App won't start**
   - Run `npm install`
   - Clear Metro bundler cache: `npx expo start -c`

2. **TypeScript errors**
   - Check `types/vector-icons.d.ts` exists
   - Run `npx tsc --noEmit`

3. **Animation issues**
   - Ensure react-native-reanimated is properly configured
   - Check babel.config.js has reanimated plugin

4. **Haptics not working**
   - Only works on physical devices
   - Not supported in simulators/web

## Conclusion

This app demonstrates:
✅ Modern React Native development
✅ Premium UI/UX design
✅ Smooth animations and haptics
✅ Proper TypeScript typing
✅ Offline-first architecture
✅ Professional code organization
✅ Investor-ready presentation

Perfect for showcasing mobile banking capabilities and design skills.
