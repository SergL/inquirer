<?php
/* @var $this AnswersController */
/* @var $model Answers */
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
        <?php echo $form->label($model, 'test_quests_id'); ?>
        <?php echo $form->textField($model, 'test_quests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'answer'); ?>
        <?php echo $form->textField($model, 'answer', array('size' => 60, 'maxlength' => 500)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'is_correct'); ?>
        <?php echo $form->textField($model, 'is_correct'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'file_name'); ?>
        <?php echo $form->textField($model, 'file_name', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'sort'); ?>
        <?php echo $form->textField($model, 'sort'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->