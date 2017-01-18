<?php
/* @var $this TestSectionsController */
/* @var $model TestSections */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'test-sections-form',
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
    if (isset($model->tests_id)) {
        echo $form->hiddenField($model, 'tests_id');
    } else {
        ?>
        <div class="row">
            <?php echo $form->labelEx($model, 'tests_id'); ?>
            <?php echo $form->dropDownList(
                $model,
                'tests_id',
                Tests::getDataDropList(),
                array('empty' => '(' . Yii::t('inquirer', 'Select a tests') . ')')
            ); ?>
            <?php echo $form->error($model, 'tests_id'); ?>
        </div>

    <?php } ?>


    <div class="row">
        <?php echo $form->labelEx($model, 'sections_id'); ?>
        <!--		--><?php //echo $form->textField($model,'sections_id'); ?>
        <?php echo $form->dropDownList(
            $model,
            'sections_id',
            Sections::getDataDropList(),
            array('empty' => '(' . Yii::t('inquirer', 'Select a sections') . ')')
        ); ?>
        <?php echo $form->error($model, 'sections_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'count_allow_quests'); ?>
        <?php echo $form->textField($model, 'count_allow_quests'); ?>
        <?php echo $form->error($model, 'count_allow_quests'); ?>
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