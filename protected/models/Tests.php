<?php

/**
 * This is the model class for table "inquirer.tests".
 *
 * The followings are the available columns in table 'inquirer.tests':
 * @property integer $id
 * @property integer $categories_id
 * @property string $name
 * @property integer $admins_id
 * @property integer $is_enabled
 * @property integer $is_periodical
 * @property integer $is_del
 * @property integer $count_allow_quests
 * @property string $datetime_create
 * @property string $datetime_start
 * @property string $datetime_stop
 * @property integer $timeout_for_test
 *
 * The followings are the available model relations:
 * @property Categories $categories
 * @property TestQuests[] $testQuests
 * @property Reports[] $reports
 */
class Tests extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.tests';
    }

    protected function beforeSave()
    {

        if (!strtotime($this->datetime_create)) {
            $this->datetime_create = date("Y-m-d H:i:s");
        }

        if (!strtotime($this->datetime_start)) {
            $this->datetime_start = null;
        } else {
            $this->datetime_start = date("Y-m-d H:i:s", strtotime($this->datetime_start));
        }

        if (!strtotime($this->datetime_stop)) {
            $this->datetime_stop = null;
        } else {
            $this->datetime_start = date("Y-m-d H:i:s", strtotime($this->datetime_start));
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
            array('categories_id, name', 'required'),
            array(
                'categories_id, admins_id, is_enabled, is_periodical, is_del, count_allow_quests, timeout_for_test',
                'numerical',
                'integerOnly' => true
            ),
            array('name', 'length', 'max' => 255),
            array('datetime_create, datetime_start, datetime_stop', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array(
                'id, categories_id, name, admins_id, is_enabled, is_periodical, is_del, count_allow_quests, datetime_create, datetime_start, datetime_stop, timeout_for_test',
                'safe',
                'on' => 'search'
            ),
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
            'categories' => array(self::BELONGS_TO, 'Categories', 'categories_id'),
            'testQuests' => array(self::HAS_MANY, 'TestQuests', 'tests_id'),
            'reports' => array(self::HAS_MANY, 'Reports', 'tests_id'),
            'admins' => array(self::BELONGS_TO, 'Admins', 'admins_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'categories_id' => Yii::t('inquirer', 'Categories'),
            'name' => Yii::t('inquirer', 'Name'),
            'admins_id' => Yii::t('inquirer', 'Admins'),
            'is_enabled' => Yii::t('inquirer', 'Is Enabled'),
            'is_periodical' => Yii::t('inquirer', 'Is Periodical'),
            'is_del' => Yii::t('inquirer', 'Is Del'),
            'count_allow_quests' => Yii::t('inquirer', 'Count Allow Quests'),
            'datetime_create' => Yii::t('global', 'Datetime Create'),
            'datetime_start' => Yii::t('inquirer', 'Datetime Start'),
            'datetime_stop' => Yii::t('inquirer', 'Datetime Stop'),
            'timeout_for_test' => Yii::t('inquirer', 'Timeout For Test'),
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
        $criteria->compare('categories_id', $this->categories_id);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('admins_id', $this->admins_id);
        $criteria->compare('is_enabled', $this->is_enabled);
        $criteria->compare('is_periodical', $this->is_periodical);
        $criteria->compare('is_del', $this->is_del);
        $criteria->compare('count_allow_quests', $this->count_allow_quests);
        $criteria->compare('datetime_create', $this->datetime_create, true);
        $criteria->compare('datetime_start', $this->datetime_start, true);
        $criteria->compare('datetime_stop', $this->datetime_stop, true);
        $criteria->compare('timeout_for_test', $this->timeout_for_test);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Tests the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public static function getDataDropList($is_tems = 0)
    {
        if ($is_tems === 0) {
            $models = self::model()->findAll();
            $list = CHtml::listData($models, 'id', 'name');
        }
        return $list;
    }
}
