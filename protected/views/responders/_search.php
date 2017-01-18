<?php
/* @var $this RespondersController */
/* @var $model Responders */
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
        <?php echo $form->label($model, 'type_responders_id'); ?>
        <?php echo $form->textField($model, 'type_responders_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'responder_id'); ?>
        <?php echo $form->textField($model, 'responder_id', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'info_detailed'); ?>
        <?php echo $form->textArea($model, 'info_detailed', array('rows' => 6, 'cols' => 50)); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->