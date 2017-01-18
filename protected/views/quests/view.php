<?php
/* @var $this QuestsController */
/* @var $model Quests */

$this->breadcrumbs = array(
    'Quests' => array('index'),
    $model->id,
);

$this->menu = array(
    array('label' => 'List Quests', 'url' => array('index')),
    array('label' => 'Create Quests', 'url' => array('create')),
    array('label' => 'Update Quests', 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => 'Delete Quests',
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => 'Manage Quests', 'url' => array('admin')),
);
?>

<h1>View Quests #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            'quest',
            'file_name',
        ),
    )
); ?>
