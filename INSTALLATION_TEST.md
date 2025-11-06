# Installation Test Checklist

Follow these steps to verify the app is correctly set up:

## Prerequisites
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Expo Go app on mobile device

## Installation Steps

### 1. Clone and Install
```bash
git clone https://github.com/AnomFIN/mobilebanks.git
cd mobilebanks
npm install
```

Expected output: 
- ✅ ~830 packages installed
- ✅ No errors
- ✅ 0 vulnerabilities

### 2. TypeScript Check
```bash
npx tsc --noEmit
```

Expected output:
- ✅ No errors
- ✅ Silent success

### 3. Check Dependencies
```bash
npm list --depth=0
```

Expected packages:
- ✅ expo ~54.0.22
- ✅ expo-router ^6.0.14
- ✅ expo-haptics ^15.0.7
- ✅ expo-linear-gradient ^15.0.7
- ✅ react-native-reanimated ^4.1.3
- ✅ react 19.1.0
- ✅ react-native 0.81.5

### 4. Start Development Server
```bash
npm start
```

Expected output:
- ✅ Metro bundler starts
- ✅ QR code appears
- ✅ No errors in console

### 5. Open in Expo Go
- [ ] Scan QR code with Expo Go (Android)
- [ ] Scan QR code with Camera (iOS)

Expected result:
- ✅ App opens successfully
- ✅ Home screen loads
- ✅ Dark theme with black background
- ✅ Neon-green accents visible

### 6. Test Navigation
- [ ] Tap Payment tab
- [ ] Tap Statement tab
- [ ] Tap Receipt tab
- [ ] Return to Home tab

Expected result:
- ✅ All tabs navigate smoothly
- ✅ Tab bar shows green active state
- ✅ Content loads on each screen

### 7. Test Interactions (on physical device)
- [ ] Tap balance card on Home
- [ ] Tap quick action button
- [ ] Tap transaction in list
- [ ] Select contact on Payment screen
- [ ] Tap quick amount button
- [ ] Change filter on Statement screen
- [ ] Tap Share on Receipt screen

Expected result:
- ✅ Haptic feedback on each tap
- ✅ Animations play smoothly
- ✅ UI responds immediately

### 8. Test Features

#### Home Screen
- [ ] Balance displays correctly (€12,847.50)
- [ ] Account number shows (FI21 1234 5678 9012 34)
- [ ] Recent transactions list shows 5 items
- [ ] Quick actions show 4 buttons
- [ ] Balance card has gradient background
- [ ] Profile icon visible

#### Payment Screen
- [ ] Balance shows at top
- [ ] 4 quick contacts visible
- [ ] Can select contact (turns green)
- [ ] Amount field accepts input
- [ ] Quick amount buttons work (10, 25, 50, 100)
- [ ] Message field optional
- [ ] Send button visible and styled

#### Statement Screen
- [ ] Income card shows total (+4,350.00 €)
- [ ] Expense card shows total (-330.15 €)
- [ ] Filter tabs work (All, Income, Expenses)
- [ ] Transaction list shows all 10 items
- [ ] Transactions have icons, dates, categories
- [ ] Amounts color-coded correctly

#### Receipt Screen
- [ ] Company logo visible (bicycle icon)
- [ ] Status badge shows "COMPLETED"
- [ ] Amount displayed prominently
- [ ] All transaction details visible
- [ ] QR code placeholder shown
- [ ] Three action buttons visible
- [ ] Share dialog opens

### 9. Visual Verification

Check these design elements:
- [ ] Background is pure black (#000000)
- [ ] Text is white (#FFFFFF)
- [ ] Accents are neon-green (#00FFAE)
- [ ] Cards have dark gray background
- [ ] Shadows have green glow
- [ ] Icons are neon-green or white
- [ ] Tab bar has dark gray background
- [ ] Smooth rounded corners on cards
- [ ] Proper spacing throughout

### 10. Documentation Check
- [ ] README.md exists and is readable
- [ ] SETUP.md has installation instructions
- [ ] UI_DESIGN.md has design documentation
- [ ] FEATURES.md has feature details
- [ ] VISUAL_MOCKUPS.md has screen mockups
- [ ] PROJECT_SUMMARY.md has project overview

## Troubleshooting

### Issue: npm install fails
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: TypeScript errors
**Solution:**
```bash
# Check that types/vector-icons.d.ts exists
ls types/
# Should show: vector-icons.d.ts

# Re-run type check
npx tsc --noEmit
```

### Issue: Metro bundler won't start
**Solution:**
```bash
# Clear cache
npx expo start -c

# Or completely reset
rm -rf node_modules .expo
npm install
npm start
```

### Issue: Haptics not working
**Note:** Haptics only work on physical devices, not simulators or web.

### Issue: App won't load on device
**Solutions:**
1. Ensure device and computer on same WiFi
2. Try tunnel mode: `npx expo start --tunnel`
3. Check Expo Go app is updated
4. Restart Expo Go app

## Success Criteria

✅ All checkboxes above marked  
✅ No errors in console  
✅ App loads and navigates smoothly  
✅ Haptics work on physical device  
✅ Visual design matches mockups  
✅ All 4 screens functional  

## Expected Test Results

- **TypeScript**: ✅ 0 errors
- **Security**: ✅ 0 vulnerabilities  
- **Build**: ✅ Successful
- **Runtime**: ✅ No crashes
- **Navigation**: ✅ All tabs work
- **Animations**: ✅ Smooth 60fps
- **Haptics**: ✅ Tactile feedback
- **Design**: ✅ Matches specifications

## Performance Expectations

- **App Launch**: < 3 seconds
- **Screen Transition**: < 300ms
- **Animation**: 60fps
- **Haptic Response**: Immediate
- **Memory Usage**: < 150MB
- **Bundle Size**: ~50MB

## Final Verification

After completing all steps above, the app should:
1. ✅ Launch without errors
2. ✅ Display all 4 screens
3. ✅ Navigate smoothly between tabs
4. ✅ Show neon-green accents throughout
5. ✅ Provide haptic feedback (on device)
6. ✅ Display mock data correctly
7. ✅ Match the premium fintech design
8. ✅ Feel responsive and polished

---

**If all checks pass:** ✅ Installation successful! App is ready to use.

**If any checks fail:** See Troubleshooting section above or check documentation.
