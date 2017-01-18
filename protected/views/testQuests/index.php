<?php
/* @var $this TestQuestsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Test Quests',
);

$this->menu = array(
    array('label' => 'Create TestQuests', 'url' => array('create')),
    array('label' => 'Manage TestQuests', 'url' => array('admin')),
);
?>

<h1>Test Quests</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
