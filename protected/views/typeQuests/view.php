<?php
/* @var $this TypeQuestsController */
/* @var $model TypeQuests */

$this->breadcrumbs = array(
    'Type Quests' => array('index'),
    $model->name,
);

$this->menu = array(
    array('label' => 'List TypeQuests', 'url' => array('index')),
    array('label' => 'Create TypeQuests', 'url' => array('create')),
    array('label' => 'Update TypeQuests', 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => 'Delete TypeQuests',
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => 'Manage TypeQuests', 'url' => array('admin')),
);
?>

<h1>View TypeQuests #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            'name',
            'type',
        ),
    )
); ?>
