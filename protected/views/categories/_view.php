<?php
/* @var $this CategoriesController */
/* @var $data Categories */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo MyCHtml::encode($data->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('description')); ?>:</b>
    <?php echo MyCHtml::encode($data->description); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('modules_before')); ?>:</b>
    <?php echo MyCHtml::encode($data->modules_before); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('modules_after')); ?>:</b>
    <?php echo MyCHtml::encode($data->modules_after); ?>
    <br/>


</div>