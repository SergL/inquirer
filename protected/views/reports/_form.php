<?php
/* @var $this ReportsController */
/* @var $model Reports */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'reports-form',
            // Please note: When you enable ajax validation, make sure the corresponding
            // controller action is handling ajax validation correctly.
            // There is a call to performAjaxValidation() commented in generated controller code.
            // See class documentation of CActiveForm for details on this.
            'enableAjaxValidation' => false,
        )
    ); ?>

    <p class="note"><?php echo Yii::t('global', 'Fields with'); ?> <span class="required">*</span> <?php echo Yii::t(
            'global',
            'are required'
        ); ?>.</p>

    <?php echo $form->errorSummary($model); ?>

    <div class="row">
        <?php echo $form->labelEx($model, 'tests_id'); ?>
        <?php echo $form->textField($model, 'tests_id'); ?>
        <?php echo $form->error($model, 'tests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'responders_id'); ?>
        <?php echo $form->textField($model, 'responders_id'); ?>
        <?php echo $form->error($model, 'responders_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'datetime_begin'); ?>
        <?php echo $form->textField($model, 'datetime_begin'); ?>
        <?php echo $form->error($model, 'datetime_begin'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'datetime_end'); ?>
        <?php echo $form->textField($model, 'datetime_end'); ?>
        <?php echo $form->error($model, 'datetime_end'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'sort'); ?>
        <?php echo $form->textField($model, 'sort'); ?>
        <?php echo $form->error($model, 'sort'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->