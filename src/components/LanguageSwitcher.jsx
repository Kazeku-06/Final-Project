import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, selectCurrentLanguage } from '../redux/slices/languageSlice';

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' }
  ];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        {languages.find(lang => lang.code === currentLanguage)?.flag}
        {languages.find(lang => lang.code === currentLanguage)?.name}
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {languages.map((language) => (
          <li key={language.code}>
            <button 
              onClick={() => dispatch(setLanguage(language.code))}
              className={`flex items-center gap-2 ${currentLanguage === language.code ? 'active' : ''}`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;