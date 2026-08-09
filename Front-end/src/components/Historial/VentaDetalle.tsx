import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineArrowLeft, 
  HiOutlineShoppingBag, 
  HiOutlinePrinter 
} from 'react-icons/hi2';

// Interfaz adaptada al objeto que devuelve tu show() en SaleController
interface VentaDetalleData {
  id: number;
  sale_group_id?: string;
  quantity: number;
  sale_unit_type?: 'unit' | 'package' | 'weight';
  total_price: number;
  payment_method?: string;
  cash_amount?: number;
  card_amount?: number;
  change_amount?: number;
  created_at: string;
  product?: {
    name: string;
    price: number;
  };
  employee?: {
    first_name: string;
    last_name: string;
  };
  client?: {
    first_name: string;
    last_name: string;
  };
}

export default function VentaDetalle() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<VentaDetalleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTicketDetalle = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.yahirdev.dev/api/sales/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dataRevisada = response.data.data || response.data;
        setTicket(dataRevisada);
      } catch (error) {
        console.error('Error al cargar el detalle de la venta:', error);
        setErrorMsg('No se pudo encontrar el comprobante de esta venta.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetalle();
  }, [id]);

  if (isLoading) {
    return <div className="p-6 bg-dark-bg text-neo-mint min-h-screen flex items-center justify-center">Cargando comprobante...</div>;
  }

  if (errorMsg || !ticket) {
    return <div className="p-6 bg-dark-bg text-rose-500 min-h-screen flex items-center justify-center">{errorMsg || 'Venta no encontrada'}</div>;
  }

  // Limpieza de fecha y hora
  const fechaCompleta = ticket.created_at ? ticket.created_at.replace('T', ' ').substring(0, 19) : 'N/A';
  const vendedorNombre = ticket.employee ? `${ticket.employee.first_name} ${ticket.employee.last_name}` : 'Cajero general';
  const productoNombre = ticket.product?.name || 'Producto genérico';
  const precioUnitario = ticket.product?.price ? Number(ticket.product.price) : (ticket.total_price / ticket.quantity);

  // Identificador de la unidad de medida según el backend
  let unidadTexto = 'unidad(es)';
  if (ticket.sale_unit_type === 'weight') unidadTexto = 'kg';
  if (ticket.sale_unit_type === 'package') unidadTexto = 'paquete(s)';

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/Historial-Ventas" 
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
          <p className="text-xs text-gris-calido/70 font-mono">Ticket de Venta #{ticket.id}</p>
        </div>

        <div className="space-y-2 text-xs border-b border-dark-border pb-6">
          <div className="flex justify-between">
            <span className="text-gris-calido/60">Fecha:</span>
            <span className="text-white font-medium">{fechaCompleta}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris-calido/60">Atendido por:</span>
            <span className="text-white font-medium">{vendedorNombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gris-calido/60">Método de Pago:</span>
            <span className="text-white font-uppercase font-semibold">{ticket.payment_method || 'cash'}</span>
          </div>
        </div>

        <div className="space-y-3 border-b border-dark-border pb-6">
          <p className="text-[11px] font-bold text-neo-mint uppercase tracking-wider">
            Detalle del Producto
          </p>
          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="font-semibold text-white">{productoNombre}</p>
              <p className="text-xs text-gris-calido/60">
                {ticket.quantity} {unidadTexto} x ${precioUnitario.toFixed(2)}
              </p>
            </div>
            <span className="font-bold text-white text-base">
              ${Number(ticket.total_price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="text-center pt-2 space-y-1">
          <p className="text-xs font-semibold text-gris-calido uppercase tracking-wider">
            Total Pagado
          </p>
          <p className="text-3xl font-extrabold text-emerald-400">
            ${Number(ticket.total_price).toFixed(2)}
          </p>
          {ticket.change_amount !== undefined && ticket.change_amount > 0 && (
            <p className="text-xs text-ghost-blue mt-1">Cambio entregado: ${Number(ticket.change_amount).toFixed(2)}</p>
          )}
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs italic text-gris-calido/50">¡Gracias por su compra!</p>
        </div>

      </div>

    </div>
  );
}