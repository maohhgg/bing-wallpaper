#!/usr/bin/env python
# -*- coding:utf-8 -*-
import json
import os
import sys
import time
import pymysql
import requests


def log(content):
    code = open('/var/www/bing/log/bing.log', 'a')
    code.writelines(time.strftime("%Y/%m/%d %H:%M:%S",time.localtime()) + ": " + content + "\r\n")
    code.close()

# Mysql
# CREATE TABLE data(
#     date int(10),
#     content text,
#     search text,
#     video tinyint(1),
#     hash varchar(32))


def save_json_to_sql(json, db, cursor):
    if 'vid' in json:
        vid = 1
    else:
        vid = 0

    sql = 'insert into data(date,content,search,video,hash) values(%d, "%s", "%s", %d, "%s")' % \
        (int(json['enddate']), json['copyright'], json[
         'copyrightlink'], vid, json['hsh']) + ';'
    print(sql)
    try:
        cursor.execute(sql)
        db.commit()
    except:
        log(sql)
        db.rollback()


def get_bing_json(n, db, cursor):
    url = 'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=' + \
        str(n) + '&n=1&nc=%s&pid=hp&video=1' % (str(int(time.time())) + '000')
    json_data = json.loads(requests.get(url).content.decode())
    save_json_to_sql(json_data['images'][0], db, cursor)
    return json_data


def find_json(json_data):
    image = json_data['images'][0]
    if 'vid' in image:
        vid = 'http:' + image['vid']['sources'][1][2]
        vid_img = 'http:' + image['vid']['image']
    else:
        vid = None
        vid_img = None
    return image['url'], image['copyright'], image['enddate'], vid, vid_img


def download(url, file_path, date):
    try:
        if not file_path.endswith('/'):
            file_path += '/'
        if not os.path.exists(file_path):
            os.makedirs(file_path)
        suffix = url[url.rfind('.'):]
        content = requests.get('http://s.cn.bing.net/' + url).content
        fname = file_path + date + suffix
        print(fname)
        code = open(fname, 'wb')
        code.write(content)
        code.close()
        return fname
    except:
        log("download " + url + " error ")
        return ''


if __name__ == '__main__':
    connection = pymysql.connect(
        "127.0.0.1", "root", "root", "bing", use_unicode=True, charset="utf8")
    cursor = connection.cursor()

    img, intro, date, vid, vid_img = find_json(
        get_bing_json(-1, connection, cursor))
    if vid is not None:
        download(vid, '/var/www/bing/resource/', date + '_video')
        download(vid_img, '/var/www/bing/resource/', date + '_video_image')
    download(img, '/var/www/bing/resource', date)

    connection.close()
