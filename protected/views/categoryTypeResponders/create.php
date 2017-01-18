<?php
/* @var $this CategoryTypeRespondersController */
/* @var $model CategoryTypeResponders */

$this->breadcrumbs = array(
    'Category Type Responders' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => 'List CategoryTypeResponders', 'url' => array('index')),
    array('label' => 'Manage CategoryTypeResponders', 'url' => array('admin')),
);
?>

    <h1>Create CategoryTypeResponders</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>