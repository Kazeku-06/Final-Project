import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Detail from './pages/Detail/Detail';
import Search from './pages/Search/Search';
import Favorite from './pages/Favorite/Favorite';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-base-100 text-base-content">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorite />} />
              {/* Gunakan path yang eksplisit */}
              <Route path="/movie/:id" element={<Detail />} />
              <Route path="/tv/:id" element={<Detail />} />
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

// Component untuk handle 404 pages
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-outline"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;