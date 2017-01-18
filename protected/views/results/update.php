<?php
/* @var $this ResultsController */
/* @var $model Results */

$this->breadcrumbs = array(
    'Results' => array('index'),
    $model->id => array('view', 'id' => $model->id),
    'Update',
);

$this->menu = array(
    array('label' => 'List Results', 'url' => array('index')),
    array('label' => 'Create Results', 'url' => array('create')),
    array('label' => 'View Results', 'url' => array('view', 'id' => $model->id)),
    array('label' => 'Manage Results', 'url' => array('admin')),
);
?>

    <h1>Update Results <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>