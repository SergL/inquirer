<?php
/* @var $this TestQuestsController */
/* @var $model TestQuests */

$this->breadcrumbs = array(
    'Test Quests' => array('index'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List TestQuests', 'url' => array('index')),
    array('label' => 'Create TestQuests', 'url' => array('create')),
);

Yii::app()->clientScript->registerScript(
    'search',
    "
   $('.search-button').click(function(){
       $('.search-form').toggle();
       return false;
   });
   $('.search-form form').submit(function(){
       $('#test-quests-grid').yiiGridView('update', {
           data: $(this).serialize()
       });
       return false;
   });
   "
);
?>

<h1>Manage Test Quests</h1>

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
        'id' => 'test-quests-grid',
        'dataProvider' => $model->search(),
        'filter' => $model,
        'columns' => array(
            'id',
            array(
                'name' => 'test_sections_id',
                'filter' => TestSections::getDataDropList(),
                'value' => '$data->testSections->sections->name',
            ),
            array(
                'name' => 'quests_id',
                'filter' => Quests::getDataDropList(),
                'value' => '$data->quests->quest',
            ),
            array(
                'name' => 'type_quests_id',
                'filter' => TypeQuests::getDataDropList(),
                'value' => '$data->typeQuests->name',
            ),
//		'type_quests_id',
            'sort',
            'correct_text_value',
            /*
            'requred',
            'file_name',
            */
            array(
                'class' => 'CButtonColumn',
            ),
        ),
    )
); ?>
