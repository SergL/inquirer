<?php
/* @var $this QuestsController */
/* @var $model Quests */

$this->breadcrumbs = array(
    'Quests' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => 'List Quests', 'url' => array('index')),
    array('label' => 'Manage Quests', 'url' => array('admin')),
);
?>

    <h1>Create Quests</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>