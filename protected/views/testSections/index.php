<?php
/* @var $this TestSectionsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Test Sections',
);

$this->menu = array(
    array('label' => 'Create TestSections', 'url' => array('create')),
    array('label' => 'Manage TestSections', 'url' => array('admin')),
);
?>

<h1>Test Sections</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
