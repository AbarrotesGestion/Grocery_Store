<?php $__env->startSection('content'); ?>
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800 fw-bold">Vista General</h1>
        <div>
            <?php if(Auth::user()->role === 'Administrador'): ?>
                <a href="<?php echo e(route('pdf.ventas.diarias')); ?>" class="btn btn-sm btn-outline-danger shadow-sm me-2">
                    <i class="fas fa-file-pdf me-1"></i> Reporte Diario
                </a>
            <?php endif; ?>
            <?php if(Auth::user()->canManageSales()): ?>
                <a href="<?php echo e(route('sales.create')); ?>" class="btn btn-sm btn-primary shadow-sm">
                    <i class="fas fa-cart-plus me-1"></i> Nueva Venta
                </a>
            <?php endif; ?>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-start border-primary border-4 h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 p-3 rounded me-3">
                        <i class="fas fa-calendar-day text-primary fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-0 small fw-bold text-uppercase">Ventas Hoy</p>
                        <h4 class="fw-bold mb-0">$<?php echo e(number_format($ventasHoyTotal, 2)); ?></h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-start border-success border-4 h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-success bg-opacity-10 p-3 rounded me-3">
                        <i class="fas fa-receipt text-success fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-0 small fw-bold text-uppercase">Tickets</p>
                        <h4 class="fw-bold mb-0"><?php echo e($ventasHoy); ?></h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-start border-danger border-4 h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-danger bg-opacity-10 p-3 rounded me-3">
                        <i class="fas fa-boxes text-danger fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-0 small fw-bold text-uppercase">Stock Bajo</p>
                        <h4 class="fw-bold mb-0 text-danger"><?php echo e($productosConBajoStock); ?></h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-start border-warning border-4 h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-warning bg-opacity-10 p-3 rounded me-3">
                        <i class="fas fa-hand-holding-usd text-warning fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-0 small fw-bold text-uppercase">Por Cobrar</p>
                        <h4 class="fw-bold mb-0">$<?php echo e(number_format($deudasPendientes, 2)); ?></h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm p-4 h-100">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0">Rendimiento Semanal</h5>
                    <?php if(Auth::user()->role === 'Administrador'): ?>
                        <a href="<?php echo e(route('reportes.ventas')); ?>" class="btn btn-link btn-sm text-decoration-none p-0">Detalles <i class="fas fa-chevron-right ms-1"></i></a>
                    <?php endif; ?>
                </div>
                <div id="revenue-chart"></div>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card border-0 shadow-sm p-4 h-100">
                <h5 class="fw-bold mb-4">Stock por Categoría</h5>
                <div id="stock-donut-chart"></div>
                <div class="mt-auto pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center small">
                        <span class="text-muted">Total Productos:</span>
                        <span class="fw-bold text-dark"><?php echo e($totalProductos); ?></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-sm">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 fw-bold text-dark"><i class="fas fa-history me-2 text-muted"></i>Últimas Ventas</h6>
            <?php if(Auth::user()->role === 'Administrador'): ?>
                <a href="<?php echo e(route('reportes.ventas')); ?>" class="btn btn-sm btn-light">Ver todas</a>
            <?php endif; ?>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small">
                        <tr>
                            <th class="ps-4">FOLIO</th>
                            <th>CLIENTE</th>
                            <th>TOTAL</th>
                            <th>VENDEDOR</th>
                            <th class="pe-4 text-end">FECHA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $__empty_1 = true; $__currentLoopData = $ultimasVentas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $venta): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <tr>
                            <td class="ps-4 fw-bold">#<?php echo e(str_pad($venta->id, 5, '0', STR_PAD_LEFT)); ?></td>
                            <td><?php echo e($venta->client->name ?? 'Público General'); ?></td>
                            <td><span class="badge bg-success bg-opacity-10 text-success fw-bold p-2">$<?php echo e(number_format($venta->total_price, 2)); ?></span></td>
                            <td><small><?php echo e($venta->employee->first_name ?? 'Sistema'); ?></small></td>
                            <td class="pe-4 text-end text-muted small"><?php echo e($venta->created_at->format('H:i')); ?> (<?php echo e($venta->created_at->diffForHumans()); ?>)</td>
                        </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr>
                            <td colspan="5" class="text-center py-5 text-muted italic">No hay actividad registrada el día de hoy.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Gráfica de Ganancias vs Gastos
        var revenueOptions = {
            series: [{
                name: 'Ingresos',
                data: <?php echo json_encode($gananciasData); ?>

            }, {
                name: 'Gastos',
                data: <?php echo json_encode($gastosData); ?>

            }],
            chart: { height: 350, type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
            colors: ['#0d6efd', '#fd7e14'],
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 3 },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
            xaxis: { categories: <?php echo json_encode($diasLabels); ?> },
            tooltip: { y: { formatter: (val) => "$ " + val.toLocaleString() } }
        };
        new ApexCharts(document.querySelector("#revenue-chart"), revenueOptions).render();

        // Gráfica de Stock (Dona)
        var stockOptions = {
            series: <?php echo json_encode($conteoProductos); ?>,
            labels: <?php echo json_encode($labelsCategorias); ?>,
            chart: { type: 'donut', height: 300 },
            colors: ['#0d6efd', '#198754', '#0dcaf0', '#ffc107', '#dc3545'],
            legend: { position: 'bottom' },
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Inventario',
                                formatter: () => <?php echo e($totalProductos); ?>

                            }
                        }
                    }
                }
            }
        };
        new ApexCharts(document.querySelector("#stock-donut-chart"), stockOptions).render();
    });
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/yahir/grocery_store/resources/views/dashboard.blade.php ENDPATH**/ ?>