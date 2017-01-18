<?php
/* @var $this SectionsController */
/* @var $model Sections */

$this->breadcrumbs = array(
    'Sections' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => 'List Sections', 'url' => array('index')),
    array('label' => 'Manage Sections', 'url' => array('admin')),
);
?>

    <h1>Create Sections</h1>

<?php $this->renderPartial(
    '_formAddInTests',
    array(
        'model' => $model,
        'modelTestSections' => $modelTestSections,
        'modelTests' => $modelTests,
    )
); ?>