<?php
/* @var $this QuestsController */
/* @var $data Quests */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('quest')); ?>:</b>
    <?php echo MyCHtml::encode($data->quest); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('file_name')); ?>:</b>
    <?php echo MyCHtml::encode($data->file_name); ?>
    <br/>


</div>