<?php
/* @var $this SectionsController */
/* @var $model Sections */
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
        <?php echo $form->label($model, 'title_in_backend'); ?>
        <?php echo $form->textField($model, 'title_in_backend', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'name'); ?>
        <?php echo $form->textField($model, 'name', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'sort'); ?>
        <?php echo $form->textField($model, 'sort'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'count_allow_quests'); ?>
        <?php echo $form->textField($model, 'count_allow_quests'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->