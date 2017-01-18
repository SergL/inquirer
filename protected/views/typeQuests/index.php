<?php
/* @var $this TypeQuestsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Type Quests',
);

$this->menu = array(
    array('label' => 'Create TypeQuests', 'url' => array('create')),
    array('label' => 'Manage TypeQuests', 'url' => array('admin')),
);
?>

<h1>Type Quests</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
