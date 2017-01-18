<?php
/* @var $this SectionsController */
/* @var $model Sections */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Sections') => array('index'),
    $model->name => array('view', 'id' => $model->id),
    Yii::t('global', 'Change'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Sections'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Create Sections'), 'url' => array('create')),
    array('label' => Yii::t('inquirer', 'View Sections'), 'url' => array('view', 'id' => $model->id)),
    array('label' => Yii::t('inquirer', 'Manage Sections'), 'url' => array('admin')),
);
?>

    <h1><?php echo Yii::t('inquirer', 'Update Sections'); ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>