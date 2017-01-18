<?php
/* @var $this TypeRespondersController */
/* @var $data TypeResponders */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo MyCHtml::encode($data->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('table_name')); ?>:</b>
    <?php echo MyCHtml::encode($data->table_name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('primary_key_field_name')); ?>:</b>
    <?php echo MyCHtml::encode($data->primary_key_field_name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('modules')); ?>:</b>
    <?php echo MyCHtml::encode($data->modules); ?>
    <br/>


</div>