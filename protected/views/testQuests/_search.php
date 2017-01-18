<?php
/* @var $this TestQuestsController */
/* @var $model TestQuests */
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
        <?php echo $form->label($model, 'test_sections_id'); ?>
        <?php echo $form->textField($model, 'test_sections_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'quests_id'); ?>
        <?php echo $form->textField($model, 'quests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'type_quests_id'); ?>
        <?php echo $form->textField($model, 'type_quests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'sort'); ?>
        <?php echo $form->textField($model, 'sort'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'correct_text_value'); ?>
        <?php echo $form->textField($model, 'correct_text_value', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'requred'); ?>
        <?php echo $form->textField($model, 'requred'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'file_name'); ?>
        <?php echo $form->textField($model, 'file_name', array('size' => 60, 'maxlength' => 255)); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->