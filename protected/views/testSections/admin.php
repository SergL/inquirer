<?php
/* @var $this TestSectionsController */
/* @var $model TestSections */

$this->breadcrumbs = array(
    'Test Sections' => array('index'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List TestSections', 'url' => array('index')),
    array('label' => 'Create TestSections', 'url' => array('create')),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#test-sections-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1>Manage Test Sections</h1>

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
        'id' => 'test-sections-grid',
        'dataProvider' => $model->search(),
        'filter' => $model,
        'columns' => array(
            'id',
            array(
                'name' => 'tests_id',
                'filter' => Tests::getDataDropList(),
                'value' => '$data->tests->name',
            ),
            array(
                'name' => 'sections_id',
                'filter' => Sections::getDataDropList(),
                'value' => '$data->sections->title_in_backend',
            ),
            'count_allow_quests',
            'sort',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
); ?>
