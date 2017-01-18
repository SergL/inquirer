<?php
/* @var $this CategoryTypeRespondersController */
/* @var $model CategoryTypeResponders */

$this->breadcrumbs = array(
    'Category Type Responders' => array('index'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List CategoryTypeResponders', 'url' => array('index')),
    array('label' => 'Create CategoryTypeResponders', 'url' => array('create')),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#category-type-responders-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1>Manage Category Type Responders</h1>

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
        'id' => 'category-type-responders-grid',
        'dataProvider' => $model->search(),
        'filter' => $model,
        'columns' => array(
            'id',
            'categories_id',
            'type_responders_id',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
); ?>
