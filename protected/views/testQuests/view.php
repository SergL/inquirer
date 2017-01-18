<?php
/* @var $this TestQuestsController */
/* @var $model TestQuests */
$title = Yii::t(
    'inquirer',
    'View quest "{questsQuest}" in section "{sectionsName}"',
    array(
        '{questsQuest}' => $model->quests->quest,
        '{sectionsName}' => $model->testSections->sections->title_in_backend
    )
);
$this->pageTitle = $title;
$this->breadcrumbs = array(


    Yii::t('inquirer', 'Tests') => array('tests/index'),
    $model->testSections->tests->name => array('tests/view', 'id' => $model->testSections->tests->id),
    Yii::t('inquirer', 'Test Sections') => array('testSections/list', 'id' => $model->testSections->tests->id),
    $model->testSections->sections->title_in_backend => array('list', 'id' => $model->test_sections_id),
    Yii::t('global', 'View'),

);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List TestQuests'), 'url' => array('list', 'id' => $model->test_sections_id)),
    array(
        'label' => Yii::t('inquirer', 'Create TestQuests'),
        'url' => array('create', 'test_sections_id' => $model->test_sections_id)
    ),
    array('label' => Yii::t('inquirer', 'Update TestQuests'), 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => Yii::t('inquirer', 'Delete quest in section'),
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => Yii::t('global', 'Are you sure you want to delete this item?')
        )
    ),
    array('label' => Yii::t('inquirer', 'Manage TestQuests'), 'url' => array('admin')),


);

if (in_array($model->typeQuests->type, $typesQuestionsWithAnswers)) {

    $this->menu[] = array('label' => '----------------', 'url' => '#');
    $this->menu[] = array(
        'label' => Yii::t('inquirer', 'Answers'),
        'url' => array('/answers/list', 'id' => $model->id)
    );
}



?>

<h1><?php echo $title ?> </h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            array(
                'label' => 'test_sections_id',
                'type' => 'raw',
                'value' => $model->testSections->sections->title_in_backend,
            ),
            array(
                'label' => 'quests_id',
                'type' => 'raw',
                'value' => $model->quests->quest,
            ),
            array(
                'label' => 'type_quests_id',
                'type' => 'raw',
                'value' => $model->typeQuests->name,
            ),
            'sort',
            'correct_text_value',
            'requred',
            'file_name',
        ),
    )
); ?>
