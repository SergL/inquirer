<?php
/* @var $this SectionsController */
/* @var $model Sections */

$this->breadcrumbs = array(
    'Sections' => array('index'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List Sections', 'url' => array('index')),
    array('label' => 'Create Sections', 'url' => array('create')),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#sections-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1>Manage Sections</h1>

<p>
    You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>
        &lt;&gt;</b>
    or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo MyCHtml::link('Advanced Search', '#', array('class' => 'search-button')); ?>
<div class="search-form" style="display:none">
    <?php
    $this->renderPartial(
        '_search',
        array(
            'model' => $model,
        )
    ); ?>
</div><!-- search-form -->

<?php

$this->widget(
    'zii.widgets.grid.CGridView',
    array(
        'id' => 'sections-grid',
        'dataProvider' => $model->search(),
        'filter' => $model,
        'columns' => array(
            'id',
            'title_in_backend',
            'name',
            'sort',
            'count_allow_quests',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
);

/*
$this->widget('zii.widgets.grid.CGridView', array(
    'id'=>'test-quests-grid',
    'dataProvider'=>$model->search(),
    'filter'=>$model,
    'columns'=>array(
        'id',

		array(
            'class'=>'CButtonColumn',
        ),
    ),
));
*/
?>
