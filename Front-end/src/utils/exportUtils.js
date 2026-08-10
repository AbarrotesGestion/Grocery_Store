import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Función para exportar a Excel
export const exportToExcel = (data, fileName = 'reporte') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Función para exportar a PDF con comparativa de 7 días y comparativa mensual
export const exportToPDF = (tituloReporte, datosResumen, fileName = 'reporte') => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = 'Arial, sans-serif';

  // 1. Datos de 7 días
  const diasLabels = datosResumen.diasLabels || [];
  const gananciasData = datosResumen.gananciasData || [];
  const gastosData = datosResumen.gastosData || [];

  let filasComparativaDias = '';
  for (let i = 0; i < diasLabels.length; i++) {
    const ingreso = Number(gananciasData[i] || 0);
    const gasto = Number(gastosData[i] || 0);
    const balance = ingreso - gasto;
    filasComparativaDias += `
      <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
        <td style="padding: 6px; font-weight: bold;">${diasLabels[i]}</td>
        <td style="padding: 6px; color: #10b981; font-weight: bold;">$${ingreso.toFixed(2)}</td>
        <td style="padding: 6px; color: #f59e0b; font-weight: bold;">$${gasto.toFixed(2)}</td>
        <td style="padding: 6px; color: ${balance >= 0 ? '#3b82f6' : '#ef4444'}; font-weight: bold;">$${balance.toFixed(2)}</td>
      </tr>
    `;
  }

  // 2. Datos de ventas mes a mes (Si tu backend envía mesLabels y mesVentasData, los leerá automáticamente)
  const mesesLabels = datosResumen.mesesLabels || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const mesVentasData = datosResumen.mesVentasData || [];

  let filasComparativaMeses = '';
  for (let i = 0; i < mesesLabels.length; i++) {
    const ventaMes = Number(mesVentasData[i] || 0);
    if (ventaMes > 0 || datosResumen.mesVentasData) { // Muestra el mes si hay datos o si viene definido
      filasComparativaMeses += `
        <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          <td style="padding: 6px; font-weight: bold;">${mesesLabels[i]}</td>
          <td style="padding: 6px; color: #10b981; font-weight: bold;">$${ventaMes.toFixed(2)}</td>
        </tr>
      `;
    }
  }

  container.innerHTML = `
    <h2 style="color: #111827; margin-bottom: 5px; font-size: 22px;">${tituloReporte}</h2>
    <p style="color: #6b7280; margin-bottom: 15px; font-size: 13px;">Generado desde Grocery Store Dashboard</p>
    
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px;">
      <div style="background: #f3f4f6; padding: 10px; border-radius: 6px;">
        <p style="margin: 0; font-size: 10px; color: #4b5563; font-weight: bold;">VENTAS HOY</p>
        <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #10b981;">$${datosResumen.ventasHoyTotal || '0.00'}</p>
      </div>
      <div style="background: #f3f4f6; padding: 10px; border-radius: 6px;">
        <p style="margin: 0; font-size: 10px; color: #4b5563; font-weight: bold;">TICKETS</p>
        <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #3b82f6;">${datosResumen.ventasHoy || 0}</p>
      </div>
      <div style="background: #f3f4f6; padding: 10px; border-radius: 6px;">
        <p style="margin: 0; font-size: 10px; color: #4b5563; font-weight: bold;">STOCK BAJO</p>
        <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #f59e0b;">${datosResumen.productosConBajoStock || 0}</p>
      </div>
      <div style="background: #f3f4f6; padding: 10px; border-radius: 6px;">
        <p style="margin: 0; font-size: 10px; color: #4b5563; font-weight: bold;">POR COBRAR</p>
        <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: bold; color: #ef4444;">$${datosResumen.deudasPendientes || '0.00'}</p>
      </div>
    </div>

    <h3 style="color: #111827; font-size: 14px; margin-bottom: 6px;">Comparativa Financiera (Últimos 7 Días)</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #111827; color: #ffffff; text-align: left;">
          <th style="padding: 6px;">Día</th>
          <th style="padding: 6px;">Ingresos</th>
          <th style="padding: 6px;">Gastos</th>
          <th style="padding: 6px;">Balance Neto</th>
        </tr>
      </thead>
      <tbody>
        ${filasComparativaDias || '<tr><td colspan="4" style="padding: 6px; text-align: center;">Sin datos recientes</td></tr>'}
      </tbody>
    </table>

    <h3 style="color: #111827; font-size: 14px; margin-bottom: 6px;">Comparativa de Ventas (Mes por Mes)</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #111827; color: #ffffff; text-align: left;">
          <th style="padding: 6px;">Mes</th>
          <th style="padding: 6px;">Total Ventas</th>
        </tr>
      </thead>
      <tbody>
        ${filasComparativaMeses || '<tr><td colspan="2" style="padding: 6px; text-align: center;">Sin registros mensuales</td></tr>'}
      </tbody>
    </table>

    <h3 style="color: #111827; font-size: 14px; margin-bottom: 6px;">Últimas Ventas Registradas</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
      <thead>
        <tr style="background-color: #111827; color: #ffffff; text-align: left;">
          <th style="padding: 6px;">Folio</th>
          <th style="padding: 6px;">Cliente</th>
          <th style="padding: 6px;">Total</th>
          <th style="padding: 6px;">Vendedor</th>
          <th style="padding: 6px;">Fecha</th>
        </tr>
      </thead>
      <tbody>
        ${datosResumen.ultimasVentas?.map((v, i) => `
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
            <td style="padding: 6px;">${v.sale_group_id.substring(0, 8)}...</td>
            <td style="padding: 6px;">${v.cliente}</td>
            <td style="padding: 6px; font-weight: bold; color: #10b981;">$${Number(v.total).toFixed(2)}</td>
            <td style="padding: 6px;">${v.empleado}</td>
            <td style="padding: 6px; color: #6b7280;">${v.fecha}</td>
          </tr>
        Davidson`).join('') || '<tr><td colspan="5" style="padding: 6px; text-align: center;">Sin registros</td></tr>'}
      </tbody>
    </table>
  `;

  document.body.appendChild(container);

  html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    .then((canvas) => {
      document.body.removeChild(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${fileName}.pdf`);
    })
    .catch((error) => {
      document.body.removeChild(container);
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF.");
    });
};