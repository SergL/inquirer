<?php
/* @var $this AnswersController */
/* @var $model Answers */

$this->breadcrumbs = array(
    'Answers' => array('index'),
    'Create',
);


?>

<?php
if (isset($model->test_quests_id)) {

    $this->breadcrumbs = array(
        'Test Sections' => array('index'),

    );

    $this->breadcrumbs = array(
        Yii::t('inquirer', 'Tests') => array('tests/index'),
        $testQuests->testSections->tests->name => array('tests/view', 'id' => $testQuests->testSections->tests->id),
        Yii::t('inquirer', 'Test Sections') => array('testSections/list', 'id' => $testQuests->testSections->tests->id),
        $testQuests->testSections->sections->title_in_backend => array('list', 'id' => $testQuests->test_sections_id),
        $testQuests->quests->quest => array('/testQuests/view', 'id' => $testQuests->id),
//    'Answers'=>array('index'),
        Yii::t('global', 'Create'),
    );
    $this->menu = array(
        array('label' => Yii::t('inquirer', 'List TestQuests'), 'url' => array('list', 'id' => $model->test_quests_id)),
//	    array('label'=>'Manage TestQuests', 'url'=>array('admin') ),
        array('label' => '----------------', 'url' => '#'),
        array(
            'label' => Yii::t('inquirer', 'Back to quest in sections'),
            'url' => array('/testQuests/view', 'id' => $model->test_quests_id)
        ),
    );
} else {

    $this->menu = array(
        array('label' => Yii::t('inquirer', 'List Answers'), 'url' => array('index')),
        array('label' => Yii::t('inquirer', 'Manage Answers'), 'url' => array('admin')),
    );
}
?>

    <h1>Create Answers</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>