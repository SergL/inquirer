<?php
/* @var $this ResultsController */
/* @var $data Results */
?>

<div class="view">

    <b><?php echo MyCHtml::encode('Id'); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data['id']), array('report', 'id' => $data['id'])); ?>
    <br/>

    <b><?php echo MyCHtml::encode(Yii::t('inquirer', 'Tests Name')); ?>:</b>
    <?php echo MyCHtml::encode($data['tests__name']); ?>
    <br/>

    <b><?php echo MyCHtml::encode(Yii::t('inquirer', 'responders__info_detailed')); ?>:</b>
    <?php echo MyCHtml::encode($data['responders__info_detailed']); ?>
    <br/>

    <b><?php echo MyCHtml::encode(Yii::t('inquirer', 'reports__datetime_begin')); ?>:</b>
    <?php echo MyCHtml::encode($data['reports__datetime_begin']); ?>
    <br/>
    <b><?php echo MyCHtml::encode(Yii::t('inquirer', 'reports__datetime_end')); ?>:</b>
    <?php echo MyCHtml::encode($data['reports__datetime_end']); ?>


</div>