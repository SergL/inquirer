<?php
/* @var $this ResultsController */
/* @var $data Results */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('reports__id')); ?>:</b>
    <?php echo MyCHtml::encode($data->reports_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('test_quests__id')); ?>:</b>
    <?php echo MyCHtml::encode($data->test_quests_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('answers__id')); ?>:</b>
    <?php echo MyCHtml::encode($data->answers_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('answers__answer')); ?>:</b>
    <?php echo MyCHtml::encode($data->answer); ?>
    <br/>


</div>