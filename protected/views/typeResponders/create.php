<?php
/* @var $this TypeRespondersController */
/* @var $model TypeResponders */

$this->breadcrumbs = array(
    'Type Responders' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => 'List TypeResponders', 'url' => array('index')),
    array('label' => 'Manage TypeResponders', 'url' => array('admin')),
);
?>

    <h1>Create TypeResponders</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>