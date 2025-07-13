# Token Tracker Native - React Native Web3 App

A comprehensive React Native mobile application for tracking Ethereum wallet balances, token holdings, and portfolio value with real-time price data from CoinGecko API.

## 🚀 Features

### Core Functionality
- **Wallet Connection**: Secure Ethereum wallet connection via WalletConnect
- **Portfolio Dashboard**: Real-time display of ETH balance and token holdings
- **Token Details**: Detailed view of individual tokens with price charts and market data
- **Send Tokens**: Send ETH and ERC20 tokens with transaction confirmation
- **Real-time Prices**: Live price data from CoinGecko API
- **Portfolio Analytics**: Total portfolio value calculation and performance tracking

### Screens
1. **Connect Wallet Screen**: Modern UI for wallet connection with loading states
2. **Dashboard Screen**: Portfolio overview with ETH balance, token list, and total value
3. **Token Detail Screen**: Detailed token information with price charts and market stats
4. **Send Token Screen**: Transaction interface with address validation and gas estimation

## 🛠 Tech Stack

- **React Native** with Expo Router
- **TypeScript** for type safety
- **Ethers.js** for Ethereum interaction
- **WalletConnect** for wallet connection
- **CoinGecko API** for real-time token prices
- **React Native Paper** for UI components
- **Expo Vector Icons** for icons

## 📱 Screenshots

### Connect Wallet Screen
- Modern dark theme design
- Feature highlights with icons
- Loading states and error handling
- Secure wallet connection flow

### Dashboard Screen
- Portfolio value summary
- ETH balance display
- Token list with balances and USD values
- Quick action buttons
- Pull-to-refresh functionality

### Token Detail Screen
- Current price and 24h change
- Balance and USD value
- Market statistics (volume, market cap)
- Price chart placeholder
- Etherscan integration

### Send Token Screen
- Token selection interface
- Address validation
- Amount input with MAX button
- Gas estimation
- Transaction confirmation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tokenTrackerNative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Web3 dependencies** (when network is available)
   ```bash
   npm install ethers@^6.11.1 @walletconnect/web3-provider@^2.11.2 axios@^1.6.7 react-native-paper@^5.12.3 react-native-vector-icons@^10.0.3 @react-native-async-storage/async-storage@^1.21.0
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🔧 Configuration

### API Keys
The app uses CoinGecko API which is free and doesn't require an API key. For production use, consider:

1. **CoinGecko Pro API** for higher rate limits
2. **WalletConnect Project ID** for production wallet connections
3. **Etherscan API Key** for enhanced transaction data

### Environment Variables
Create a `.env` file in the root directory:

```env
# Optional: CoinGecko API Key (for higher rate limits)
COINGECKO_API_KEY=your_api_key_here

# Optional: WalletConnect Project ID
WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Etherscan API Key
ETHERSCAN_API_KEY=your_api_key_here
```

## 📁 Project Structure

```
app/
├── _layout.tsx              # Root navigation layout
├── index.tsx                # Connect wallet screen
├── dashboard.tsx            # Portfolio dashboard
├── token-detail.tsx         # Token detail screen
├── send-token.tsx           # Send token screen
└── utils/
    └── api.ts              # API utilities and Web3 functions
```

## 🔌 API Integration

### CoinGecko API
- **Base URL**: `https://api.coingecko.com/api/v3`
- **Endpoints Used**:
  - Token prices: `/simple/token_price/ethereum`
  - ETH price: `/simple/price?ids=ethereum&vs_currencies=usd`

### Web3 Integration
- **Ethers.js**: For Ethereum blockchain interaction
- **WalletConnect**: For secure wallet connections
- **ERC20 Contracts**: For token balance queries

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Modern dark interface optimized for crypto apps
- **Color Palette**: Purple primary (#6366f1), green success (#10b981), red error (#ef4444)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Icons**: Consistent iconography using Expo Vector Icons

### User Experience
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: User-friendly error messages and retry options
- **Validation**: Real-time input validation for addresses and amounts
- **Accessibility**: Proper contrast ratios and touch targets

## 🔒 Security Features

- **Address Validation**: Ethereum address format validation
- **Transaction Confirmation**: Clear transaction details before sending
- **Secure Storage**: Wallet session data storage (AsyncStorage)
- **Error Boundaries**: Graceful error handling throughout the app

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection flow
- [ ] Dashboard data display
- [ ] Token detail navigation
- [ ] Send transaction flow
- [ ] Error handling scenarios
- [ ] Network connectivity issues
- [ ] Address validation
- [ ] Amount validation

### Automated Testing (Future)
- Unit tests for API functions
- Component testing with React Native Testing Library
- E2E testing with Detox

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### App Store Deployment
1. Configure app.json with proper metadata
2. Build production version
3. Submit to App Store Connect / Google Play Console

## 🔄 Future Enhancements

### Planned Features
- [ ] **Price Charts**: Integration with TradingView or custom charts
- [ ] **Push Notifications**: Price alerts and transaction notifications
- [ ] **Portfolio Analytics**: Historical performance and charts
- [ ] **Token Discovery**: Search and add new tokens
- [ ] **Multi-chain Support**: Support for other EVM chains
- [ ] **NFT Support**: Display and manage NFT collections
- [ ] **DeFi Integration**: Yield farming and staking features

### Technical Improvements
- [ ] **Offline Support**: Cache data for offline viewing
- [ ] **Performance Optimization**: Lazy loading and image optimization
- [ ] **Biometric Authentication**: Secure wallet access
- [ ] **Deep Linking**: Share wallet addresses and transactions
- [ ] **Widgets**: iOS/Android home screen widgets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko** for providing free crypto price data
- **WalletConnect** for secure wallet connection protocol
- **Ethers.js** team for Ethereum JavaScript library
- **Expo** team for the amazing React Native framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Join our community discussions

---

**Built with ❤️ for the Web3 community**
