<?php
/* @var $this AnswersController */
/* @var $data Answers */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('test_quests_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->test_quests_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('answer')); ?>:</b>
    <?php echo MyCHtml::encode($data->answer); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('is_correct')); ?>:</b>
    <?php echo MyCHtml::booleanText($data->is_correct); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('file_name')); ?>:</b>
    <?php echo MyCHtml::encode($data->file_name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('sort')); ?>:</b>
    <?php echo MyCHtml::encode($data->sort); ?>
    <br/>


</div>