<?php
/* @var $this RespondersController */
/* @var $model Responders */

$this->breadcrumbs = array(
    'Responders' => array('index'),
    'Manage',
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Responders'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Create Responders'), 'url' => array('create')),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#responders-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1>Manage Responders</h1>

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
        'id' => 'responders-grid',
        'dataProvider' => $model->search(),
        'filter' => $model,
        'columns' => array(
            'id',
//		'type_responders_id',
            array(
                'name' => 'type_responders_id',
                'filter' => TypeResponders::getDataDropList(),
                'value' => '$data->typeResponders->name',
            ),
            'responder_id',
            'info_detailed',
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
); ?>
