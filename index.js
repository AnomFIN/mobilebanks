// index.js
// This uses Expo's registerRootComponent which ensures the component is registered
// correctly with AppRegistry as "main" (fixes the Invariant Violation).
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);