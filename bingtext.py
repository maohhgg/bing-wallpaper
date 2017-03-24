#!/usr/bin/env python
# -*- coding:utf-8 -*-
import os
import sys
import json
import time
import random
import pymysql
import datetime
import requests
from pyquery import PyQuery as pqy

def log(content):
    code = open('/var/www/bing/log/bing.log', 'a')
    code.writelines(time.strftime("%Y/%m/%d %H:%M:%S", time.localtime()) + "-- bingtext.py: " + content + "\r\n")
    code.close()

def rand_name(n):
    chars = ''.join(random.sample('zyxwvutsrqponmlkjihgfedcbaABCDEFGHIJKLMNOPQRSTUVWXYZ',n))
    chars += str(int(time.time()))
    return chars

def download_img(url,date):
    try:
        file_path = '/var/www/bing/images/' + date
        if not file_path.endswith('/'):
            file_path += '/'
        if not os.path.exists(file_path):
            os.makedirs(file_path)

        suffix = '.jpg'
        content = requests.get(url).content
        name = rand_name(10)
        fname = file_path + name + suffix
        code = open(fname, 'wb')
        code.write(content)
        code.close()
        return name
    except Exception as e:
        log("Download : " + url)
        log("Download Error: " + str(e))
        return " "


def get_bing_json(date):
    url = 'http://cn.bing.com/cnhp/life?currentDate=' + date
    html = requests.get(url).content.decode()
    jq = pqy(html)
    img1 = jq('#hpla > .rms_img:first').attr.src
    img2 = jq('#hpla .hplaDMLink .rms_img:first').attr.src
    img = img1 if img1 is not None else img2
    arr = {
        'title': jq('.hplaTtl').text(),
        'attr': jq('.hplaAttr').text(),
        'date': date,
        'img': download_img(img,date),
        'describe': jq('.hplaCata .hplatt').text(),
        'ats': jq('.hplaCata .hplats').text(),
        'Snippet': jq('#hplaSnippet').text(),
        'data':{},
        'card':{}}


    hplac = jq('.hplac')
    n = 0
    for i in hplac:
        jqi = pqy(i)
        arr['data'][n] = {
            'title': jqi('.hplactt span').text(),
            'url': jqi('.hplact > a').attr.href,
            'content':  jqi('.hplactc').text()}
        n += 1

    hplaCard = jq('.hplaCard')
    m = 0
    for i in hplaCard:
        jqm = pqy(i)
        arr['card'][m] = {
            'title': jqm('.hplats').text(),
            'url': jqm('a:first').attr.href,
            'img': download_img(jqm('a > .rms_img').attr.src,date),
            'content':  jqm('.hplatxt').text()}
        m += 1

    return arr

def save_json_to_sql(db,cursor,json):
    try:
        sql = cursor.mogrify('insert into cnhp(`id`,`title`,`attr`, `date`,`img`,`describe`,`ats`,`Snippet`) values(NULL, %s, %s, %s, %s, %s, %s, %s)' % \
        (connection.escape(json['title']), connection.escape(json['attr']), connection.escape(json['date']), connection.escape(json['img']),
        connection.escape(json['describe']),connection.escape(json['ats']),connection.escape(json['Snippet'])) + ';')
        cursor.execute(sql)
        insertId = cursor.lastrowid
        db.commit()

        for i in json['data']:
            dataSql = cursor.mogrify('insert into data_card(`fid`,`title`,`url`,`content`,`img`,`type`) values(%d, %s, %s, %s, NULL, %d)' % \
            (insertId, connection.escape(json['data'][i]['title']), connection.escape(json['data'][i]['url']),
            connection.escape(json['data'][i]['content']),1) + ';')
            cursor.execute(dataSql)
            db.commit()

        for i in json['card']:
            dataSql = cursor.mogrify('insert into data_card(`fid`,`title`,`url`,`content`,`img`,`type`) values(%d, %s, %s, %s, %s, %d)' % \
            (insertId, connection.escape(json['card'][i]['title']), connection.escape(json['card'][i]['url']),
            connection.escape(json['card'][i]['content']),connection.escape(json['card'][i]['img']),0) + ';')
            cursor.execute(dataSql)
            db.commit()
    except Exception as e:
        log("SQL Error: " + str(e))

if __name__ == '__main__':
    connection = pymysql.connect("127.0.0.1","root","root","bing",use_unicode=True, charset="utf8")
    cursor = connection.cursor()
    date = datetime.datetime.now() - datetime.timedelta(days=-1)
    date = str(date.strftime('%Y%m%d'))
    save_json_to_sql(connection,cursor,get_bing_json(date))
    connection.close()
