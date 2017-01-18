<?php
/* @var $this SectionsController */
/* @var $data Sections */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('title_in_backend')); ?>:</b>
    <?php echo MyCHtml::encode($data->title_in_backend); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo MyCHtml::encode($data->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('sort')); ?>:</b>
    <?php echo MyCHtml::encode($data->sort); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('count_allow_quests')); ?>:</b>
    <?php echo MyCHtml::encode($data->count_allow_quests); ?>
    <br/>


</div>