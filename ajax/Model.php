<?php


class Model{

    const SELECT = 4;
    const UPDATE = 3;
    const DELETE = 1;
    const INSERT = 0;
    protected $DB;
    protected $query;
    protected $fields = [];
    protected $data = [];
    protected $table;
    protected $field = "*";
    protected $where;
    protected $limit;
    protected $order;
    protected $reseut = [];

    function __construct() {
        $this->DB = new PDO('mysql:host=222.222.222.200;port=3306;dbname=bing;charset=UTF8;','root','root', array(PDO::ATTR_PERSISTENT=>true));
    }

    public function data($data, $value = null){
        if (is_string($data)) {
            $this->data[$data] = $value;
        } else {
            // 清空数据
            $this->data = [];
            if (is_object($data)) {
                $data = get_object_vars($data);
            }
            $this->data = $data;
        }
        return $this;
    }
    public function field($field){
        if (is_string($field)) {
            $this->field = $field;
        } else {
            $this->field = "";
            if (is_array($field)) {
                foreach ($field as $key => $value) {
                    $this->field .= $value . ",";
                }
                $this->field = substr($this->field,0,strlen($this->field)-1);
            }
        }
        return $this;
    }
    public function where($field){
        if (is_string($field)) {
            $this->where = $field;
        } else {
            $this->where = "";
            if (is_array($field)) {
                foreach ($field as $key => $value) {
                    $this->where .= "`".$key ."`=".$value." AND ";
                }
                $this->where = substr($this->where,0,strlen($this->where)-5);
            }
        }
        return $this;
    }
    public function limit($num){
        if (is_numeric($num)) {
            if ($num < 1) {
                $num = 1;
            }
            $this->limit = $num;
        } else {
            $this->limit = 1;
        }
        return $this;
    }
    private function toSql($type){
        $sql = "";
        switch ($type) {
            case self::SELECT :
                 $sql = "SELECT ".$this->field." FROM ".$this->table;
                 $sql .= $this->where ? " WHERE ".$this->where : "";
                 $sql .= $this->limit ? " LIMIT ".$this->limit : "";
                 $sql .= $this->order ? " ORDER BY ".$this->order : "";
                 $sql .= ";";
                 return $sql;

            case self::INSERT :
                # code...
                break;
            case self::INSERT :
                # code...
                break;
            case self::INSERT :
                # code...
                break;
            case self::INSERT :
                # code...
                break;

            default:
                break;
        }

    }
    public function select(){
        $sql = $this->toSql(self::SELECT);
        $query = $this->DB->query($sql);
        $this->reseut = array();
        $query->execute();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $this->reseut[] = $row;
        }
        if (count($this->reseut) == 1) {
            return $this->reseut[0];
        }
        return $this->reseut;
    }



}
