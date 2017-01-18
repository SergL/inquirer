<div class="view">

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo MyCHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('login')); ?>:</b>
    <?php echo MyCHtml::encode($data->login); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('password')); ?>:</b>
    <?php echo MyCHtml::encode($data->password); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('role')); ?>:</b>
    <?php echo MyCHtml::encode($data->role); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('date_create')); ?>:</b>
    <?php echo MyCHtml::encode($data->date_create); ?>
    <br/>

    <b><?php echo MyCHtml::encode($data->getAttributeLabel('alias')); ?>:</b>
    <?php echo MyCHtml::encode($data->alias); ?>
    <br/>


    <br/>


</div>