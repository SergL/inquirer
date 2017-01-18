<?php
/* @var $this CategoryTypeRespondersController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Category Type Responders',
);

$this->menu = array(
    array('label' => 'Create CategoryTypeResponders', 'url' => array('create')),
    array('label' => 'Manage CategoryTypeResponders', 'url' => array('admin')),
);
?>

<h1>Category Type Responders</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
