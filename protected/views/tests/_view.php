<?php
/* @var $this TestsController */
/* @var $data Tests */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('categories_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->categories->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo MyCHtml::encode($data->name); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('admins_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->admins->alias); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('is_enabled')); ?>:</b>
    <?php echo MyCHtml::booleanText($data->is_enabled); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('is_periodical')); ?>:</b>
    <?php echo MyCHtml::booleanText($data->is_periodical); ?>
    <br/>

    <!--	<b>--><?php //echo MyCHtml::encode($data->getAttributeLabel('is_del')); ?><!--:</b>-->
    <!--	--><?php //echo MyCHtml::booleanText($data->is_del); ?>
    <!--	<br />-->

    <?php /*
	<b><?php echo MyCHtml::encode($data->getAttributeLabel('count_allow_quests')); ?>:</b>
	<?php echo MyCHtml::encode($data->count_allow_quests); ?>
	<br />

	<b><?php echo MyCHtml::encode($data->getAttributeLabel('datetime_create')); ?>:</b>
	<?php echo MyCHtml::encode($data->datetime_create); ?>
	<br />

	<b><?php echo MyCHtml::encode($data->getAttributeLabel('datetime_start')); ?>:</b>
	<?php echo MyCHtml::encode($data->datetime_start); ?>
	<br />

	<b><?php echo MyCHtml::encode($data->getAttributeLabel('datetime_stop')); ?>:</b>
	<?php echo MyCHtml::encode($data->datetime_stop); ?>
	<br />

	<b><?php echo MyCHtml::encode($data->getAttributeLabel('timeout_for_test')); ?>:</b>
	<?php echo MyCHtml::encode($data->timeout_for_test); ?>
	<br />

	*/
    ?>

</div>