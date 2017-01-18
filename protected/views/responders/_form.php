<?php
/* @var $this RespondersController */
/* @var $model Responders */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'responders-form',
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
        <?php echo $form->labelEx($model, 'type_responders_id'); ?>
        <?php echo $form->dropDownList(
            $model,
            'type_responders_id',
            TypeResponders::getDataDropList(),
            array('empty' => '(' . Yii::t('inquirer', 'Select a type responders') . ')')
        ); ?>
        <?php echo $form->error($model, 'type_responders_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'responder_id'); ?>
        <?php echo $form->textField($model, 'responder_id', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'responder_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'info_detailed'); ?>
        <?php echo $form->textArea($model, 'info_detailed', array('rows' => 6, 'cols' => 50)); ?>
        <?php echo $form->error($model, 'info_detailed'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->