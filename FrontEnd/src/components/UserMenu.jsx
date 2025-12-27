import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, LogOut, ChevronDown } from 'lucide-react';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <User className="w-5 h-5" />
        <span className="font-medium">Hesabım</span>
        <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
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

          <button
            onClick={() => setIsOpen(false)}
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
