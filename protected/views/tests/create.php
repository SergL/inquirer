<?php
/* @var $this TestsController */
/* @var $model Tests */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Tests') => array('index'),
    Yii::t('global', 'Create'),
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Tests'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Manage Tests'), 'url' => array('admin')),
);
?>
    <h1><?php echo Yii::t('inquirer', 'Create Tests'); ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>