<?php
/* @var $this ReportsController */
/* @var $data Reports */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('tests_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->tests_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('responders_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->responders_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('datetime_begin')); ?>:</b>
    <?php echo MyCHtml::encode($data->datetime_begin); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('datetime_end')); ?>:</b>
    <?php echo MyCHtml::encode($data->datetime_end); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('sort')); ?>:</b>
    <?php echo MyCHtml::encode($data->sort); ?>
    <br/>


</div>