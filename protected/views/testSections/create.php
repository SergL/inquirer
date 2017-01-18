<?php
/* @var $this TestSectionsController */
/* @var $model TestSections */
?>
<?php
if (isset($model->tests_id)) {

    $this->breadcrumbs = array(
        'Test Sections' => array('index'),

    );

    $this->breadcrumbs = array(
        Yii::t('inquirer', 'Tests') => array('tests/index'),
        $tests->name => array('tests/view', 'id' => $tests->id),
        Yii::t('inquirer', 'Test Sections') => array('/testSections/list', 'id' => $tests->id),
        Yii::t('inquirer', 'Create TestSections'),
    );
    $this->menu = array(
        array('label' => Yii::t('inquirer', 'Test Sections'), 'url' => array('list', 'id' => $model->tests_id)),
//            array('label' => Yii::t('inquirer', 'Manage TestSections'), 'url' => array('admin')),
    );
} else {

    $this->breadcrumbs = array(
        Yii::t('inquirer', 'Test Sections') => array('index'),
        Yii::t('global', 'Create'),
    );

    $this->menu = array(
        array('label' => Yii::t('inquirer', 'List TestSections'), 'url' => array('index')),
        array('label' => Yii::t('inquirer', 'Manage TestSections'), 'url' => array('admin')),
    );
}
?>

    <h1><?php echo Yii::t('inquirer', 'Create TestSections') ?>
        <?php if (isset($model->tests_id)) {
            echo ' "' . $tests->name . '"';
        }
        ?>
    </h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>