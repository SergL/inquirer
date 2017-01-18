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
    Yii::t('global', 'View'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Answers'), 'url' => array('list', 'id' => $model->test_quests_id)),
    array(
        'label' => Yii::t('inquirer', 'Create Answers'),
        'url' => array('create', 'test_quests_id' => $model->test_quests_id)
    ),
    array('label' => Yii::t('inquirer', 'Update Answers'), 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => Yii::t('inquirer', 'Delete Answers'),
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => Yii::t('inquirer', 'Manage Answers'), 'url' => array('admin')),
);
?>

<h1>View Answers #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            'test_quests_id',
            'answer',
            array(
                'label' => 'is_correct',
                'type' => 'raw',
                'value' => MyCHtml::booleanText($model->is_correct)
            ),
            'file_name',
            'sort',
        ),
    )
); ?>
