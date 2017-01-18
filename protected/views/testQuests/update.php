<?php
/* @var $this TestQuestsController */
/* @var $model TestQuests */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Test Quests') => array('index'),
    $model->id => array('view', 'id' => $model->id),
    Yii::t('global', 'Change'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List TestQuests'), 'url' => array('list', 'id' => $model->test_sections_id)),
    array(
        'label' => Yii::t('inquirer', 'Create TestQuests'),
        'url' => array('create', 'test_sections_id' => $model->test_sections_id)
    ),
    array('label' => Yii::t('inquirer', 'View TestQuests'), 'url' => array('view', 'id' => $model->id)),
    array('label' => Yii::t('inquirer', 'Manage TestQuests'), 'url' => array('admin')),
);
?>
    <h1><?php echo Yii::t(
            'inquirer',
            'Update quests "{questsQuest}" in section "{sectionsName}"',
            array(
                '{questsQuest}' => $model->quests->quest,
                '{sectionsName}' => $model->testSections->sections->title_in_backend
            )
        );?> </h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>