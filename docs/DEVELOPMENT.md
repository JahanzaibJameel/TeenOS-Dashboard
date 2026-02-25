# TeenOS Development Guide

## Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Git Workflow](#git-workflow)
7. [Debugging](#debugging)
8. [Performance Monitoring](#performance-monitoring)

## Development Environment Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 8+ or yarn 1.22+
- Git 2.30+
- Code editor (VS Code recommended)
- Browser (Chrome/Firefox with developer tools)

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.live-server"
  ]
}
```

### Environment Setup
```bash
# Clone repository
git clone https://github.com/your-org/teenos.git
cd teenos

# Install dependencies
npm install

# Install husky hooks
npm run prepare

# Start development server
npm run dev
```

### Environment Variables
Create `.env.local`:
```env
# Development settings
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG=true

# Feature flags
VITE_FEATURE_AUTH=true
VITE_FEATURE_GOALS=true
VITE_FEATURE_FINANCE=true

# Analytics
VITE_ANALYTICS_DEBUG=true
```

## Project Structure

### Domain Structure
```
src/domains/
├── [domain-name]/
│   ├── components/        # React components
│   ├── services/          # Business logic
│   ├── data/              # State management
│   ├── types/             # TypeScript interfaces
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── tests/             # Domain-specific tests
│   ├── ui/                # UI components
│   └── README.md          # Domain documentation
```

### Core Directories
```
src/
├── domains/               # Bounded contexts
├── shared/                # Shared utilities
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   └── types/             # Shared types
├── infrastructure/        # Cross-cutting concerns
│   ├── api/               # API clients
│   ├── storage/           # Storage services
│   ├── analytics/         # Analytics services
│   └── security/          # Security utilities
├── routes/                # Application routing
├── assets/                # Static assets
└── styles/                # Global styles
```

## Development Workflow

### Daily Development
```bash
# 1. Start development server
npm run dev

# 2. Run tests in watch mode
npm run test:watch

# 3. Check type safety
npm run type-check

# 4. Lint code
npm run lint

# 5. Format code
npm run format
```

### Creating New Features
1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Implement functionality**: Following coding standards
3. **Write tests**: Unit and integration tests
4. **Documentation**: Update README if needed
5. **Code review**: Submit pull request
6. **Deployment**: Merge to develop branch

### Domain Development Pattern
```typescript
// 1. Define types
interface UserGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: Date;
}

// 2. Create service
class GoalService {
  static async createGoal(goal: Omit<UserGoal, 'id'>): Promise<UserGoal> {
    // Implementation
  }
}

// 3. Create state management
const useGoalsStore = create<GoalsState>()(
  persist((set, get) => ({
    goals: [],
    addGoal: (goal) => set((state) => ({
      goals: [...state.goals, goal]
    }))
  }), { name: 'goals-storage' })
);

// 4. Create components
const GoalForm: React.FC<GoalFormProps> = ({ onSuccess }) => {
  // Component implementation
};

// 5. Create hooks
const useGoals = () => {
  const { goals, addGoal } = useGoalsStore();
  const queryClient = useQueryClient();
  
  const createGoal = useMutation({
    mutationFn: GoalService.createGoal,
    onSuccess: (newGoal) => {
      addGoal(newGoal);
      queryClient.invalidateQueries(['goals']);
      onSuccess?.();
    }
  });
  
  return { goals, createGoal };
};
```

## Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good: Strict typing
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

// ❌ Avoid: Loose typing
interface UserProfile {
  id: any;
  firstName: string | null;
  lastName: string;
  email: string;
  [key: string]: any;
}

// ✅ Good: Type-safe functions
const calculateProgress = (current: number, target: number): number => {
  return Math.min(100, (current / target) * 100);
};

// ✅ Good: Explicit return types
const useUserData = (): { user: User | null; loading: boolean } => {
  // Implementation
};
```

### React Patterns
```typescript
// ✅ Good: Component composition
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  <div className={`card ${className}`}>
    <h3 className="card-title">{title}</h3>
    <div className="card-content">{children}</div>
  </div>
);

// ✅ Good: Custom hooks
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// ✅ Good: Error boundaries
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### CSS/SASS Guidelines
```scss
// ✅ Good: BEM naming convention
.user-card {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  &__name {
    font-weight: 600;
    color: var(--text-primary);
  }
}

// ✅ Good: CSS variables
:root {
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
}

// ✅ Good: Responsive mixins
@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 768px) { @content; }
  }
  @if $breakpoint == tablet {
    @media (max-width: 1024px) { @content; }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1025px) { @content; }
  }
}

.component {
  @include responsive(mobile) {
    flex-direction: column;
  }
}
```

## Testing Guidelines

### Test Structure
```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoalForm } from './GoalForm';

