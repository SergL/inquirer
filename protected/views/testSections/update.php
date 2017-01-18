<?php
/* @var $this TestSectionsController */
/* @var $model TestSections */

$this->breadcrumbs = array(

    Yii::t('inquirer', 'Tests') => array('tests/index'),
    $model->tests->name => array('tests/view', 'id' => $model->tests->id),
    Yii::t('inquirer', 'Test Sections') => array('list', 'id' => $model->tests_id),
    $model->id => array('view', 'id' => $model->id),
    Yii::t('global', 'Change'),
);

$this->menu = array(
    array(
        'label' => Yii::t('inquirer', 'Create TestSections'),
        'url' => array('create', 'tests_id' => $model->tests->id)
    ),
//	array('label'=>Yii::t('inquirer', 'Create TestSections'), 'url'=>array('create')),
    array('label' => Yii::t('inquirer', 'View TestSections'), 'url' => array('view', 'id' => $model->id)),
//	array('label'=>Yii::t('inquirer', 'Manage TestSections'), 'url'=>array('admin')),
);
?>

    <h1><?php echo Yii::t('inquirer', 'Update TestSections'); ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>