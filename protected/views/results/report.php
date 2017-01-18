<?php
/* @var $this ResultsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    Yii::t('inquirer', 'Result'),
);

$this->menu = array( //    array('label' => 'Manage Results', 'url' => array('admin')),
);
?>

<h1><?php echo Yii::t(
        'inquirer',
        'The result of testing by the test "{testName}" meets "{responderInfo}',
        array('{testName}' => $data['test']['name'], '{responderInfo}' => $data['responder']['info_detailed'])
    ); ?></h1>

<?php

?>
<table>

    <?php foreach ($data as $key => $row) { ?>
        <?php if ($key != 'test' && $key != 'responder') { ?>
            <?php $this->renderPartial('_row', array('data' => $row, 'model' => $model)); ?>
        <?php } ?>
    <?php } ?>
</table>

