<?php
/* @var $this CategoryTypeRespondersController */
/* @var $model CategoryTypeResponders */
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
        <?php echo $form->label($model, 'type_responders_id'); ?>
        <?php echo $form->textField($model, 'type_responders_id'); ?>
    </div>

    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->