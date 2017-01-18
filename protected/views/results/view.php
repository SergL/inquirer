<?php
/* @var $this ResultsController */
/* @var $model Results */

$this->breadcrumbs = array(
    'Results' => array('index'),
    $model->id,
);

$this->menu = array(
    array('label' => 'List Results', 'url' => array('index')),
    array('label' => 'Create Results', 'url' => array('create')),
    array('label' => 'Update Results', 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => 'Delete Results',
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => 'Manage Results', 'url' => array('admin')),
);
?>

<h1>View Results #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            'reports_id',
            'test_quests_id',
            'answers_id',
            'answer',
        ),
    )
); ?>
