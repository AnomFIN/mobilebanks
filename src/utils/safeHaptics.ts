import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Safe wrapper around expo-haptics that no-ops on web or when APIs are missing.
export async function impactAsync(style: any) {
  try {
    if (Platform.OS === 'web') return;
    if (!Haptics || typeof Haptics.impactAsync !== 'function') return;
    return await Haptics.impactAsync(style);
  } catch (e) {
    // swallow errors — haptics should be non-fatal
    // console.debug('haptics impact failed', e);
  }
}

export async function notificationAsync(type: any) {
  try {
    if (Platform.OS === 'web') return;
    if (!Haptics || typeof Haptics.notificationAsync !== 'function') return;
    return await Haptics.notificationAsync(type);
  } catch (e) {
    // swallow errors
    // console.debug('haptics notification failed', e);
  }
}

export default {
  impactAsync,
  notificationAsync,
};
