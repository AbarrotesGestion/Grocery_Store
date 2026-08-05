import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center font-sans p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Panel de Administración
        </h1>
        {/* Contenido del dashboard */}
      </div>
    </div>
  );
}