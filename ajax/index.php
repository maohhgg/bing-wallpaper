<?php
include 'Model.php';

class dataCard extends Model{
    protected $table = "data_card";
}
class cnhp extends Model{
    protected $table = "cnhp";
}
class data extends Model{
    protected $table = "data";
}

function request($request){
    if(count(array_keys($request)) == 0){
        header("HTTP/1.1 404 Not Found");exit;
    }

    if (!array_key_exists('main',$request)) {
        header("HTTP/1.1 405 METHOD NOT ALLOWED");exit;
    }
    $date = $request['main'];
    return $date;
}
$request = $_GET;
$date = request($request);

if (!array_key_exists('info',$request)) {
    $data = new data();
    $json = $data->where("date = ".$date)->field("date,content,search,video")->limit(1)->select();
    $attr = explode('，',$json['content'], 2);
    $json['title'] = $attr[0];
    $json['content'] = $attr[1];
    $json = json_encode($json);
} else {
    $cnhp = new cnhp();
    $card = new dataCard();
    $json = $cnhp->where("date = ".$date)->limit(1)->select();
    $json['data'] = $card->where(array('fid' => $json['id'], 'type'=> 1))->field("title,url,content")->select();
    $json['card'] = $card->where(array('fid' => $json['id'], 'type'=> 0))->field("title,url,content,img")->select();
    $json = json_encode($json);
}
echo ($json);
