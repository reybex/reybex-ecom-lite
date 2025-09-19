# Reybex Mini E-Commerce

A modern, responsive e-commerce management application built with Vue.js 3, featuring multi-language support, iframe integration, and SOLID architecture principles.

## 🚀 Features

- **Multi-language Support**: Turkish, English, and German localization
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Iframe Integration**: Seamless integration with parent applications
- **Real-time Data**: Live updates for orders, products, and statistics
- **Advanced Filtering**: Search and filter capabilities for products and orders
- **Dashboard Analytics**: Comprehensive business insights and statistics
- **SOLID Architecture**: Clean, maintainable, and extensible codebase

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3.4.21
- **State Management**: Pinia 2.1.7
- **Routing**: Vue Router 4.3.0
- **Styling**: Tailwind CSS 3.4.1
- **HTTP Client**: Axios 1.6.7
- **Icons**: Heroicons 2.0.18
- **Build Tool**: Vite 5.1.4

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Navigation header
│   ├── EmptyState.vue  # Empty state component
│   ├── LoadingSpinner.vue
│   ├── OrderCard.vue   # Order card component
│   └── Pagination.vue  # Pagination component
├── composables/        # Vue 3 composables
│   ├── useAuth.js      # Authentication logic
│   ├── useFilters.js   # Filtering functionality
│   └── usePagination.js # Pagination logic
├── interfaces/         # TypeScript-like interfaces
│   ├── IAuthService.js # Auth service interface
│   └── IDataService.js # Data service interface
├── locales/           # Internationalization files
│   ├── tr.json        # Turkish translations
│   ├── en.json        # English translations
│   └── de.json        # German translations
├── services/          # API services
│   ├── api.js         # Axios configuration
│   ├── BaseService.js # Base service class
│   ├── MaterialService.js # Material operations
│   └── OrderService.js # Order operations
├── stores/            # Pinia stores
│   ├── auth.js        # Authentication store
│   ├── i18n.js        # Internationalization store
│   ├── material.js    # Material management
│   └── order.js       # Order management
├── utils/             # Utility functions
│   ├── constants.js   # Application constants
│   ├── formatters.js  # Data formatting utilities
│   ├── marketplace.js # Marketplace utilities
│   └── validators.js  # Validation utilities
└── views/             # Page components
    ├── Dashboard.vue  # Main dashboard
    ├── Login.vue      # Login page
    ├── MaterialList.vue # Product listing
    ├── MaterialDetail.vue # Product details
    ├── OrderList.vue  # Order listing
    └── OrderDetail.vue # Order details
```

## 🏗️ Architecture Principles

This project follows SOLID principles for maintainable and scalable code:

### Single Responsibility Principle (SRP)
- Each component has a single, well-defined responsibility
- Utility functions are separated by concern (formatting, validation, etc.)
- Services handle specific domain operations

### Open/Closed Principle (OCP)
- Base service class allows extension without modification
- Composable functions can be extended for new features
- Component architecture supports easy enhancement

### Liskov Substitution Principle (LSP)
- Service implementations can be substituted without breaking functionality
- Interface contracts ensure consistent behavior

### Interface Segregation Principle (ISP)
- Focused composables for specific functionality
- Small, targeted interfaces for different concerns
- No fat interfaces that force unnecessary dependencies

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions
- Service interfaces define contracts
- Dependency injection through composables

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/reybex/reybex-ecom-lite.git
cd reybex-ecom-lite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Internationalization

The application supports three languages:
- 🇹🇷 Turkish (default)
- 🇺🇸 English  
- 🇩🇪 German

Language switching is available in the header navigation. User preferences are saved in localStorage.

### Adding New Languages

1. Create a new JSON file in `src/locales/` (e.g., `fr.json`)
2. Add the language to the `locales` object in `src/stores/i18n.js`
3. Include the language in the header selector

## 🔧 Configuration

### API Configuration

Update `src/utils/constants.js` to configure API endpoints:

```javascript
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
}
```

### Iframe Integration

The application supports iframe integration with parent applications:

1. **Token Passing**: Pass authentication token via URL parameter
2. **Message Communication**: Use postMessage API for cross-frame communication
3. **Parent Window Detection**: Automatic detection of iframe context

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

## 🎨 Styling

The project uses Tailwind CSS with custom components defined in `src/assets/main.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style
- `.input-field` - Form input style
- `.table-header` - Table header style
- `.table-cell` - Table cell style

## 🔐 Authentication

The application supports multiple authentication methods:

1. **Direct Login**: Username/password authentication
2. **Iframe Token**: Token passed from parent application
3. **URL Token**: Token passed via URL parameter

## 📊 Dashboard Features

- **Statistics Cards**: Total products, active products, low stock, open orders
- **Marketplace Analytics**: Performance metrics by marketplace
- **Order Management**: View and manage orders with filtering
- **Product Management**: Comprehensive product listing and details

## 🛒 Order Management

- **Order Listing**: Paginated order list with advanced filtering
- **Order Details**: Comprehensive order information and items
- **Status Tracking**: Real-time order status updates
- **Payment Status**: Payment tracking and management

## 📦 Product Management

- **Product Listing**: Searchable and filterable product catalog
- **Product Details**: Detailed product information and editing
- **Stock Management**: Inventory tracking and alerts
- **Marketplace Integration**: Multi-marketplace product management

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@reybex.com or create an issue in this repository.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
- All contributors who helped make this project better

---

**Made with ❤️ by the Reybex Team**
