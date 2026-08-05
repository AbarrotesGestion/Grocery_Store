<?php $__env->startSection('content'); ?>
<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800 fw-bold">Cuentas por Cobrar (Clientes)</h1>
        <a href="<?php echo e(route('client_debts.create')); ?>" class="btn btn-primary shadow-sm">
            <i class="fas fa-hand-holding-usd me-1"></i> Registrar Deuda
        </a>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3 border-start border-warning border-4">
                <p class="text-muted mb-0 small fw-bold text-uppercase">Pendiente de Cobro</p>
                <h4 class="fw-bold mb-0 text-warning">$<?php echo e(number_format($debts->where('status', 'pending')->sum('balance_due'), 2)); ?></h4>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3 border-start border-danger border-4">
                <p class="text-muted mb-0 small fw-bold text-uppercase">Total Vencido</p>
                <h4 class="fw-bold mb-0 text-danger">$<?php echo e(number_format($debts->where('status', 'overdue')->sum('balance_due'), 2)); ?></h4>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3 border-start border-success border-4">
                <p class="text-muted mb-0 small fw-bold text-uppercase">Total Recuperado</p>
                <h4 class="fw-bold mb-0 text-success">$<?php echo e(number_format($debts->where('status', 'paid')->sum('balance_due'), 2)); ?></h4>
            </div>
        </div>
    </div>

    <?php if(session('success')): ?>
        <div class="alert alert-success border-0 shadow-sm mb-4"><?php echo e(session('success')); ?></div>
    <?php endif; ?>
    <?php if(session('error')): ?>
        <div class="alert alert-danger border-0 shadow-sm mb-4"><?php echo e(session('error')); ?></div>
    <?php endif; ?>

    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small">
                        <tr>
                            <th class="ps-4">CLIENTE</th>
                            <th>F. INICIO</th>
                            <th>VENCIMIENTO</th>
                            <th>MONTO</th>
                            <th>ESTADO</th>
                            <th class="text-end pe-4">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $__empty_1 = true; $__currentLoopData = $debts; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $debt): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <tr>
                            <td class="ps-4">
                                <div class="d-flex align-items-center">
                                    <div class="bg-info bg-opacity-10 p-2 rounded-circle me-3 text-info">
                                        <i class="fas fa-user-tag"></i>
                                    </div>
                                    <div>
                                        <span class="fw-bold d-block text-dark"><?php echo e($debt->client->name); ?></span>
                                        <small class="text-muted">ID: #<?php echo e($debt->client->id); ?></small>
                                    </div>
                                </div>
                            </td>
                            <td><?php echo e(\Carbon\Carbon::parse($debt->start_date)->format('d/m/y')); ?></td>
                            <td>
                                <span class="<?php echo e($debt->status == 'overdue' ? 'text-danger fw-bold' : ''); ?>">
                                    <?php echo e(\Carbon\Carbon::parse($debt->due_date)->format('d/m/y')); ?>

                                </span>
                            </td>
                            <td class="fw-bold">$<?php echo e(number_format($debt->balance_due, 2)); ?></td>
                            <td>
                                <?php
                                    $badge = [
                                        'pending' => 'bg-warning text-warning',
                                        'paid' => 'bg-success text-success',
                                        'overdue' => 'bg-danger text-danger'
                                    ];
                                ?>
                                <span class="badge rounded-pill <?php echo e($badge[$debt->status]); ?> bg-opacity-10 px-3">
                                    <?php echo e(ucfirst($debt->status)); ?>

                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <div class="btn-group shadow-sm">
                                    <a href="<?php echo e(route('client_debts.show', $debt->id)); ?>" class="btn btn-sm btn-white text-primary"><i class="fas fa-eye"></i></a>
                                    <a href="<?php echo e(route('client_debts.edit', $debt->id)); ?>" class="btn btn-sm btn-white text-warning"><i class="fas fa-edit"></i></a>
                                    <form action="<?php echo e(route('client_debts.destroy', $debt->id)); ?>" method="POST" class="d-inline">
                                        <?php echo csrf_field(); ?> <?php echo method_field('DELETE'); ?>
                                        <button type="submit" class="btn btn-sm btn-white text-danger" onclick="return confirm('¿Eliminar registro?')"><i class="fas fa-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr><td colspan="6" class="text-center py-5">No hay deudas de clientes.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/luis-yahir/laravel/grocery-store/resources/views/client_debts/index.blade.php ENDPATH**/ ?>