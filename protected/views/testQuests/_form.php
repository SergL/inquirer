<?php
/* @var $this TestQuestsController */
/* @var $model TestQuests */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'test-quests-form',
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
    if (!empty($model->test_sections_id)) {
        echo $form->hiddenField($model, 'test_sections_id');
    } else {
        ?>
        <div class="row">
            <?php echo $form->labelEx($model, 'test_sections_id'); ?>
            <!--            --><?php //echo $form->textField($model,'test_sections_id'); ?>
            <?php echo $form->dropDownList(
                $model,
                'test_sections_id',
                TestSections::getDataDropList(),
                array('empty' => '(' . Yii::t('inquirer', 'Select a section in form') . ')')
            ); ?>
            <?php echo $form->error($model, 'test_sections_id'); ?>
        </div>
    <?php } ?>

    <div class="row">
        <?php echo $form->labelEx($model, 'quests_id'); ?>
        <!--		--><?php //echo $form->textField($model,'quests_id'); ?>
        <?php echo $form->dropDownList(
            $model,
            'quests_id',
            Quests::getDataDropList(),
            array('empty' => '(' . Yii::t('inquirer', 'Select question') . ')')
        ); ?>
        <?php echo $form->error($model, 'quests_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'type_quests_id'); ?>
        <!--		--><?php //echo $form->textField($model,'type_quests_id'); ?>
        <?php echo $form->dropDownList(
            $model,
            'type_quests_id',
            TypeQuests::getDataDropList(),
            array('empty' => '(' . Yii::t('inquirer', 'Select type of question') . ')')
        ); ?>
        <?php echo $form->error($model, 'type_quest_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'requred'); ?>
        <?php echo $form->checkBox($model, 'requred'); ?>
        <?php echo $form->error($model, 'requred'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'sort'); ?>
        <?php echo $form->textField($model, 'sort'); ?>
        <?php echo $form->error($model, 'sort'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'correct_text_value'); ?>
        <?php echo $form->textField($model, 'correct_text_value', array('size' => 60, 'maxlength' => 255)); ?>
        <?php echo $form->error($model, 'correct_text_value'); ?>
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