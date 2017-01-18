<?php
/* @var $this RespondersController */
/* @var $model Responders */

$this->breadcrumbs = array(
    'Responders' => array('index'),
    $model->id,
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Responders'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Create Responders'), 'url' => array('create')),
    array('label' => Yii::t('inquirer', 'Update Responders'), 'url' => array('update', 'id' => $model->id)),
    array(
        'label' => Yii::t('inquirer', 'Delete Responders'),
        'url' => '#',
        'linkOptions' => array(
            'submit' => array('delete', 'id' => $model->id),
            'confirm' => 'Are you sure you want to delete this item?'
        )
    ),
    array('label' => Yii::t('inquirer', 'Manage Responders'), 'url' => array('admin')),
);
?>

<h1>View Responders #<?php echo $model->id; ?></h1>

<?php $this->widget(
    'zii.widgets.CDetailView',
    array(
        'data' => $model,
        'attributes' => array(
            'id',
            array(
                'label' => 'type_responders_id',
                'type' => 'raw',
                'value' => $model->typeResponders->name,
            ),
            'responder_id',
            'info_detailed',
        ),
    )
); ?>
