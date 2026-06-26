<?php $__env->startSection('content'); ?>
<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800 fw-bold">Gestión de Empleados</h1>
        <a href="<?php echo e(route('employees.create')); ?>" class="btn btn-primary shadow-sm">
            <i class="fas fa-user-plus me-1"></i> Registrar Empleado
        </a>
    </div>

    <?php if(session('success')): ?>
        <div class="alert alert-success border-0 shadow-sm mb-4">
            <?php echo e(session('success')); ?>

        </div>
    <?php endif; ?>

    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small">
                        <tr>
                            <th class="ps-4">ID NÓMINA</th>
                            <th>NOMBRE COMPLETO</th>
                            <th>ROL / PUESTO</th>
                            <th>CONTACTO</th>
                            <th class="text-end pe-4">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $__empty_1 = true; $__currentLoopData = $employees; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $employee): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <tr>
                            <td class="ps-4 fw-bold text-primary"><?php echo e($employee->payroll_id); ?></td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="bg-light p-2 rounded-circle me-3">
                                        <i class="fas fa-user text-muted"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold"><?php echo e($employee->first_name); ?> <?php echo e($employee->last_name); ?></div>
                                        <small class="text-muted">Tarifa: $<?php echo e(number_format($employee->hourly_rate, 2)); ?>/hr</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge rounded-pill bg-info bg-opacity-10 text-info px-3">
                                    <?php echo e($employee->role->name ?? 'Sin Rol'); ?>

                                </span>
                            </td>
                            <td>
                                <div class="small"><i class="fas fa-envelope me-1 text-muted"></i> <?php echo e($employee->email); ?></div>
                                <div class="small"><i class="fas fa-phone me-1 text-muted"></i> <?php echo e($employee->phone); ?></div>
                            </td>
                            <td class="text-end pe-4">
                                <div class="btn-group shadow-sm">
                                    <a href="<?php echo e(route('employees.show', $employee->id)); ?>" class="btn btn-sm btn-white text-primary" title="Ver Detalles">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <a href="<?php echo e(route('employees.edit', $employee->id)); ?>" class="btn btn-sm btn-white text-warning" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <button type="button" class="btn btn-sm btn-white text-danger" title="Eliminar" 
                                            onclick="confirmDelete(<?php echo e($employee->id); ?>)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <form id="delete-form-<?php echo e($employee->id); ?>" action="<?php echo e(route('employees.destroy', $employee->id)); ?>" method="POST" class="d-none">
                                    <?php echo csrf_field(); ?> <?php echo method_field('DELETE'); ?>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr>
                            <td colspan="5" class="text-center py-5 text-muted">No hay empleados registrados.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
    function confirmDelete(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este empleado? Esto también podría eliminar su cuenta de usuario.')) {
            document.getElementById('delete-form-' + id).submit();
        }
    }
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/luis-yahir/laravel/grocery-store/resources/views/employees/index.blade.php ENDPATH**/ ?>