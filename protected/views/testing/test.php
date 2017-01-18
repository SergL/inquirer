<?php
/* @var $this TestsController */
/* @var $model Tests */

$this->breadcrumbs = array(
    'Tests Outputs' => array('index'),
//    $model->name,
);
//
//$this->menu=array(
//	array('label'=>'List Tests', 'url'=>array('index')),
//	array('label'=>'Create Tests', 'url'=>array('create')),
//	array('label'=>'Update Tests', 'url'=>array('update', 'id'=>$model->id)),
//	array('label'=>'Delete Tests', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
//	array('label'=>'Manage Tests', 'url'=>array('admin')),
//);
?>

<!--<h1>View Tests #--><?php //echo $model->id; ?><!--</h1>-->

<?php

?>
<h1><?php echo Yii::t('inquirer', 'Tests name');
    echo $data['name']; ?></h1>

<div class="form">
    <?php echo MyCHtml::beginForm(); ?>
    <?php echo MyCHtml::hiddenField("Reports[id]", $data['reports']['id']); ?>
    <?php echo MyCHtml::hiddenField('Reports[tests_id]', $data['reports']['tests_id']); ?>
    <?php echo MyCHtml::hiddenField('Reports[responders_id]', $data['reports']['responders_id']); ?>
    <?php $datetimeBegin = (empty($data['reports']['tests_id'])) ? date('Y-m-d H:i:00') : date(
        'Y-m-d H:i:00',
        strtotime($data['reports']['datetime_begin'])
    ) ?>
    <?php echo MyCHtml::hiddenField('Reports[datetime_begin]', $datetimeBegin); ?>
    <?php
    $counter = 0;
    $htmlOptions = array();
    ?>
    <?php foreach ($data['sections'] as $section) { ?>
        <h2>
            <?php echo Yii::t('inquirer', 'Section name') . ': ' . $section['name']; ?>

            <!--        --><?php //echo ': '. $section['name'];?>
        </h2>
        <hr>
        <?php if (!empty($section['quests'])) { ?>
            <?php foreach ($section['quests'] as $quest) { ?>

                <div class="row">

                    <?php
                    if (isset($quest['answers'])) {
                        $dataAnswers = $quest['answers'];
                    } else {
                        $dataAnswers = '';
                    }
                    $fieldName = $label . '[' . $counter . ']';
                    echo MyCHtml::label($quest['quest'], $fieldName . '[answer]');
                    echo MyCHtml::hiddenField($fieldName . '[test_quests_id]', $quest['test_quests_id']);
                    echo MyCHtml::hiddenField($fieldName . '[type_quests_type]', $quest['type']);
                    $typeQuestsObj = new TypeQuestsStrategy($quest['type']);
                    echo $typeQuestsObj->generateHtml($fieldName, $dataAnswers, $htmlOptions, $quest['quest']);

                    //                    echo TypeQuestsHtml::$quest['type']($fieldName, $dataAnswers, $htmlOptions);
                    ?>
                    <?php $counter++; ?>
                </div>
            <?php } ?>

        <?php } ?>

    <?php } ?>


    <hr>
    <div class="row submit">
        <?php echo MyCHtml::submitButton(Yii::t('global', 'Send')); ?>
    </div>

    <?php echo MyCHtml::endForm(); ?>
</div><!-- form -->
