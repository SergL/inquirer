<?php
/* @var $this ResultsController */
/* @var $model Results */
/* @var $form CActiveForm */
?>

<div class="wide form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'action' => Yii::app()->createUrl($this->route),
            'method' => 'get',
        )
    ); ?>

    <div class="row">
        <?php echo $form->label($model, 'id'); ?>
        <?php echo $form->textField($model, 'id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'reports_id'); ?>
        <?php echo $form->textField($model, 'reports_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'test_quests_id'); ?>
        <?php echo $form->textField($model, 'test_quests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'answers_id'); ?>
        <?php echo $form->textField($model, 'answers_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'answer'); ?>
        <?php echo $form->textArea($model, 'answer', array('rows' => 6, 'cols' => 50)); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->