const queryClient = new QueryClient();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('GoalForm', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should render form fields', () => {
    renderWithProviders(<GoalForm onSuccess={vi.fn()} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target date/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const onSuccess = vi.fn();
    renderWithProviders(<GoalForm onSuccess={onSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Learn React' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

### Service Testing
```typescript
import { FinanceService } from './FinanceService';
import { mockFinanceData } from './__mocks__/financeData';

describe('FinanceService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('calculateSummary', () => {
    it('should calculate correct financial summary', () => {
      const summary = FinanceService.getFinancialSummary('user123');
      
      expect(summary.totalIncome).toBe(2000);
      expect(summary.totalExpenses).toBe(1500);
      expect(summary.netBalance).toBe(500);
    });
  });

  describe('getSpendingByCategory', () => {
    it('should return spending grouped by category', () => {
      const spending = FinanceService.getSpendingByCategory('user123');
      
      expect(spending).toEqual({
        'Food': 500,
        'Transport': 300,
        'Entertainment': 200
      });
    });
  });
});
```

## Git Workflow

### Branch Naming Convention
```
feature/add-user-authentication
bug/fix-login-redirect
hotfix/critical-security-patch
refactor/improve-goal-components
docs/update-architecture-diagrams
```

### Commit Message Format
```bash
# Conventional commits
feat: add financial goal tracking
fix: resolve authentication token refresh issue
docs: update development guidelines
style: format code according to prettier rules
refactor: restructure habit domain components
test: add comprehensive finance service tests
chore: update dependencies
perf: optimize dashboard rendering performance
```

### Pull Request Process
1. **Branch Protection**: `main` and `develop` branches are protected
2. **Code Review**: At least one reviewer required
3. **Status Checks**: All CI checks must pass
4. **Merge Strategy**: Squash and merge to maintain clean history
5. **Release Notes**: Automatic generation from conventional commits

### Git Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Debugging

### Development Tools
```typescript
// Debug logging
const debug = (namespace: string) => {
  return (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG][${namespace}]`, message, ...args);
    }
  };
};

const authDebug = debug('auth');
authDebug('Login attempt', { email: 'user@example.com' });

// Error tracking
const reportError = (error: Error, context: string) => {
  if (import.meta.env.MODE === 'development') {
    console.error(`[ERROR][${context}]`, error);
  } else {
    // Send to error tracking service
    Sentry.captureException(error, {
      contexts: { context }
    });
  }
};
```

### Browser Debugging
```javascript
// React DevTools
// Install React Developer Tools extension

// Redux DevTools (if using Redux)
// Install Redux DevTools extension

// Performance monitoring
console.time('component-render');
// Component rendering code
console.timeEnd('component-render');

// Memory profiling
console.profile('memory-test');
// Code to profile
console.profileEnd('memory-test');
```

### Network Debugging
```typescript
// API request debugging
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// Add request/response interceptors for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);
```

## Performance Monitoring

### Performance Metrics
```typescript
// Core Web Vitals monitoring
const measureWebVitals = () => {
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.name) {
          case 'LCP':
            console.log('Largest Contentful Paint:', entry.startTime);
            break;
          case 'FID':
            console.log('First Input Delay:', entry.processingStart - entry.startTime);
            break;
          case 'CLS':
            console.log('Cumulative Layout Shift:', entry.value);
            break;
        }
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
};

// Custom performance metrics
const measureComponentRender = (componentName: string) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    console.log(`${componentName} render time: ${duration}ms`);
    
    // Report to analytics
    if (duration > 16) { // > 1 frame at 60fps
      reportPerformanceIssue(componentName, duration);
    }
  };
};
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check individual module sizes
npx bundlephobia [package-name]

# Webpack bundle analyzer
npm run build -- --stats
npx webpack-bundle-analyzer dist/stats.json
```

### Memory Leak Detection
```typescript
// Memory leak detection utility
class MemoryLeakDetector {
  private trackedObjects = new Map<string, WeakRef<object>>();
  private cleanupCallbacks = new Set<() => void>();

  track<T extends object>(key: string, obj: T): T {
    this.trackedObjects.set(key, new WeakRef(obj));
    return obj;
  }

  addCleanup(callback: () => void) {
    this.cleanupCallbacks.add(callback);
  }

  cleanup() {
    this.cleanupCallbacks.forEach(callback => callback());
    this.cleanupCallbacks.clear();
    this.trackedObjects.clear();
  }

  getStats() {
    let aliveCount = 0;
    this.trackedObjects.forEach((ref, key) => {
      if (ref.deref()) aliveCount++;
    });
    return { total: this.trackedObjects.size, alive: aliveCount };
  }
}

// Usage
const detector = new MemoryLeakDetector();
const trackedComponent = detector.track('MyComponent', componentInstance);
```

---

*This development guide is continuously updated based on team feedback and evolving best practices. Please contribute improvements and suggestions.*