<?php
/* @var $this QuestsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Quests',
);

$this->menu = array(
    array('label' => 'Create Quests', 'url' => array('create')),
    array('label' => 'Manage Quests', 'url' => array('admin')),
);
?>

<h1>Quests</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
