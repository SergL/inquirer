<?php
/* @var $this TestsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Tests'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'Create Tests'), 'url' => array('create')),
    array('label' => Yii::t('inquirer', 'Manage Tests'), 'url' => array('admin')),
);
?>

<h1><?php echo Yii::t('inquirer', 'Tests'); ?></h1>

<?php $this->widget(
    'zii.widgets.CListView',
    array(
        'dataProvider' => $dataProvider,
        'itemView' => '_view',
    )
); ?>
