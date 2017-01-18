<?php
/* @var $this QuestsController */
/* @var $model Quests */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'quests-form',
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
        <?php echo $form->labelEx($model, 'quest'); ?>
        <?php echo $form->textField($model, 'quest', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'quest'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'file_name'); ?>
        <?php echo $form->textField($model, 'file_name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'file_name'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->