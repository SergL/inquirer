<?php
/* @var $this TypeRespondersController */
/* @var $model TypeResponders */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'type-responders-form',
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
        <?php echo $form->labelEx($model, 'name'); ?>
        <?php echo $form->textField($model, 'name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'name'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'table_name'); ?>
        <?php echo $form->textField($model, 'table_name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'table_name'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'primary_key_field_name'); ?>
        <?php echo $form->textField($model, 'primary_key_field_name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'primary_key_field_name'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'modules'); ?>
        <?php echo $form->textField($model, 'modules', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'modules'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->