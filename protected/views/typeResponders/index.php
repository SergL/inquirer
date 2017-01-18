<?php
/* @var $this TypeRespondersController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Type Responders',
);

$this->menu = array(
    array('label' => 'Create TypeResponders', 'url' => array('create')),
    array('label' => 'Manage TypeResponders', 'url' => array('admin')),
);
?>

<h1>Type Responders</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
