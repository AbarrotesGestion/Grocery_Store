import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineSquares2X2, 
  HiOutlineTag, 
  HiOutlineCube, 
  HiOutlineTrash, 
  HiOutlineShoppingCart, 
  HiOutlineClock, 
  HiOutlineUserGroup, 
  HiOutlineBanknotes, 
  HiOutlineUsers, 
  HiOutlineTruck 
} from 'react-icons/hi2';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const location = useLocation();

  const navigation: NavSection[] = [
    {
      title: 'INVENTARIO',
      items: [
        { name: 'Categorías', href: '/Categorias', icon: HiOutlineTag },
        { name: 'Productos', href: '', icon: HiOutlineCube },
        { name: 'Mermas del Producto', href: '', icon: HiOutlineTrash },
      ],
    },
    {
      title: 'OPERACIONES',
      items: [
        { name: 'Historial Ventas', href: '', icon: HiOutlineClock },
        { name: 'Mis Clientes', href: '', icon: HiOutlineUserGroup },
        { name: 'Cobros Clientes', href: '', icon: HiOutlineBanknotes },
      ],
    },
    {
      title: 'ADMINISTRACIÓN',
      items: [
        { name: 'Equipo / Empleados', href: '', icon: HiOutlineUsers },
        { name: 'Proveedores', href: '', icon: HiOutlineTruck },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border min-h-screen flex flex-col justify-between select-none shrink-0">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-dark-border gap-3">
          <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint">
            <HiOutlineShoppingCart className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-wider text-sm leading-tight">GROCERY</span>
            <span className="font-semibold text-neo-mint text-xs tracking-widest">STORE</span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          
          <div>
            <Link
              to="/dashboard"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-neo-mint/10 text-neo-mint border-l-2 border-neo-mint font-semibold'
                  : 'text-gris-calido hover:bg-dark-bg hover:text-white'
              }`}
            >
              <HiOutlineSquares2X2 className="text-lg" />
              <span>Dashboard</span>
            </Link>
          </div>

          {navigation.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gris-calido/50 uppercase tracking-wider mb-2">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-neo-mint/10 text-neo-mint font-semibold'
                        : 'text-gris-calido hover:bg-dark-bg hover:text-white'
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? 'text-neo-mint' : 'text-gris-calido/70'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}

        </div>
      </div>

      <div className="p-4 border-t border-dark-border text-xs text-gris-calido/50 text-center">
        Grocery Store v1.0
      </div>
    </aside>
  );
}