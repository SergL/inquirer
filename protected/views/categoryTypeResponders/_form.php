<?php
/* @var $this CategoryTypeRespondersController */
/* @var $model CategoryTypeResponders */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'category-type-responders-form',
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
        <?php echo $form->labelEx($model, 'categories_id'); ?>
        <?php echo $form->textField($model, 'categories_id'); ?>
        <?php echo $form->error($model, 'categories_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'type_responders_id'); ?>
        <?php echo $form->textField($model, 'type_responders_id'); ?>
        <?php echo $form->error($model, 'type_responders_id'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->