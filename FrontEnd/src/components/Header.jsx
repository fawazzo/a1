import { Link } from 'react-router-dom';
import { MapPin, ShoppingCart, User, Search, Store } from 'lucide-react';
import FeaturesMenu from './FeaturesMenu';
import UserMenu from './UserMenu'; // We will use this component

const Header = ({ user, onLoginClick, onCartClick, cartItemCount, location, onLocationChange }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
              L
            </div>
            <span className="text-2xl font-bold text-gray-800">Lezzet Express</span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="text-sm">
              <div className="text-gray-500 text-xs">Teslimat Adresi</div>
              <div className="font-semibold text-gray-800">{location}</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-3">
            <FeaturesMenu />

            <Link
              to="/seller/login"
              className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <Store className="w-5 h-5" />
              <span className="font-medium text-sm">Satıcı Ol</span>
            </Link>

            {user ? (
              <UserMenu user={user} /> // Show UserMenu if logged in
            ) : (
              <button 
                onClick={onLoginClick}
                className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-primary transition"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Giriş Yap</span>
              </button>
            )}

            <button 
              onClick={onCartClick}
              className="relative flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Sepetim</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;