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

interface SidebarProps {
  isCollapsed?: boolean;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const location = useLocation();

  const navigation: NavSection[] = [
    {
      title: 'INVENTARIO',
      items: [
        { name: 'Categorías', href: '/Categorias', icon: HiOutlineTag },
        { name: 'Productos', href: '/Productos', icon: HiOutlineCube },
        { name: 'Mermas del Producto (No renderizado)', href: '#', icon: HiOutlineTrash },
      ],
    },
    {
      title: 'OPERACIONES',
      items: [
        { name: 'Historial Ventas', href: '/Ventas', icon: HiOutlineClock },
        { name: 'Mis Clientes', href: '/Clientes', icon: HiOutlineUserGroup },
        { name: 'Cobros Clientes', href: '/Cliente-Deudas', icon: HiOutlineBanknotes },
      ],
    },
    {
      title: 'ADMINISTRACIÓN',
      items: [
        { name: 'Equipo / Empleados', href: '/Empleados', icon: HiOutlineUsers },
        { name: 'Proveedores (No renderizado)', href: '#', icon: HiOutlineTruck },
        { name: 'Deudas a Proveedores (No renderizado)', href: '#', icon: HiOutlineTruck },
      ],
    },
  ];

  return (
    <aside 
      className={`bg-dark-card border-r border-dark-border min-h-screen flex flex-col justify-between select-none shrink-0 transition-all duration-300 overflow-x-hidden ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className={`h-16 flex items-center border-b border-dark-border gap-3 ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}>
          <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint shrink-0">
            <HiOutlineShoppingCart className="text-xl" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-white tracking-wider text-sm leading-tight">GROCERY</span>
              <span className="font-semibold text-neo-mint text-xs tracking-widest">STORE</span>
            </div>
          )}
        </div>

        <div className="p-3 space-y-6">
          <div>
            <Link
              to="/dashboard"
              title={isCollapsed ? 'Dashboard' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isCollapsed ? 'justify-center' : ''
              } ${
                location.pathname === '/dashboard'
                  ? 'bg-neo-mint/10 text-neo-mint border-l-2 border-neo-mint font-semibold'
                  : 'text-gris-calido hover:bg-dark-bg hover:text-white'
              }`}
            >
              <HiOutlineSquares2X2 className="text-xl shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
            </Link>
          </div>

          {navigation.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-gris-calido/50 uppercase tracking-wider mb-2 whitespace-nowrap">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isCollapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-neo-mint/10 text-neo-mint font-semibold'
                        : 'text-gris-calido hover:bg-dark-bg hover:text-white'
                    }`}
                  >
                    <Icon className={`text-xl shrink-0 ${isActive ? 'text-neo-mint' : 'text-gris-calido/70'}`} />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-dark-border text-xs text-gris-calido/50 text-center whitespace-nowrap">
          Grocery Store v1.0
        </div>
      )}
    </aside>
  );
}