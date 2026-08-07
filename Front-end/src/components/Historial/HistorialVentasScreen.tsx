import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiPlus, 
  HiOutlineDocumentText, 
  HiOutlineEye, 
  HiOutlineArrowPath, 
  HiOutlineNoSymbol,
  HiOutlineMagnifyingGlass,
  HiOutlineUser
} from 'react-icons/hi2';

export interface Venta {
  id: number;
  folio: string;
  producto: string;
  precioUnitario: number;
  cantidad: number;
  total: number;
  vendedor: string;
  fecha: string;
  hora: string;
}

export default function HistorialVentasScreen() {
  const navigate = useNavigate();

  const [ventas, setVentas] = useState<Venta[]>([
    { id: 1, folio: '#000001', producto: 'Arroz Súper Extra 1kg', precioUnitario: 18.00, cantidad: 2, total: 36.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 2, folio: '#000002', producto: 'Coca Cola 2.5L', precioUnitario: 38.00, cantidad: 1, total: 38.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 3, folio: '#000003', producto: 'Frijol Negro 1kg', precioUnitario: 26.00, cantidad: 1, total: 26.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 4, folio: '#000004', producto: 'Jamón de Pavo 500g', precioUnitario: 65.00, cantidad: 1, total: 65.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 5, folio: '#000005', producto: 'Pan Integral Grande', precioUnitario: 48.00, cantidad: 1, total: 48.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 6, folio: '#000006', producto: 'Aceite Vegetal 900ml', precioUnitario: 32.00, cantidad: 2, total: 64.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 7, folio: '#000007', producto: 'Leche Entera 1L', precioUnitario: 23.00, cantidad: 3, total: 69.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 8, folio: '#000008', producto: 'Papas Fritas 150g', precioUnitario: 18.00, cantidad: 5, total: 90.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
    { id: 9, folio: '#000009', producto: 'Detergente Ariel 1kg', precioUnitario: 35.00, cantidad: 1, total: 35.00, vendedor: 'Rosa', fecha: '03/03/2026', hora: '04:09 AM' },
  ]);

  const [search, setSearch] = useState('');

  const ventasFiltradas = ventas.filter(v =>
    v.folio.toLowerCase().includes(search.toLowerCase()) ||
    v.producto.toLowerCase().includes(search.toLowerCase()) ||
    v.vendedor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Historial de Ventas</h1>
          <p className="text-sm text-gris-calido/70">Registro General de Operaciones.</p>
        </div>
        
        <button 
          onClick={() => navigate('/pos')}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Nueva Venta
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por folio, producto o vendedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gris-calido/50"
        />
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gris-calido">
            <thead className="bg-dark-bg/80 text-xs uppercase font-semibold text-white/70 border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-6">Folio</th>
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6 text-center">Cantidad</th>
                <th className="py-3.5 px-6 text-right">Total</th>
                <th className="py-3.5 px-6">Vendedor</th>
                <th className="py-3.5 px-6">Fecha</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((v) => (
                  <tr key={v.id} className="hover:bg-dark-bg/40 transition-colors">
                    
                    <td className="py-4 px-6 font-semibold text-ghost-blue">
                      {v.folio}
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-medium text-white">{v.producto}</p>
                      <p className="text-xs text-gris-calido/60">${v.precioUnitario.toFixed(2)} c/u</p>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-bg text-gris-calido border border-dark-border">
                        {v.cantidad} {v.cantidad === 1 ? 'unidad' : 'unidades'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-emerald-400">
                      ${v.total.toFixed(2)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-white">
                        <HiOutlineUser className="text-neo-mint" />
                        <span>{v.vendedor}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-gris-calido">
                      <p>{v.fecha}</p>
                      <p className="text-gris-calido/50">{v.hora}</p>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button 
                          title="Descargar PDF"
                          onClick={() => alert(`Generando PDF de ${v.folio}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <HiOutlineDocumentText className="text-lg" />
                        </button>

                        <button 
                          title="Ver Ticket"
                          onClick={() => navigate(`/Ventas/${v.id}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-ghost-blue hover:text-white transition-colors"
                        >
                          <HiOutlineEye className="text-lg" />
                        </button>

                        <button 
                          title="Devolución"
                          onClick={() => alert(`Devolución de ${v.folio}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <HiOutlineArrowPath className="text-lg" />
                        </button>

                        <button 
                          title="Cancelar Venta"
                          onClick={() => alert(`Cancelar venta ${v.folio}`)}
                          className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          <HiOutlineNoSymbol className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gris-calido/50">
                    No se encontraron registros de ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}