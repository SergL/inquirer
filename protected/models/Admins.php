<?php

/**
 * This is the model class for table "inquirer.admins".
 *
 * The followings are the available columns in table 'inquirer.admins':
 * @property integer $id
 * @property string $login
 * @property string $password
 * @property string $role
 * @property string $date_create
 * @property string $alias
 * @property integer $is_del
 * @property integer $is_active
 */
class Admins extends CActiveRecord
{
    public $password_new = "";

    protected function beforeSave()
    {

        if ($this->password_new && $this->password_new != 1) {
            $this->password = md5($this->password_new);
        }
        return parent::beforeSave();
    }

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.admins';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        return array(
            array('login,alias', 'required'),
            array('password_new', 'required', 'on' => 'insert'),
            array('role', 'length', 'max' => 100),
            array('login, password, dt, alias, password_new', 'safe'),
            // The following rule is used by search().
            // Please remove those attributes that should not be searched.
            array('id, login, password, role, dt, alias, partner_id', 'safe', 'on' => 'search'),
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
            'admins' => array(self::HAS_MANY, 'Admins', 'admins_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'login' => 'Login',
            'password' => 'Password',
            'role' => 'Role',
            'date_create' => 'Date Create',
            'alias' => 'Alias',
            'is_del' => 'Is Del',
            'is_active' => 'Is Active',
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
        $criteria->compare('login', $this->login, true);
        $criteria->compare('password', $this->password, true);
        $criteria->compare('role', $this->role, true);
        $criteria->compare('date_create', $this->date_create, true);
        $criteria->compare('alias', $this->alias, true);
        $criteria->compare('is_del', $this->is_del);
        $criteria->compare('is_active', $this->is_active);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Admins the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function getListRole()
    {
        $list = require(Yii::getPathOfAlias('application.config.auth') . '.php');
        $arr = array();
        foreach ($list as $key => $value) {
            $arr[] = array("id" => $key, "name" => $value['description']);
        }
        return $arr;
    }

    public function behaviors()
    {
        return array(
            'LoggableBehavior' =>
                'application.modules.auditTrail.behaviors.LoggableBehavior',
        );
    }

    public static function getDataDropList()
    {
        $models = self::model()->findAll();
        $list = CHtml::listData($models, 'id', 'alias');
        return $list;
    }

}