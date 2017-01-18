<?php
/* @var $this TestSectionsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Tests') => array('tests/index'),
    $tests->name => array('tests/view', 'id' => $tests->id),
    Yii::t('inquirer', 'Test Sections'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'Create TestSections'), 'url' => array('create', 'tests_id' => $tests->id)),
    array(
        'label' => Yii::t('inquirer', 'Create Sections'),
        'url' => array('/sections/create', 'tests_id' => $tests->id)
    ),
    array('label' => Yii::t('inquirer', 'Back to test'), 'url' => array('tests/view', 'id' => $tests->id)),

//	array('label'=>Yii::t('inquirer','Manage TestSections'), 'url'=>array('admin')),
);
?>

<h1><?php echo Yii::t('inquirer', 'List sections in tests "{testName}"', array('{testName}' => $tests->name)); ?></h1>

<?php
$this->widget(
    'zii.widgets.grid.CGridView',
    array(
        'id' => 'test-sections-grid',
        'dataProvider' => $dataProvider,
        'template' => "{items}\n{pager}",
//        'filter'=>$model,
        'columns' => array(
//            'id',

//            array(
//                'name' => 'tests_id',
//                'filter' => Tests::getDataDropList(),
//                'value' => '$data->tests->name',
//            ),

            array(
                'name' => Yii::t('inquirer', 'Title In Backend'),
                'filter' => Sections::getDataDropList(),
                'value' => '$data->sections->title_in_backend',
            ),
            array(
                'name' => 'sections_id',
                'filter' => Sections::getDataDropList(),
                'value' => '$data->sections->name',
            ),
//            array(
//                'label'=>Yii::t('inquirer','Title In Backend'),
//                'type'=>Sections::getDataDropList(),
//                'value'=>'$data->sections->title_in_backend',
//            ),
//            array(
//                'label'=>'sections_id',
//                'filter' => Sections::getDataDropList(),
//                'value'=> '$data->sections->name',
//            ),
            'sort',
            'count_allow_quests',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
);
?>
