<?php
/* @var $this CategoryTypeRespondersController */
/* @var $model CategoryTypeResponders */

$this->breadcrumbs = array(
    'Category Type Responders' => array('index'),
    $model->id => array('view', 'id' => $model->id),
    'Update',
);

$this->menu = array(
    array('label' => 'List CategoryTypeResponders', 'url' => array('index')),
    array('label' => 'Create CategoryTypeResponders', 'url' => array('create')),
    array('label' => 'View CategoryTypeResponders', 'url' => array('view', 'id' => $model->id)),
    array('label' => 'Manage CategoryTypeResponders', 'url' => array('admin')),
);
?>

    <h1>Update CategoryTypeResponders <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>