<?php
/* @var $this TypeQuestsController */
/* @var $model TypeQuests */

$this->breadcrumbs = array(
    'Type Quests' => array('index'),
    $model->name => array('view', 'id' => $model->id),
    'Update',
);

$this->menu = array(
    array('label' => 'List TypeQuests', 'url' => array('index')),
    array('label' => 'Create TypeQuests', 'url' => array('create')),
    array('label' => 'View TypeQuests', 'url' => array('view', 'id' => $model->id)),
    array('label' => 'Manage TypeQuests', 'url' => array('admin')),
);
?>

    <h1>Update TypeQuests <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>