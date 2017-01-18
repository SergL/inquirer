<?php
/* @var $this TestSectionsController */
/* @var $data TestSections */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('tests_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->tests->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('sections_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->sections->title_in_backend); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('count_allow_quests')); ?>:</b>
    <?php echo MyCHtml::encode($data->count_allow_quests); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('sort')); ?>:</b>
    <?php echo MyCHtml::encode($data->sort); ?>
    <br/>


</div>