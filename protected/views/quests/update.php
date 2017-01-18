<?php
/* @var $this QuestsController */
/* @var $model Quests */

$this->breadcrumbs = array(
    'Quests' => array('index'),
    $model->id => array('view', 'id' => $model->id),
    'Update',
);

$this->menu = array(
    array('label' => 'List Quests', 'url' => array('index')),
    array('label' => 'Create Quests', 'url' => array('create')),
    array('label' => 'View Quests', 'url' => array('view', 'id' => $model->id)),
    array('label' => 'Manage Quests', 'url' => array('admin')),
);
?>

    <h1>Update Quests <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>