<?php
/* @var $this AnswersController */
/* @var $model Answers */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'answers-form',
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

    <?php
    if (!empty($model->test_quests_id)) {
        echo $form->hiddenField($model, 'test_quests_id');
    } else {
        ?>
        <div class="row">
            <?php echo $form->labelEx($model, 'test_quests_id'); ?>
            <?php echo $form->textField($model, 'test_quests_id'); ?>
            <?php echo $form->error($model, 'test_quests_id'); ?>
        </div>
    <?php } ?>



    <div class="row">
        <?php echo $form->labelEx($model, 'answer'); ?>
        <?php echo $form->textField($model, 'answer', array('size' => 60, 'maxlength' => 500)); ?>
        <?php echo $form->error($model, 'answer'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'is_correct'); ?>
        <?php echo $form->checkBox($model, 'is_correct'); ?>
        <?php echo $form->error($model, 'is_correct'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'file_name'); ?>
        <?php echo $form->textField($model, 'file_name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'file_name'); ?>
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