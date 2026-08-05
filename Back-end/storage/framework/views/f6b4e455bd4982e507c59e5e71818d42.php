<h2>Entrada de mercancía confirmada</h2>

<p><strong>Proveedor:</strong> <?php echo e($note->supplier->company_name ?? '—'); ?></p>
<p><strong>Confirmó:</strong> <?php echo e($employee->first_name); ?> <?php echo e($employee->last_name); ?></p>
<p><strong>Fecha:</strong> <?php echo e(now()->format('d/m/Y H:i')); ?></p>

<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
    <tr style="background:#f3f4f6;">
        <th align="left">Producto</th>
        <th>Pactado</th>
        <th>Recibido</th>
        <th>Diferencia</th>
    </tr>
    <?php $__currentLoopData = $diferencias; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $d): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
            <td><?php echo e($d['producto']); ?></td>
            <td align="center"><?php echo e($d['pactado']); ?></td>
            <td align="center"><?php echo e($d['recibido']); ?></td>
            <td align="center" style="color: <?php echo e($d['diferencia'] < 0 ? '#dc2626' : ($d['diferencia'] > 0 ? '#d97706' : '#16a34a')); ?>;">
                <?php if($d['diferencia'] === 0): ?> completo
                <?php elseif($d['diferencia'] < 0): ?> faltaron <?php echo e(abs($d['diferencia'])); ?>

                <?php else: ?> llegaron <?php echo e($d['diferencia']); ?> de más
                <?php endif; ?>
            </td>
        </tr>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</table>

<?php if($observaciones): ?>
    <h3>Observaciones del encargado</h3>
    <p style="background:#fef3c7; padding:10px; border-left:4px solid #d97706;"><?php echo e($observaciones); ?></p>
<?php endif; ?><?php /**PATH /home/yahir/grocery_store/Back-end/resources/views/emails/supplier_note_confirmed.blade.php ENDPATH**/ ?>