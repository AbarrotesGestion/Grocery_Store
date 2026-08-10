import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  HiPlus, 
  HiOutlineClipboardDocumentList, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineMagnifyingGlass,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown
} from 'react-icons/hi2';
import AjusteInventarioModal from './AjusteInventarioModal';

export interface AjusteInventario {
  id?: number;
  product_id: number | string;
  quantity: number;
  adjustment_type: 'addition' | 'subtraction';
  reason: string;
  created_at?: string;
  product?: {
    id: number;
    name: string;
    stock: number;
  };
}

const extraerMensajeError = (error: any) => {
  const data = error.response?.data;
  return data?.message ?? data?.error ?? 'Ocurrió un error inesperado';
};

export default function AjustesInventarioScreen() {
  const [ajustes, setAjustes] = useState<AjusteInventario[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAjuste, setSelectedAjuste] = useState<AjusteInventario | null>(null);

  useEffect(() => {
    const fetchAjustes = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.yahirdev.dev/api/inventory-adjustments', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data.data || response.data;
        setAjustes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar ajustes de inventario:', extraerMensajeError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAjustes();
  }, [refreshTrigger]);

  const handleOpenNewModal = () => {
    setSelectedAjuste(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ajuste: AjusteInventario) => {
    setSelectedAjuste(ajuste);
    setIsModalOpen(true);
  };

  const handleDeleteAjuste = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este ajuste? Esto revertirá el impacto en el stock del producto.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://api.yahirdev.dev/api/inventory-adjustments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRefreshTrigger(prev => prev + 1);
        alert('Ajuste eliminado y stock revertido correctamente.');
      } catch (error) {
        alert(extraerMensajeError(error));
      }
    }
  };

  const totalAdiciones = ajustes.filter(a => a.adjustment_type === 'addition').reduce((acc, curr) => acc + Number(curr.quantity), 0);
  const totalSubstracciones = ajustes.filter(a => a.adjustment_type === 'subtraction').reduce((acc, curr) => acc + Number(curr.quantity), 0);

  const ajustesFiltrados = ajustes.filter(a =>
    a.reason.toLowerCase().includes(search.toLowerCase()) ||
    a.product?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Ajustes de Inventario</h1>
          <p className="text-sm text-gris-calido/70">Control de entradas por entradas manuales, mermas y auditorías.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleOpenNewModal}
          className="flex items-center justify-center gap-2 bg-neo-mint text-dark-bg font-semibold px-4 py-2.5 rounded-lg hover:bg-neo-mint/90 transition-all shadow-lg shadow-neo-mint/10"
        >
          <HiPlus className="text-lg font-bold" />
          Nuevo Ajuste
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border p-5 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-gris-calido/60 uppercase tracking-wider">Total Registros</p>
          <h3 className="text-2xl font-bold text-white mt-1">{ajustes.length}</h3>
        </div>
        <div className="bg-dark-card border-l-4 border-emerald-500 border-y border-r border-dark-border p-5 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Unidades Añadidas</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">+{totalAdiciones}</h3>
        </div>
        <div className="bg-dark-card border-l-4 border-rose-500 border-y border-r border-dark-border p-5 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Unidades Retiradas (Mermas)</p>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">-{totalSubstracciones}</h3>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <HiOutlineMagnifyingGlass className="text-xl text-gris-calido/60" />
        <input 
          type="text"
          placeholder="Buscar por motivo o nombre de producto..."
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
                <th className="py-3.5 px-6">Producto</th>
                <th className="py-3.5 px-6 text-center">Tipo de Ajuste</th>
                <th className="py-3.5 px-6 text-center">Cantidad</th>
                <th className="py-3.5 px-6">Motivo / Razón</th>
                <th className="py-3.5 px-6">Fecha</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neo-mint">Cargando ajustes...</td>
                </tr>
              ) : ajustesFiltrados.length > 0 ? (
                ajustesFiltrados.map((item, index) => {
                  const isAddition = item.adjustment_type === 'addition';
                  const fechaLimpia = item.created_at ? item.created_at.split('T')[0] : 'N/A';

                  return (
                    <motion.tr 
                      key={item.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-dark-bg/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <div className="p-2 bg-neo-mint/10 rounded-lg text-neo-mint shrink-0">
                          <HiOutlineClipboardDocumentList className="text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.product?.name || `Producto #${item.product_id}`}</p>
                          <p className="text-[10px] text-gris-calido/60">Stock actual: {item.product?.stock ?? 'N/A'}</p>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          isAddition 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {isAddition ? <HiOutlineArrowTrendingUp /> : <HiOutlineArrowTrendingDown />}
                          {isAddition ? 'Entrada (+)' : 'Salida (-)'}
                        </span>
                      </td>

                      <td className={`py-4 px-6 text-center font-bold text-base ${isAddition ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isAddition ? `+${item.quantity}` : `-${item.quantity}`}
                      </td>

                      <td className="py-4 px-6 text-white text-xs max-w-xs truncate">
                        {item.reason}
                      </td>

                      <td className="py-4 px-6 text-xs text-gris-calido/70 font-mono">
                        {fechaLimpia}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Editar"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            title="Eliminar"
                            onClick={() => handleDeleteAjuste(item.id!)}
                            className="p-1.5 hover:bg-dark-bg rounded-md text-rose-500 hover:text-rose-400 transition-colors"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gris-calido/50">
                    No se encontraron registros de ajustes de inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AjusteInventarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedAjuste}
        onSuccess={() => {
          setIsModalOpen(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </motion.div>
  );
}