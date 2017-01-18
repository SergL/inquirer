<?php


class MyCModel extends CModel
{
    const DELIM_FIELD = '__';
    public $tables = array();

    protected function setSelectStringTable(
        $tableAlias,
        $arrColumns,
        $strSelect = ''
    ) {
        $strColumns = '';
        foreach ($arrColumns as $column) {
            $strColumns .= ' ' . $tableAlias . '.' . $column . ' as ' . $tableAlias . self::DELIM_FIELD . $column . ',';
        }
        return $strSelect . $strColumns;
    }

    protected function setSelectStringTables(
        $strSelect = '',
        $tables = array()
    ) {
        $tablesName = (empty($tables) ? $this->tables : $tables);
        $strCurrent = '';
        foreach ($tablesName as $table) {
            $nameArrColumns = 'columns' . ucfirst($table);
            $strSelect = $this->setSelectStringTable($table, $this->$nameArrColumns, $strSelect);
//            $strSelect .= $strCurrent;
        }
        $strSelect = substr($strSelect, 0, strlen($strSelect) - 1);
        return $strSelect;
    }

    protected function getDataTableInfo(
        $data,
        $tableAlias
    ) {
        $result = array();
        $nameArrColumns = 'columns' . ucfirst($tableAlias);
        foreach ($this->$nameArrColumns as $column) {
            $columnName = $tableAlias . self::DELIM_FIELD . $column;
            $result[$column] = $data[$columnName];
        }
        return $result;
    }

    /**
     * Возвращает из масива данных нужное значение, если нету то записать в массив
     * @param $data
     * @param string $modelName
     * @param $id
     * @param string $outputFiled
     * @return mixed
     * @throws CHttpException
     * @example getDataParamByPk($this->dataTypeQuests,  'TypeQuests', 15, 'type' )
     */
    public static function getDataParamByPk(&$data, $modelName, $id, $outputFiled)
    {
        $result = false;
        if (isset($data[$id])) {
            $result = $data[$id][$outputFiled];
        } else {


            $dataModelArr = self::loadDataModels($modelName, $id);
            $data[$id] = $dataModelArr;
            $result = $data[$id][$outputFiled];


        }
        return $result;
    }

    protected function updateBlockData(
        &$blockData,
        $data,
        $block_name,
        $arrDataAdd,
        &$blockKeysIds,
        $primaryKeyName
    ) {
        $blockId = false;
        $blockInfo = $blockInfoAdd = array();
        foreach ($arrDataAdd as $dataItem) {
            $blockInfoAdd = $this->getDataTableInfo($data, $dataItem);
            $blockInfo = array_merge($blockInfo, $blockInfoAdd);
            if ($dataItem == $arrDataAdd[0]) {
                $blockprimaryKeyValue = $blockInfoAdd[$primaryKeyName];
                $blockPrimaryKeyName = $dataItem . '_' . $primaryKeyName;
                $blockInfo[$blockPrimaryKeyName] = $blockprimaryKeyValue;
            } else {
                $blockInfo[$primaryKeyName] = $blockprimaryKeyValue;
            }
        }

        if (isset($blockprimaryKeyValue)) {
            if (!in_array($blockprimaryKeyValue, $blockKeysIds)) {
                $blockData[$block_name][] = $blockInfo;
                $blockKeysIds[] = $blockprimaryKeyValue;

            }
            $blockId = $this->getIndexData($blockData[$block_name], $primaryKeyName, $blockprimaryKeyValue);
        }

        return $blockId;
    }

    protected function getIndexData(
        $data,
        $primaryKeyName,
        $primaryKey
    ) {
        foreach ($data as $key => $row) {
            if ($row[$primaryKeyName] == $primaryKey) {
                return $key;
            }
        }
        return false;
    }

    public static function loadDataModels(
        $modelName,
        $id
    ) {
        $dataModel = $modelName::model()->findByPk($id);
        if ($dataModel === null) {
            throw new CHttpException(500,
                Yii::t(
                    'inquirer',
                    'Not data in model {modelName} with id={id}',
                    array('{modelName}' => $modelName, '{id}' => $id)
                )
            );

        } else {


            $dataModelArr = $dataModel->getAttributes();

        }

        return $dataModelArr;
    }

    public function attributeNames()
    {
        // TODO: Implement attributeNames() method.
    }
}