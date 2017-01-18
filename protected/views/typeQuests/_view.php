<?php
/* @var $this TypeQuestsController */
/* @var $data TypeQuests */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo MyCHtml::encode($data->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('type')); ?>:</b>
    <?php echo MyCHtml::encode($data->type); ?>
    <br/>


</div>