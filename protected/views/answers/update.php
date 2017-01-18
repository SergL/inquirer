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
    Yii::t('global', 'Change'),
);

$this->menu = array(

    array('label' => Yii::t('inquirer', 'List Answers'), 'url' => array('list', 'id' => $model->test_quests_id)),
    array(
        'label' => Yii::t('inquirer', 'Create Answers'),
        'url' => array('create', 'test_quests_id' => $model->test_quests_id)
    ),
    array('label' => Yii::t('inquirer', 'View Answers'), 'url' => array('view', 'id' => $model->id)),
    array('label' => Yii::t('inquirer', 'Manage Answers'), 'url' => array('admin')),


);
?>

    <h1>Update Answers <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>