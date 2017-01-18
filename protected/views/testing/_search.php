<?php
/* @var $this TestsController */
/* @var $model Tests */
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
        <?php echo $form->label($model, 'categories_id'); ?>
        <?php echo $form->textField($model, 'categories_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'name'); ?>
        <?php echo $form->textField($model, 'name', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'admins_id'); ?>
        <?php echo $form->textField($model, 'admins_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'is_enabled'); ?>
        <?php echo $form->textField($model, 'is_enabled'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'is_periodical'); ?>
        <?php echo $form->textField($model, 'is_periodical'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'is_del'); ?>
        <?php echo $form->textField($model, 'is_del'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'count_allow_quests'); ?>
        <?php echo $form->textField($model, 'count_allow_quests'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'datetime_create'); ?>
        <?php echo $form->textField($model, 'datetime_create'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'datetime_start'); ?>
        <?php echo $form->textField($model, 'datetime_start'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'datetime_stop'); ?>
        <?php echo $form->textField($model, 'datetime_stop'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'timeout_for_test'); ?>
        <?php echo $form->textField($model, 'timeout_for_test'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->