import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../App'; // Import context from App

const UserMenu = ({ user }) => {
  const { logoutUser } = useAppContext(); // Use the global logout
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle logout and close menu
  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <User className="w-5 h-5" />
        <span className="font-medium hidden sm:inline">{user?.name?.split(' ')[0] || 'Hesabım'}</span>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b">
            <p className="font-bold text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b"
          >
            <User className="w-5 h-5" />
            <span>Profilim</span>
          </Link>

          <Link
            to="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Siparişlerim</span>
          </Link>
          
          <Link
            to="/favorites"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition border-b"
          >
            <Heart className="w-5 h-5" />
            <span>Favorilerim</span>
          </Link>


          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;