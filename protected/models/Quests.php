<?php

/**
 * This is the model class for table "inquirer.quests".
 *
 * The followings are the available columns in table 'inquirer.quests':
 * @property integer $id
 * @property string $quest
 * @property string $file_name
 *
 * The followings are the available model relations:
 * @property TestQuests[] $testQuests
 */
class Quests extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.quests';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('quest, file_name', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, quest, file_name', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'testQuests' => array(self::HAS_MANY, 'TestQuests', 'quests_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => Yii::t('inquirer', 'ID'),
            'quest' => Yii::t('inquirer', 'Quest'),
            'file_name' => Yii::t('inquirer', 'File Name'),
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search()
    {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('quest', $this->quest, true);
        $criteria->compare('file_name', $this->file_name, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Quests the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public static function getDataDropList($is_tems = 0)
    {
        if ($is_tems === 0) {
            $models = self::model()->findAll();
            $list = CHtml::listData($models, 'id', 'quest');
        }
        return $list;
    }
}
