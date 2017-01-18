<div class="form">

    <?php $form = $this->beginWidget(
        'CActiveForm',
        array(
            'id' => 'user-form',
            'enableAjaxValidation' => true,
            'clientOptions' => array(
                'validateOnSubmit' => true,
                'validateOnChange' => false,
            ),
        )
    ); ?>

    <p class="note"><?php echo Yii::t('global', 'Fields with'); ?> <span class="required">*</span> <?php echo Yii::t(
            'global',
            'are required'
        ); ?>.</p>

    <?php echo $form->errorSummary($model); ?>

    <div class="row">
        <?php echo $form->labelEx($model, 'login'); ?>
        <?php echo $form->textArea($model, 'login', array('rows' => 6, 'cols' => 50)); ?>
        <?php echo $form->error($model, 'login'); ?>
    </div>

    <div class="row">

        <?php echo $form->labelEx($model, 'password_new'); ?>
        <?php echo $form->passwordField($model, 'password_new', array('size' => 20, 'value' => '')); ?>
        <?php echo $form->error($model, 'password_new'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'role'); ?>
        <?php echo $form->dropDownList($model, 'role', MyCHtml::listData($model->getListRole(), 'id', 'name')); ?>
        <?php echo $form->error($model, 'role'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'date_create'); ?>
        <?php echo $form->textField($model, 'date_create'); ?>
        <?php echo $form->error($model, 'date_create'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'alias'); ?>
        <?php echo $form->textArea($model, 'alias', array('rows' => 6, 'cols' => 50)); ?>
        <?php echo $form->error($model, 'alias'); ?>
    </div>


    <div class="row buttons">
        <?php echo MyCHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->