import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlineUser, 
  HiOutlinePencilSquare, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin, 
  HiOutlineCreditCard,
  HiOutlineCalendar
} from 'react-icons/hi2';
import EmpleadoModal, { type EmpleadoData } from './EmpleadoModal';

export default function EmpleadoDetalle() {
  const { id } = useParams();

  const [empleado, setEmpleado] = useState<EmpleadoData>({
    id: Number(id) || 1,
    idNomina: 'CAJ-001',
    nombre: 'Rosa',
    apellido: 'Melano',
    rol: 'Cajero',
    tarifaHora: 80.00,
    email: 'rosa.cajera@tienda.com',
    telefono: '3300002222',
    domicilio: 'Av. Las Palmas 120, Col. Centro',
    cuentaDeposito: '**** **** **** 1200',
    fechaRegistro: '03 de Mar, 2026',
    estado: 'Activo',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 bg-dark-bg text-gris-calido min-h-screen space-y-6">
      
      <div className="flex items-center justify-between">
        <Link 
          to="/employees" 
          className="inline-flex items-center gap-2 text-sm text-gris-calido/70 hover:text-neo-mint transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          Volver al listado
        </Link>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <HiOutlinePencilSquare className="text-lg" />
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col items-center text-center justify-between space-y-6">
          <div className="w-full flex flex-col items-center space-y-3">
            <div className="w-20 h-20 bg-neo-mint/10 text-neo-mint rounded-full flex items-center justify-center border border-neo-mint/20">
              <HiOutlineUser className="text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-white">{empleado.nombre} {empleado.apellido}</h1>
            
            <span className="px-3 py-1 bg-ghost-blue/10 text-ghost-blue text-xs font-semibold rounded-full border border-ghost-blue/20">
              {empleado.rol}
            </span>

            <div className="w-full border-t border-dark-border pt-4 text-left space-y-3 text-xs">
              <div>
                <p className="text-gris-calido/60 uppercase font-semibold">ID Nómina</p>
                <p className="text-white font-bold font-mono">{empleado.idNomina}</p>
              </div>

              <div>
                <p className="text-gris-calido/60 uppercase font-semibold">Sueldo Base</p>
                <p className="text-emerald-400 font-bold text-sm">${empleado.tarifaHora.toFixed(2)} / hora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-dark-border pb-3">
            Información Detallada
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <p className="text-gris-calido/60 font-semibold uppercase">Correo Electrónico</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlineEnvelope className="text-ghost-blue" />
                {empleado.email}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-gris-calido/60 font-semibold uppercase">Teléfono de Contacto</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlinePhone className="text-neo-mint" />
                {empleado.telefono || 'Sin teléfono'}
              </p>
            </div>

            <div className="sm:col-span-2 space-y-1 border-t border-dark-border pt-4">
              <p className="text-gris-calido/60 font-semibold uppercase">Dirección de Vivienda</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlineMapPin className="text-rose-400" />
                {empleado.domicilio || 'No registrada'}
              </p>
            </div>

            <div className="space-y-1 border-t border-dark-border pt-4">
              <p className="text-gris-calido/60 font-semibold uppercase">Método de Pago (Tarjeta)</p>
              <p className="text-white font-medium flex items-center gap-2 font-mono">
                <HiOutlineCreditCard className="text-amber-400" />
                {empleado.cuentaDeposito || '**** **** **** ****'}
              </p>
            </div>

            <div className="space-y-1 border-t border-dark-border pt-4">
              <p className="text-gris-calido/60 font-semibold uppercase">Fecha de Registro</p>
              <p className="text-white font-medium flex items-center gap-2">
                <HiOutlineCalendar className="text-neo-mint" />
                {empleado.fechaRegistro || '03 de Mar, 2026'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EmpleadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => setEmpleado(data)}
        initialData={empleado}
      />
    </div>
  );
}