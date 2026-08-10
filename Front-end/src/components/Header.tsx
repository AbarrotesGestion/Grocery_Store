import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiBars3, 
  HiOutlineUser, 
  HiOutlineArrowRightOnRectangle, 
  HiChevronDown 
} from 'react-icons/hi2';

interface HeaderProps {
  onToggleSidebar: () => void;
  userName?: string;
  userRole?: string;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState('Usuario');
  const [role, setRole] = useState('Personal');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        const fullName = 
          user.name || 
          `${user.employee?.first_name || ''} ${user.employee?.last_name || ''}`.trim() ||
          `${user.first_name || ''} ${user.last_name || ''}`.trim();

        setName(fullName || 'Usuario');

        const roleName = 
          user.employee?.role?.name ||
          user.role?.name ||
          (typeof user.role === 'string' ? user.role : null) || 
          'Personal';

        setRole(roleName);
      } catch (e) {
        console.error('Error al obtener usuario del localStorage:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-dark-card border-b border-dark-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      
      <button
        type="button"
        onClick={onToggleSidebar}
        className="p-2 text-gris-calido hover:text-white rounded-lg hover:bg-dark-bg transition-colors focus:outline-none"
      >
        <HiBars3 className="text-2xl" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-dark-bg transition-colors"
        >
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-bold text-white leading-tight">{name}</span>
            <span className="text-[11px] text-neo-mint font-medium capitalize">{role}</span>
          </div>

          <div className="w-9 h-9 bg-neo-mint/10 text-neo-mint rounded-full flex items-center justify-center border border-neo-mint/20">
            <HiOutlineUser className="text-lg" />
          </div>

          <HiChevronDown className={`text-xs text-gris-calido/70 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-2xl py-2 z-50">
            <div className="px-4 py-2 border-b border-dark-border sm:hidden">
              <p className="text-xs font-bold text-white">{name}</p>
              <p className="text-[10px] text-neo-mint capitalize">{role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-dark-bg flex items-center gap-2 transition-colors font-medium"
            >
              <HiOutlineArrowRightOnRectangle className="text-base" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}