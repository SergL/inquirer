<?php
/* @var $this TestsController */
/* @var $model Tests */

$this->breadcrumbs = array(
    'Tests' => array('index'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List Tests', 'url' => array('index')),
    array('label' => 'Create Tests', 'url' => array('create')),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#tests-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1>Manage Tests</h1>

<p>
    You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>
        &lt;&gt;</b>
    or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo MyCHtml::link('Advanced Search', '#', array('class' => 'search-button')); ?>
<div class="search-form" style="display:none">
    <?php $this->renderPartial(
        '_search',
        array(
            'model' => $model,
        )
    ); ?>
</div><!-- search-form -->

<?php $this->widget(
    'zii.widgets.grid.CGridView',
    array(
        'id' => 'tests-grid',
        'dataProvider' => $model->search(),
        'filter' => $model,
        'columns' => array(
            'id',
            array(
                'name' => 'categories_id',
                'filter' => Categories::getDataDropList(),
                'value' => '$data->categories->name',
            ),
            'name',
            array(
                'name' => 'admins_id',
                'filter' => Admins::getDataDropList(),
                'value' => '$data->admins->alias',
            ),
            'is_enabled',
            'is_periodical',
            /*
            'is_del',
            'count_allow_quests',
            'datetime_create',
            'datetime_start',
            'datetime_stop',
            'timeout_for_test',
            */
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
); ?>
