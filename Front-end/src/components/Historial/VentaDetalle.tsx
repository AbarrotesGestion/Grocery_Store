import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineShoppingBag, 
  HiOutlinePrinter 
} from 'react-icons/hi2';

export default function VentaDetalle() {
  const { id } = useParams();

  const ticket = {
    id: Number(id) || 1,
    folio: '#000001',
    fecha: '03/03/2026 04:09 AM',
    vendedor: 'Rosa Melano',
    producto: 'Arroz Súper Extra 1kg',
    cantidad: 2,
    precioUnitario: 18.00,
    total: 36.00,
  };

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/sales" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver al historial
        </Link>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-rose-500 transition-all shadow-md shadow-rose-600/20"
        >
          <HiOutlinePrinter className="text-lg" />
          Imprimir Comprobante
        </button>
      </div>

      <div className="max-w-md mx-auto bg-dark-card border border-dark-border rounded-xl p-8 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2 border-b border-dark-border pb-6">
          <div className="w-12 h-12 bg-neo-mint/10 text-neo-mint rounded-xl flex items-center justify-center mx-auto border border-neo-mint/20">
            <HiOutlineShoppingBag className="text-2xl" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wider">GROCERY STORE</h2>
          <p className="text-xs text-gris-calido/70 font-mono">Ticket de Venta {ticket.folio}</p>
        </div>

        <div className="space-y-2 text-xs border-b border-dark-border pb-6">
          <div className="flex justify-between">
            <span className="text-gris-calido/60">Fecha:</span>
            <span className="text-white font-medium">{ticket.fecha}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris-calido/60">Atendido por:</span>
            <span className="text-white font-medium">{ticket.vendedor}</span>
          </div>
        </div>

        <div className="space-y-3 border-b border-dark-border pb-6">
          <p className="text-[11px] font-bold text-neo-mint uppercase tracking-wider">
            Detalle del Producto
          </p>
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="font-semibold text-white">{ticket.producto}</p>
              <p className="text-xs text-gris-calido/60">
                {ticket.cantidad} unidad(es) x ${ticket.precioUnitario.toFixed(2)}
              </p>
            </div>
            <span className="font-bold text-white text-base">
              ${ticket.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="text-center pt-2 space-y-1">
          <p className="text-xs font-semibold text-gris-calido uppercase tracking-wider">
            Total Pagado
          </p>
          <p className="text-3xl font-extrabold text-emerald-400">
            ${ticket.total.toFixed(2)}
          </p>
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs italic text-gris-calido/50">¡Gracias por su compra!</p>
        </div>

      </div>

    </div>
  );
}