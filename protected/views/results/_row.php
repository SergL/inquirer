<?php
$type = MyCModel::getDataParamByPk(
    $model->dataTypeQuests,
    'TypeQuests',
    $data['test_quests__type_quests_id'],
    'type'
);

$typeQuestsObj = new TypeQuestsStrategy($type);
?>
<tr>
    <td>
        <?php echo $data['quests__quest']; ?>
    </td>
    <td>

        <?php echo $typeQuestsObj->processOutput($data); ?>

    </td>
</tr>
