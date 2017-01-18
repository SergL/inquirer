<?php
/* @var $this TestsController */
/* @var $model Tests */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $forare requirem = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'tests-form',
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
    <?php echo $form->hiddenField($model, 'admins_id', array('value' => Yii::app()->user->id)); ?>

    <div class="row">
        <?php echo $form->labelEx($model, 'categories_id'); ?>
        <?php echo $form->dropDownList(
            $model,
            'categories_id',
            Categories::getDataDropList(),
            array('empty' => '(' . Yii::t('inquirer', 'Select a category') . ')')
        ); ?>
        <?php echo $form->error($model, 'categories_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'name'); ?>
        <?php echo $form->textField($model, 'name', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'name'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'count_allow_quests'); ?>
        <?php echo $form->textField($model, 'count_allow_quests'); ?>
        <?php echo $form->error($model, 'count_allow_quests'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'datetime_create'); ?>
        <?php echo $form->textField($model, 'datetime_create'); ?>
        <?php echo $form->error($model, 'datetime_create'); ?>
    </div>


    <div class="row">
        <?php echo $form->labelEx($model, 'is_enabled'); ?>
        <?php echo $form->checkBox($model, 'is_enabled'); ?>
        <?php echo $form->error($model, 'is_enabled'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'is_periodical'); ?>
        <?php echo $form->checkBox($model, 'is_periodical'); ?>
        <?php echo $form->error($model, 'is_periodical'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'is_del'); ?>
        <?php echo $form->checkBox($model, 'is_del'); ?>
        <?php echo $form->error($model, 'is_del'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'timeout_for_test'); ?>
        <?php echo $form->textField($model, 'timeout_for_test'); ?>
        <?php echo $form->error($model, 'timeout_for_test'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'datetime_start'); ?>
        <?php echo $form->textField($model, 'datetime_start'); ?>
        <!--        <button id="calendar-trigger">646464</button>-->
        <!--        &nbsp;(calendar with time , position 400,200 and a range 2008-2010)-->
        <!--        <?php
//
//        $this->widget('application.extensions.calendar.JSCal2.SCalendar',
//            array('trigger'=>'calendar-trigger',
//                'inputField' =>'Tests_datetime_start',
//                'ifFormat'=>'%Y-%m-%d %H:%M',
//                'showTime'=>true,
////                'position'=>"[400,200]",
////                'range'=>"[2008,2010]",
//            ));
        ?>
-->
        <?php //echo $form->error($model,'datetime_start'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'datetime_stop'); ?>
        <?php echo $form->textField($model, 'datetime_stop'); ?>
        <?php echo $form->error($model, 'datetime_stop'); ?>
    </div>


    <div class="row buttons">
        <?php echo MyMyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->