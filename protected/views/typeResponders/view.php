<?php
/* @var $this TypeRespondersController */
/* @var $model TypeResponders */

$this->breadcrumbs = array(
    'Type Responders' => array('index'),
    $model->name,
);

$this->menu = array(
    array('label' => 'List TypeResponders', 'url' => array('index')),
    array('label' => 'Create TypeResponders', 'url' => array('create')),
    array('label' => 'Update TypeResponders', 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => 'Delete TypeResponders',
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => 'Manage TypeResponders', 'url' => array('admin')),
);
?>

<h1>View TypeResponders #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            'name',
            'table_name',
            'primary_key_field_name',
            'modules',
        ),
    )
); ?>
