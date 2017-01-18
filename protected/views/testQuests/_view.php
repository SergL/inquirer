<?php
/* @var $this TestQuestsController */
/* @var $data TestQuests */
?>

<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('test_sections_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->test_sections_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('quests_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->quests_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('type_quests_id')); ?>:</b>
    <?php echo MyCHtml::encode($data->type_quests_id); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('sort')); ?>:</b>
    <?php echo MyCHtml::encode($data->sort); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('correct_text_value')); ?>:</b>
    <?php echo MyCHtml::encode($data->correct_text_value); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('requred')); ?>:</b>
    <?php echo MyCHtml::encode($data->requred); ?>
    <br/>

    <?php /*
	<b><?php echo MyCHtml::encode($data->getAttributeLabel('file_name')); ?>:</b>
	<?php echo MyCHtml::encode($data->file_name); ?>
	<br />

	*/
    ?>

</div>