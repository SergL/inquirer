<?php
/* @var $this AnswersController */
/* @var $model Answers */

$this->breadcrumbs = array(

    Yii::t('inquirer', 'Tests') => array('tests/index'),
    $testQuests->testSections->tests->name => array('tests/view', 'id' => $testQuests->testSections->tests->id),
    Yii::t('inquirer', 'Test Sections') => array('testSections/list', 'id' => $testQuests->testSections->tests->id),
    $testQuests->testSections->sections->title_in_backend => array('list', 'id' => $testQuests->test_sections_id),
    $testQuests->quests->quest => array('/testQuests/view', 'id' => $testQuests->id),
//    'Answers'=>array('index'),
    Yii::t('global', 'List'),


);

$this->menu = array(

    array(
        'label' => Yii::t('inquirer', 'Create Answers'),
        'url' => array('create', 'test_quests_id' => $testQuests->id)
    ),
    array('label' => '----------------', 'url' => '#'),
    array(

        'label' => Yii::t('inquirer', 'Test Quests'),
        'url' => array('/testQuests/view', 'id' => $testQuests->id)
    ),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#answers-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1><?php echo Yii::t('inquirer', 'Answers'); ?></h1>

<?php



$this->widget(
    'zii.widgets.grid.CGridView',
    array(
        'id' => 'test-quests-grid',
        'dataProvider' => $dataProvider,
        'template' => "{items}\n{pager}",
//        'filter'=>$model,
        'columns' => array(
//		'id',
//		'test_quests_id',
            'answer',
            'is_correct',
            'file_name',
            'sort',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
);


?>
