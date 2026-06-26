<?php $__env->startSection('content'); ?>
<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800 fw-bold">Proveedores</h1>
        <a href="<?php echo e(route('suppliers.create')); ?>" class="btn btn-primary shadow-sm">
            <i class="fas fa-truck me-1"></i> Nuevo Proveedor
        </a>
    </div>

    <?php if(session('success')): ?>
        <div class="alert alert-success border-0 shadow-sm mb-4">
            <i class="fas fa-check-circle me-2"></i> <?php echo e(session('success')); ?>

        </div>
    <?php endif; ?>

    <?php if(session('error')): ?>
        <div class="alert alert-danger border-0 shadow-sm mb-4">
            <i class="fas fa-exclamation-circle me-2"></i> <?php echo e(session('error')); ?>

        </div>
    <?php endif; ?>

    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small">
                        <tr>
                            <th class="ps-4">EMPRESA</th>
                            <th>REPRESENTANTE</th>
                            <th>TELÉFONO</th>
                            <th>EMAIL</th>
                            <th class="text-end pe-4">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $__empty_1 = true; $__currentLoopData = $suppliers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $supplier): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <tr>
                            <td class="ps-4">
                                <div class="d-flex align-items-center">
                                    <div class="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                                        <i class="fas fa-building"></i>
                                    </div>
                                    <span class="fw-bold text-dark"><?php echo e($supplier->company_name); ?></span>
                                </div>
                            </td>
                            <td><?php echo e($supplier->contact_name); ?></td>
                            <td><?php echo e($supplier->phone ?? 'N/A'); ?></td>
                            <td><?php echo e($supplier->email ?? 'N/A'); ?></td>
                            <td class="text-end pe-4">
                                <div class="btn-group shadow-sm">
                                    <a href="<?php echo e(route('suppliers.show', $supplier->id)); ?>" class="btn btn-sm btn-white text-primary">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="<?php echo e(route('suppliers.edit', $supplier->id)); ?>" class="btn btn-sm btn-white text-warning">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form action="<?php echo e(route('suppliers.destroy', $supplier->id)); ?>" method="POST" class="d-inline delete-form">
                                        <?php echo csrf_field(); ?> <?php echo method_field('DELETE'); ?>
                                        <button type="submit" class="btn btn-sm btn-white text-danger" onclick="return confirm('¿Eliminar proveedor?')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr>
                            <td colspan="5" class="text-center py-5 text-muted">No hay proveedores registrados.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/luis-yahir/laravel/grocery-store/resources/views/suppliers/index.blade.php ENDPATH**/ ?>