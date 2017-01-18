<?php
/* @var $this CategoryTypeRespondersController */
/* @var $model CategoryTypeResponders */

$this->breadcrumbs = array(
    'Category Type Responders' => array('index'),
    $model->id,
);

$this->menu = array(
    array('label' => 'List CategoryTypeResponders', 'url' => array('index')),
    array('label' => 'Create CategoryTypeResponders', 'url' => array('create')),
    array('label' => 'Update CategoryTypeResponders', 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => 'Delete CategoryTypeResponders',
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => 'Manage CategoryTypeResponders', 'url' => array('admin')),
);
?>

<h1>View CategoryTypeResponders #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            'categories_id',
            'type_responders_id',
        ),
    )
); ?>
