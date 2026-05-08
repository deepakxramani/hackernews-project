import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className='min-h-screen relative overflow-x-hidden flex flex-col'>
      <ScrollToTop />

      {/* Ambient background glow effects */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
        <div className='absolute top-[-20%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-accent-violet/5 blur-[100px] sm:blur-[120px]' />
        <div className='absolute bottom-[-20%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-accent-orange/5 blur-[100px] sm:blur-[120px]' />
        <div className='absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-accent-purple/3 blur-[80px]' />
      </div>

      {/* Main content */}
      <div className='relative z-10 flex flex-col min-h-screen'>
        <Navbar />
        <main className='w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-14 flex-1'>
          <AppRoutes />
        </main>
        <Footer />
      </div>

      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#f1f5f9',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#ff6b35',
              secondary: '#1a1a2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
