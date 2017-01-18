<?php
/* @var $this TestSectionsController */
/* @var $model TestSections */

$this->breadcrumbs = array(
//    Yii::t('inquirer', 'Test Sections')=>array('index'),

    Yii::t('inquirer', 'Tests') => array('tests/index'),
    $model->tests->name => array('tests/view', 'id' => $model->tests->id),
    Yii::t('inquirer', 'Test Sections') => array('list', 'id' => $model->tests_id),
    $model->sections->title_in_backend,
);

$this->menu = array(
//	array('label'=>Yii::t('inquirer', 'List TestSections'), 'url'=>array('index')),
//	array('label'=>Yii::t('inquirer', 'Create TestSections'), 'url'=>array('create')),
    array('label' => Yii::t('inquirer', 'Test Sections'), 'url' => array('list', 'id' => $model->tests_id)),
    array('label' => Yii::t('inquirer', 'Update TestSections'), 'url' => array('update', 'id' => $model->id)),
//	array('label'=>Yii::t('inquirer', 'Delete TestSections') , 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
//	array('label'=>Yii::t('inquirer', 'Manage TestSections') , 'url'=>array('admin')),
    array('label' => '----------------', 'url' => '#'),
    array('label' => Yii::t('inquirer', 'Test Quests'), 'url' => array('/testQuests/list', 'id' => $model->id)),
);
?>


<h1><?php echo Yii::t(
        'inquirer',
        'Section "{sectionName}" in tests "{testName}"',
        array('{sectionName}' => $model->sections->title_in_backend, '{testName}' => $model->tests->name)
    ); ?></h1>
<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
//		'id',

//        array(
//            'label'=>$model->getAttributeLabel('tests_id'),
//            'type'=>'raw',
//            'value'=>$model->tests->name,
//        ),
            array(
                'label' => Yii::t('inquirer', 'Title In Backend'),
                'type' => 'raw',
                'value' => $model->sections->title_in_backend,
            ),
            array(
                'label' => $model->getAttributeLabel('sections_id'),
                'type' => 'raw',
                'value' => $model->sections->name,
            ),
            'count_allow_quests',
            'sort',
        ),
    )
); ?>
