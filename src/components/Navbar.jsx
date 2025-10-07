import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTranslations } from '../redux/slices/languageSlice';
import { selectCurrentTheme, toggleTheme } from '../redux/slices/themeSlice';
import LanguageSwitcher from './LanguageSwitcher';
import { APP_NAME } from '../utils/constants';

const Navbar = () => {
  const t = useSelector(selectTranslations);
  const currentTheme = useSelector(selectCurrentTheme);
  const dispatch = useDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="navbar bg-base-100/60 shadow-lg px-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="navbar-start">
        <Link 
          to="/" 
          className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-bold 
                     shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                     transition-all duration-300"
        >
          {APP_NAME}
        </Link>
      </div>

      {/* Menu desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-4">
          <li>
            <Link 
              to="/" 
              className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold 
                         bg-transparent hover:bg-blue-500 hover:text-black 
                         shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                         transition-all duration-300"
            >
              {t.home}
            </Link>
          </li>
          <li>
            <Link 
              to="/search" 
              className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold 
                         bg-transparent hover:bg-blue-500 hover:text-black 
                         shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                         transition-all duration-300"
            >
              {t.search}
            </Link>
          </li>
          <li>
            <Link 
              to="/favorites" 
              className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold 
                         bg-transparent hover:bg-blue-500 hover:text-black 
                         shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                         transition-all duration-300"
            >
              {t.favorites}
            </Link>
          </li>
        </ul>
      </div>

      {/* Toggle & Language */}
      <div className="navbar-end gap-2">
        {/* Theme Toggle */}
        <button 
          onClick={handleThemeToggle}
          className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-500 
                     text-blue-500 hover:bg-blue-500 hover:text-black transition-all duration-300 
                     shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]"
          title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
        >
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>
        
        {/* Language Switcher */}
        <div className="rounded-full border-2 border-blue-500 text-blue-500 
                        shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] 
                        transition-all duration-300">
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" 
            className="px-4 py-2 rounded-full border-2 border-blue-500 text-blue-500 font-semibold 
                       shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:bg-blue-500 hover:text-black 
                       hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-300"
          >
            ☰
          </div>
          <ul 
            tabIndex={0} 
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Link to="/">{t.home}</Link></li>
            <li><Link to="/search">{t.search}</Link></li>
            <li><Link to="/favorites">{t.favorites}</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
