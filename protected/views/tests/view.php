<?php
/* @var $this TestsController */
/* @var $model Tests */

$this->breadcrumbs = array(
    'Tests' => array('index'),
    $model->name,
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Tests'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Create Tests'), 'url' => array('create')),
    array('label' => Yii::t('inquirer', 'Update Tests'), 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => Yii::t('inquirer', 'Delete Tests'),
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => Yii::t('inquirer', 'Manage Tests'), 'url' => array('admin')),
    array('label' => '----------------', 'url' => '#'),
    array('label' => Yii::t('inquirer', 'Test Sections'), 'url' => array('/testSections/list', 'id' => $model->id)),
);
?>

<h1>View Tests #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            array(
                'label' => 'categories_id',
                'type' => 'raw',
                'value' => $model->categories->name,
            ),
            'name',
            array(
                'label' => 'admins_id',
                'type' => 'raw',
                'value' => $model->admins->alias,
            ),
            'is_enabled',
            'is_periodical',
            'is_del',
            'count_allow_quests',
            'datetime_create',
            'datetime_start',
            'datetime_stop',
            'timeout_for_test',
        ),
    )
); ?>
