<?php
/* @var $this TypeRespondersController */
/* @var $model TypeResponders */

$this->breadcrumbs = array(
    'Type Responders' => array('index'),
    $model->name => array('view', 'id' => $model->id),
    'Update',
);

$this->menu = array(
    array('label' => 'List TypeResponders', 'url' => array('index')),
    array('label' => 'Create TypeResponders', 'url' => array('create')),
    array('label' => 'View TypeResponders', 'url' => array('view', 'id' => $model->id)),
    array('label' => 'Manage TypeResponders', 'url' => array('admin')),
);
?>

    <h1>Update TypeResponders <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>