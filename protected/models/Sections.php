<?php

/**
 * This is the model class for table "inquirer.sections".
 *
 * The followings are the available columns in table 'inquirer.sections':
 * @property integer $id
 * @property string $title_in_backend
 * @property string $name
 * @property integer $sort
 * @property integer $count_allow_quests
 *
 * The followings are the available model relations:
 * @property TestQuests[] $testQuests
 */
class Sections extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.sections';
    }

    protected function beforeSave()
    {

        if (empty($this->name) && !empty($this->title_in_backend)) {
            $this->name = $this->title_in_backend;
        }
        return parent::beforeSave();
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('sort, count_allow_quests', 'numerical', 'integerOnly' => true),
            array('title_in_backend, name', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, title_in_backend, name, sort, count_allow_quests', 'safe', 'on' => 'search'),
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
            'testQuests' => array(self::HAS_MANY, 'TestQuests', 'sections_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'title_in_backend' => Yii::t('inquirer', 'Title In Backend'),
            'name' => Yii::t('inquirer', 'Sections Name'),
            'sort' => Yii::t('inquirer', 'Sort'),
            'count_allow_quests' => Yii::t('inquirer', 'Count Allow Quests'),
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
        $criteria->compare('title_in_backend', 'required');
        $criteria->compare('id', $this->id);
        $criteria->compare('title_in_backend', $this->title_in_backend, true);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('sort', $this->sort);
        $criteria->compare('count_allow_quests', $this->count_allow_quests);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Sections the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public static function getDataDropList($is_tems = 0)
    {
        if ($is_tems === 0) {
            $models = self::model()->findAll();
            $list = CHtml::listData($models, 'id', 'title_in_backend');
        }
        return $list;
    }
}
