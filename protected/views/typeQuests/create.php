<?php
/* @var $this TypeQuestsController */
/* @var $model TypeQuests */

$this->breadcrumbs = array(
    'Type Quests' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => 'List TypeQuests', 'url' => array('index')),
    array('label' => 'Manage TypeQuests', 'url' => array('admin')),
);
?>

    <h1>Create TypeQuests</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>