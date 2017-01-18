<?php
/* @var $this TestQuestsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(

    Yii::t('inquirer', 'Test Quests'),
);

$this->menu = array(
    array(
        'label' => Yii::t('inquirer', 'Create TestQuests'),
        'url' => array('create', 'test_sections_id' => $testSections->id)
    ),
    array('label' => Yii::t('inquirer', 'Manage TestQuests'), 'url' => array('admin')),
    array('label' => '----------------', 'url' => '#'),
    array(
        'label' => Yii::t('inquirer', 'Back to test sections'),
        'url' => array('/testSections/view', 'id' => $testSections->id)
    ),
);
?>

<h1><?php echo Yii::t('inquirer', 'Test Quests') ?></h1>

<?php


$this->widget(
    'zii.widgets.grid.CGridView',
    array(
        'id' => 'test-quests-grid',
        'dataProvider' => $dataProvider,
//        'template'=>"{items}\n{pager}",
//        'filter'=>$model,
        'columns' => array(
//            'id',
            array(
                'name' => 'quests_id',
                'filter' => Quests::getDataDropList(),
                'value' => '$data->quests->quest',
            ),
            array(
                'name' => 'type_quests_id',
                'filter' => TypeQuests::getDataDropList(),
                'value' => '$data->typeQuests->name',
            ),
//            array(
//                'name' => 'sections_id',
//                'filter' => Sections::getDataDropList(),
//                'value' => '$data->sections->name',
//            ),
            'correct_text_value',
            'sort',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
);

?>
