import { type ReactNode, useEffect } from 'react';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Inspired from '@/components/turki-page/Inspired';
import AdminInbox from '@/components/turki-page/AdminInbox';
import AdminPosts from '@/components/turki-page/AdminPosts';
import AdminAppearance from '@/components/turki-page/AdminAppearance';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function Home() {
  return <Inspired />;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin/inbox" component={AdminInbox} />
        <Route path="/admin/posts" component={AdminPosts} />
        <Route path="/admin/appearance" component={AdminAppearance} />
        <Route
          path="/sign-in/*?"
          component={() => (
            <div className="auth-page">
              <SignIn
                routing="path"
                path={`${basePath}/sign-in`}
                signUpUrl={`${basePath}/sign-up`}
                fallbackRedirectUrl={`${basePath}/admin/inbox`}
              />
            </div>
          )}
        />
        <Route
          path="/sign-up/*?"
          component={() => (
            <div className="auth-page">
              <SignUp
                routing="path"
                path={`${basePath}/sign-up`}
                signInUrl={`${basePath}/sign-in`}
              />
            </div>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useEffect(() => {
    document.title = 'لطيفة بنت محمد | الصفحة الرسمية';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';

    const metadata: Record<string, string> = {
      description:
        'الصفحة الرسمية الموثقة للشيخة لطيفة بنت محمد بن راشد آل مكتوم.',
      'og:title': 'لطيفة بنت محمد | الصفحة الرسمية',
      'og:description':
        'تابع التحديثات الرسمية للشيخة لطيفة بنت محمد بن راشد آل مكتوم.',
      'og:type': 'profile',
      'og:locale': 'ar_SA',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'لطيفة بنت محمد | الصفحة الرسمية',
      'twitter:description':
        'مساحة موثوقة لمتابعة أخبار ومبادرات الشيخة لطيفة بنت محمد.',
    };

    Object.entries(metadata).forEach(([name, content]) => {
      const property = name.startsWith('og:') ? 'property' : 'name';
      let tag = document.querySelector(`meta[${property}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(property, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
  }, []);

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      appearance={{
        variables: {
          colorPrimary: '#fffc00',
          colorBackground: '#111111',
          colorForeground: '#ffffff',
          colorMutedForeground: '#a6a6a6',
          colorInput: '#1f1f1f',
          colorInputForeground: '#ffffff',
          colorNeutral: '#333333',
          fontFamily: 'Arial, Tahoma, sans-serif',
          borderRadius: '1rem',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
