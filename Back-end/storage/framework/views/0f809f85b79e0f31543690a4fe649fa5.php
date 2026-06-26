<?php $__env->startSection('content'); ?>
<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800 fw-bold">Catálogo de Productos</h1>
        
        <div class="d-flex gap-2">
            <a href="<?php echo e(route('products.trashed')); ?>" class="btn btn-outline-secondary shadow-sm">
                <i class="fas fa-trash-restore me-1"></i> Ver Eliminados
            </a>

            <a href="<?php echo e(route('products.create')); ?>" class="btn btn-primary shadow-sm">
                <i class="fas fa-plus me-1"></i> Nuevo Producto
            </a>
        </div>
    </div>

    <?php if(session('success')): ?>
        <div class="alert alert-success border-0 shadow-sm mb-4">
            <i class="fas fa-check-circle me-2"></i> <?php echo e(session('success')); ?>

        </div>
    <?php endif; ?>

    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small">
                        <tr>
                            <th class="ps-4">PRODUCTO</th>
                            <th>CATEGORÍA</th>
                            <th>P. COMPRA</th>
                            <th>P. VENTA</th>
                            <th class="text-success">GANANCIA UNIT.</th>
                            <th>STOCK</th>
                            <th class="text-end pe-4">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $__empty_1 = true; $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                        <tr>
                            <td class="ps-4">
                                <div class="d-flex align-items-center">
                                    <div class="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary text-center" style="width: 40px;">
                                        <i class="fas fa-box"></i>
                                    </div>
                                    <div class="fw-bold text-dark"><?php echo e($product->name); ?></div>
                                </div>
                            </td>
                            <td><span class="badge bg-light text-dark border px-3"><?php echo e($product->category->name ?? 'N/A'); ?></span></td>
                            <td class="text-muted">$<?php echo e(number_format($product->purchase_price, 2)); ?></td>
                            <td class="fw-bold text-dark">$<?php echo e(number_format($product->price, 2)); ?></td>
                            <td class="fw-bold text-success">
                                $<?php echo e(number_format($product->price - $product->purchase_price, 2)); ?>

                            </td>
                            <td>
                                <span class="fw-bold <?php echo e($product->stock <= 5 ? 'text-danger' : 'text-dark'); ?>">
                                    <?php echo e($product->stock); ?>

                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <div class="btn-group shadow-sm">
                                    <a href="<?php echo e(route('products.show', $product->id)); ?>" class="btn btn-sm btn-white text-primary" title="Ver detalle">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    
                                    <a href="<?php echo e(route('products.edit', $product->id)); ?>" class="btn btn-sm btn-white text-warning" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </a>

                                    <form action="<?php echo e(route('products.destroy', $product->id)); ?>" method="POST" class="d-inline">
                                        <?php echo csrf_field(); ?> <?php echo method_field('DELETE'); ?>
                                        <button type="submit" class="btn btn-sm btn-white text-danger" title="Eliminar" onclick="return confirm('¿Enviar producto a la papelera?')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                        <tr>
                            <td colspan="7" class="text-center py-5 text-muted">No hay productos registrados.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /home/luis-yahir/laravel/grocery-store/resources/views/products/products.blade.php ENDPATH**/ ?>