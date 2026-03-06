import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Header,
  Toast,
  LoadingSpinner,
} from './components';
import {
  Home,
  Login,
  Signup,
  BoardList,
  BoardDetail,
  BoardWrite,
  BoardEdit,
  MyPage,
} from './pages';
import { useAuthStore } from './stores/authStore';
import './App.css';

/**
 * TanStack Query 클라이언트 설정
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 분
    },
  },
});

/**
 * 인증 초기화 컴포넌트
 * 앱 시작 시 인증 상태를 확인
 */
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * 메인 레이아웃 컴포넌트
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">{children}</main>
      <Toast />
    </div>
  );
};

/**
 * 애플리케이션 루트 컴포넌트
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/boards" element={<BoardList />} />
              <Route path="/boards/:id" element={<BoardDetail />} />
              <Route path="/boards/write" element={<BoardWrite />} />
              <Route path="/boards/:id/edit" element={<BoardEdit />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
