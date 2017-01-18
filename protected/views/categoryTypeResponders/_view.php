<?php
/* @var $this CategoryTypeRespondersController */
/* @var $data CategoryTypeResponders */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('categories_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->categories_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('type_responders_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->type_responders_id); ?>
    <br/>


</div>