<?php
/* @var $this TestQuestsController */
/* @var $model TestQuests */

//$this->breadcrumbs=array(
//	'Test Quests'=>array('index'),
//	'Create',
//);


?>

<?php
if (isset($model->test_sections_id)) {

    $this->breadcrumbs = array(
        'Test Sections' => array('index'),

    );

    $this->breadcrumbs = array(
        Yii::t('inquirer', 'Tests') => array('tests/index'),
        $modelTestSections->tests->name => array('tests/view', 'id' => $modelTestSections->tests->id),
        Yii::t('inquirer', 'Test Sections') => array('/testSections/list', 'id' => $model->test_sections_id),
        $modelTestSections->sections->title_in_backend => array('/testSections/view', 'id' => $model->test_sections_id),
        Yii::t('inquirer', 'Create TestQuests'),
    );
    $this->menu = array(
        array(
            'label' => Yii::t('inquirer', 'List TestQuests'),
            'url' => array('list', 'id' => $model->test_sections_id)
        ),
//	    array('label'=>'Manage TestQuests', 'url'=>array('admin') ),
        array('label' => '----------------', 'url' => '#'),
        array(
            'label' => Yii::t('inquirer', 'Create Quests'),
            'url' => array('/quests/create', 'test_sections_id' => $model->test_sections_id)
        ),
    );
} else {

    $this->breadcrumbs = array(
//        Yii::t('inquirer', 'Test Sections') => array('index'),
        Yii::t('global', 'Create'),
    );
}
?>


    <h1><?php echo Yii::t('inquirer', 'Create TestQuests') ?> </h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>