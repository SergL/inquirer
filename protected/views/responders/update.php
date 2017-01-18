<?php
/* @var $this RespondersController */
/* @var $model Responders */

$this->breadcrumbs = array(
    'Responders' => array('index'),
    $model->id => array('view', 'id' => $model->id),
    'Update',
);

$this->menu = array(
    array('label' => Yii::t('inquirer', 'List Responders'), 'url' => array('index')),
    array('label' => Yii::t('inquirer', 'Create Responders'), 'url' => array('create')),
    array('label' => Yii::t('inquirer', 'View Responders'), 'url' => array('view', 'id' => $model->id)),
    array('label' => Yii::t('inquirer', 'Manage Responders'), 'url' => array('admin')),
);
?>

    <h1>Update Responders <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>