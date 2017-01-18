<?php
/* @var $this RespondersController */
/* @var $model Responders */

$this->breadcrumbs = array(
    'Responders' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Responders'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Manage Responders'), 'url' => array('admin')),
);
?>

    <h1>Create Responders</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>