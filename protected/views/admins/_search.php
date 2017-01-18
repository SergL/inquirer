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
        <?php echo $form->label($model, 'login'); ?>
        <?php echo $form->textArea($model, 'login', array('rows' => 6, 'cols' => 50)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'role'); ?>
        <?php echo $form->textField($model, 'role', array('size' => 60, 'maxlength' => 100)); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'date_create'); ?>
        <?php echo $form->textField($model, 'date_create'); ?>
    </div>

    <div class="row">
        <?php echo $form->label($model, 'alias'); ?>
        <?php echo $form->textArea($model, 'alias', array('rows' => 6, 'cols' => 50)); ?>
    </div>


    <div class="row buttons">
        <?php echo MyCHtml::submitButton('Search'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->