<?php
/* @var $this RespondersController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Responders'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'Create Responders'), 'url' => array('create')),
    array('label' => Yii::t('inquirer', 'Manage Responders'), 'url' => array('admin')),
);
?>

<h1>Responders</h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
