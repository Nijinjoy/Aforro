import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { CartScreen } from './src/screens/CartScreen';
import { ReviewCartScreen } from './src/screens/ReviewCartScreen';
import { CartFlowProvider, useCartFlow } from './src/store/CartFlowProvider';

function AppContent() {
  const {
    actions: { navigate },
    state: { screen },
  } = useCartFlow();

  return screen === 'cart' ? (
    <CartScreen onReviewCart={() => navigate('review-cart')} />
  ) : (
    <ReviewCartScreen onBack={() => navigate('cart')} />
  );
}

function App() {
  useEffect(() => {
    Feather.loadFont();
  }, []);

  return (
    <SafeAreaProvider>
      <CartFlowProvider>
        <StatusBar barStyle="dark-content" />
        <AppContent />
      </CartFlowProvider>
    </SafeAreaProvider>
  );
}

export default App;
