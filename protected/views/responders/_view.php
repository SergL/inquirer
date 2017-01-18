<?php
/* @var $this RespondersController */
/* @var $data Responders */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('type_responders_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->typeResponders->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('responder_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->responder_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('info_detailed')); ?>:</b>
    <?php echo MyCHtml::encode($data->info_detailed); ?>
    <br/>


</div>