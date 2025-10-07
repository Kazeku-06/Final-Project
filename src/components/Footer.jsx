import { APP_NAME } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="text-base-content py-8 mt-16" style={{ backgroundColor: '#0F172A' }}>
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
