<?php
/* @var $this ReportsController */
/* @var $model Reports */
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
        <?php echo $form->label($model, 'tests_id'); ?>
        <?php echo $form->textField($model, 'tests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'responders_id'); ?>
        <?php echo $form->textField($model, 'responders_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'datetime_begin'); ?>
        <?php echo $form->textField($model, 'datetime_begin'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'datetime_end'); ?>
        <?php echo $form->textField($model, 'datetime_end'); ?>
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