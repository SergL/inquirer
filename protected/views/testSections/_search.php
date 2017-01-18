<?php
/* @var $this TestSectionsController */
/* @var $model TestSections */
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
        <?php echo $form->label($model, 'sections_id'); ?>
        <?php echo $form->textField($model, 'sections_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'count_allow_quests'); ?>
        <?php echo $form->textField($model, 'count_allow_quests'); ?>
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