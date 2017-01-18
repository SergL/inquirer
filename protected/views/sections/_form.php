<?php
/* @var $this SectionsController */
/* @var $model Sections */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'sections-form',
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
        <?php echo $form->labelEx($model, 'title_in_backend'); ?>
        <?php echo $form->textField($model, 'title_in_backend', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'title_in_backend'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'name'); ?>
        <?php echo $form->textField($model, 'name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'name'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'sort'); ?>
        <?php echo $form->textField($model, 'sort'); ?>
        <?php echo $form->error($model, 'sort'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'count_allow_quests'); ?>
        <?php echo $form->textField($model, 'count_allow_quests'); ?>
        <?php echo $form->error($model, 'count_allow_quests'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->