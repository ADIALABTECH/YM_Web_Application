#from crypt import methods
from flask import Flask, render_template, request, make_response, Response, flash, send_file
import pymysql
import datetime
import json
from time import time, sleep
from random import random
from config import config;
from decimal import *;
import to_csv;
import pandas as pd
import csv

import mimetypes
mimetypes.add_type('application/javascript', '.mjs')


app = Flask(__name__)
app.secret_key = "Master_Key"

DB_flag = 0

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        # 👇️ if passed in object is instance of Decimal
        # convert it to a string
        if isinstance(obj, Decimal):
            return str(obj)
        elif isinstance(obj, datetime.date):
            return str(obj)
        # 👇️ otherwise use the default behavior
        return json.JSONEncoder.default(self, obj)

# 검사 항목 관리 CLASS (SELECT, INSERT, DELETE) --
class Data:
    def __init__(self):
        pass

    def checkData(self):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()

        sql = '''SELECT IFNULL(MAX(index_num),0) FROM tb_inspection_model_list WHERE create_date = %s'''
        now = datetime.datetime.now()
        date = now.strftime('%Y-%m-%d')
        curs.execute(sql, date)
        rows = curs.fetchall()

        number_latest = rows[0][0]

        db.commit()
        db.close()

        return number_latest

    # 조회
    def selectData(self):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()
        date_format = '%Y-%m-%d'
        sql = '''SELECT id, index_num, model_name, state, start_insp_time, end_insp_time FROM tb_inspection_model_list WHERE create_date = %s'''
        now = datetime.datetime.now()
        date = now.strftime('%Y-%m-%d')
        curs.execute(sql, date)
        rows = curs.fetchall()
        ret = []

        for e in rows:
            if (e[3]==0):
                state = "대기";
            elif (e[3]==1):
                state = "진행중";
            elif (e[3]==2):
                state = "완료";
            temp = {'id': e[0], 'number': e[1], 'model': e[2], 'start_insp_time':str(e[4]) , 'end_insp_time':str(e[5]), 'state': state}
            ret.append(temp)
            
        print(ret);
        db.commit()
        db.close()
        return ret

    # 초기화
    def clearItem(self):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()

        # sql = "DELETE FROM test_table"
        sql = '''DELETE FROM tb_inspection_model_list WHERE create_date = %s AND state = 0'''
        now = datetime.datetime.now()
        date = now.strftime('%Y-%m-%d')
        try :
            curs.execute(sql, date)
        except Exception as e:
            flash(e);
        db.commit()
        db.close()

    # 추가
    def insertItem(self, num, model):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()

        sql = '''INSERT INTO tb_inspection_model_list (index_num, model_name, create_date) VALUES (%s, %s, %s)'''
        now = datetime.datetime.now()
        date = now.strftime('%Y-%m-%d')
        if not curs.execute(sql, (int(num), model, date)):
            flash("생성 오류[1000]")
        db.commit()
        db.close()

    # 수정
    def updateItem(self, model_id, model):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()

        sql = '''UPDATE tb_inspection_model_list SET model_name = %s where id = %s'''
        if not curs.execute(sql, (model, int(model_id))):
            flash("수정 오류[2000]")
        db.commit()
        db.close()

    # 삭제
    def deleteItem(self, model_id):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()

        sql = '''SELECT IFNULL(MAX(id),0) FROM  tb_inspection_model_list '''
        curs.execute(sql)
        rows = curs.fetchall()
        last_id = rows[0][0]

        sql = '''DELETE FROM tb_inspection_model_list WHERE id = %s'''
        if not curs.execute(sql, (int(model_id))):
            flash("삭제 오류[-1000]")
        else:
            if int(last_id) != int(model_id):
                sql = '''UPDATE tb_inspection_model_list SET index_num = index_num-1 where id > %s'''
                if not curs.execute(sql, (int(model_id))):
                    flash("처리 오류[-2000]")

        db.commit()
        db.close()
    # 현재 측정중인 두께 데이터 재갱신
    def searchThkforGraph(self):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()
        #Test Code
        now_date = datetime.datetime.now();
        before_date = now_date - datetime.timedelta(minutes=5);
        #sql = "SELECT datetime, calc_thick from tb_model_measurement_list where inspect_id = (SELECT id from tb_inspection_model_list where state = 1 order by id desc limit 1) AND datetime between %s AND %s;";
        sql = "SELECT datetime, calc_thick from tb_model_measurement_list where inspect_id = (SELECT id from tb_inspection_model_list where state = 1 order by id desc limit 1) order by id desc limit 500;";
        #curs.execute(sql, (before_date, now_date))
        curs.execute(sql)
        rows = curs.fetchall()
        print(rows);
        return rows;
        
    #조건별 검사 이력내역 조회
    #input : 모델명, 검색 시작 날짜, 검색 종료 날짜, 검색 시작 거리, 검색 종료 거리
    #output : 검색 결과 갯수, 페이지(검색 결과 갯수 / 콘텐츠 갯수), 총 페이지, 페이지당 콘텐츠 갯수
    #           콘텐츠 리스트 : { id, model명, 검사 결과, 이미지01, 이미지02, 날짜, 그래프 정보 }
    #           요약데이터 { 표면불량, 두께 불량 }
    #nPage를 통해 limit controll
    # => nPage가 1이면 5000 ~ 10000 쿼리 결과 return
    #nPage는 항상 default 1의 값으로 시작한다.
    def searchHistory(self, model_name, start_date, end_date, start_lange, end_lange, id, page):
        limit_qry_row = 1500;
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()
        sql_ng_state01 = '''SELECT COUNT(*) FROM tb_model_measurement_list
                            WHERE model_name = %s AND
                            DATE(datetime) BETWEEN %s AND %s AND
                            lange BETWEEN %s AND %s''';
        sql_ng_state02 = '''SELECT COUNT(*) FROM tb_model_measurement_list
                            WHERE model_name = %s AND
                            DATE(datetime) BETWEEN %s AND %s AND
                            lange BETWEEN %s AND %s AND
                            (cam01_state = 1 OR cam02_state = 1)''';
        curs.execute(sql_ng_state01, (model_name, start_date, end_date, start_lange, end_lange))
        ng_result01 = curs.fetchone();
        curs.execute(sql_ng_state02, (model_name, start_date, end_date, start_lange, end_lange))
        ng_result02 = curs.fetchone();
        
        if(page > 0) :
            sql = '''SELECT * FROM tb_model_measurement_list
            WHERE model_name=%s AND 
            DATE(datetime) BETWEEN %s AND %s AND
            lange BETWEEN %s AND %s AND
            (cam01_state = 1 OR cam02_state = 1) AND
            id > %s order by id asc limit %s'''    
        elif(page < 0) :
            sql = '''SELECT * FROM tb_model_measurement_list
            WHERE model_name=%s AND 
            DATE(datetime) BETWEEN %s AND %s AND
            lange BETWEEN %s AND %s AND
            (cam01_state = 1 OR cam02_state = 1) AND
            id < %s order by id asc limit %s'''        
        
        curs.execute(sql, (model_name, start_date, end_date, start_lange, end_lange, id, limit_qry_row))
        #rows = json.dumps(curs.fetchall(), cls=DecimalEncoder)
        rows = curs.fetchall()
        result = {'data':'null', 'content':'null'}
        result02 = {}
        b_result = []
        paging = 1;
        for idx, e in enumerate(rows, start=1):
            dic = {'idx' : str(e[0]),
                    'model_nm' : str(e[2]),
                    'calc_thick' : str(e[3]),
                    'lange' : str(e[5]),
                    'img01' : str(e[6]),
                    'img02' : str(e[8]),
                    'cam01_ng' : str(e[7]),
                    'cam02_ng' : str(e[9]),
                    'date' : str(e[10]),
                  }
            b_result.append(dic)
            if(idx % 100 == 0):
                result02[str(paging)] = b_result
                paging+=1
                b_result = []
        
        result['content'] = result02
        result['data'] = {'total_data_cnt':ng_result01, 'ng_data_cnt':ng_result02}
        db.close()
        return result;
    
    def savecsv(self, model_name, start_date, end_date, start_lange, end_lange):
        db = pymysql.connect(host=config.DB_host, user=config.DB_user, db=config.DB_schema, password=config.DB_pw, charset=config.DB_charset, port=config.DB_port)
        curs = db.cursor()
        sql = '''SELECT * FROM tb_model_measurement_list
                WHERE model_name=%s AND 
                DATE(datetime) BETWEEN %s AND %s AND
                lange BETWEEN %s AND %s AND
                (cam01_state = 1 OR cam02_state = 1)'''
        curs.execute(sql, (model_name, start_date, end_date, start_lange, end_lange))
        result = curs.fetchall();
        db.close()
        return result
    
# dashboard
# 메인 페이지
@app.route('/dashboard')
@app.route('/')
def main_page():
    last_Data = Data().checkData()
    now = datetime.datetime.now()
    date = now.strftime('%Y-%m-%d')
    if last_Data == 0:
        test_message = "[" + date + "] 설정된 검사항목이 존재하지 않습니다."
    else:
        test_message = "[" + date + "]"
    print(config.WC_inputModel);
    return render_template("main.html", test_message=test_message)

# 메인페이지 - 검사중인 모델 그래프 표시
@app.route('/show_thk_graph', methods=['POST'])
def show_thk_g():
    # req_data = request.get_json();
    # print(req_data);
    result = Data().searchThkforGraph()
    print(result)  
    if(len(result) == 0):
        return Response(json.dumps(result, cls=DecimalEncoder), mimetype='application/json', status=305);
    else:
        return Response(json.dumps(result, cls=DecimalEncoder), mimetype='application/json', status=200);
    
# 항목 추가 페이지
@app.route('/insert')
def insert():
    select_Data = Data().selectData()
    now = datetime.datetime.now()
    date = now.strftime('%Y-%m-%d')
    ws_loading = config.WsPath_showLive;
    return render_template("insert.html", date=date, select_Data=select_Data, ws = ws_loading)

# 검사 결과 조회 페이지
@app.route('/history')
def history():
    select_Data = Data().selectData()
    now = datetime.datetime.now()
    date = now.strftime('%Y-%m-%d')
    return render_template("history.html", date=date, select_Data=select_Data)


# 항목 추가 페이지 신규Btn
@app.route('/new', methods=['POST'])
def new():
    last_Data = Data().checkData()
    #select_Data = Data().selectData()
    now = datetime.datetime.now()
    date = now.strftime('%Y-%m-%d')
    #return date, select_Data;
    test = {}
    test['date'] =date;
    test['check_data'] = last_Data+1; #오늘자에 해당하는 값을 단순 가져오는것이 아니라 순번을 생성해야하기 때문에 +1로 생성하는것이 맞음
    return json.dumps(test);


# 항목 추가 페이지 저장Btn
@app.route('/save', methods=['POST'])
def save():
    req_data = request.get_json();
    print(req_data);

    if req_data['value_id'] == "":
        Data().insertItem(req_data['index_num'], req_data['model_name'])
    elif req_data['value_id'] != "":
        Data().updateItem(req_data['value_id'], req_data['model_name'])

    try: 
        select_Data = Data().selectData()
        return "200";
    except:
        return "400";
    #now = datetime.datetime.now()
    #date = now.strftime('%Y-%m-%d')
    #return render_template("insert.html", date=date, select_Data=select_Data)

@app.route('/insert_reload', methods=['GET'])
def insert_reload():
    select_Data = Data().selectData()
    now = datetime.datetime.now()
    return json.dumps(select_Data);


# 항목 추가 페이지 삭제Btn
@app.route('/delete', methods=['DELETE'])
def delete():
    req_data = request.get_json();
    print(req_data);

    if req_data['value_id'] != "":
        try:
            Data().deleteItem(req_data['value_id'])
            return "200";
        except Exception as e:
            print(e);
            return "400";
    # return render_template("insert.html", date=date, select_Data=select_Data)


# 항목 추가 페이지 초기화Btn
@app.route('/clear', methods=['POST'])
def clear():
    Data().clearItem()
    # select_Data = Data().selectData()
    # now = datetime.datetime.now()
    # date = now.strftime('%Y-%m-%d')
    try: 
        Data().clearItem()
        return "200";
    except:
        return "400";
    
    
@app.route('/search_history', methods=['POST'])
def history_search():
    req_data = request.get_json();
    print(req_data);
    result = Data().searchHistory(req_data['model_name'], req_data['start_date'], req_data['end_date'], req_data['start_lange'], req_data['end_lange'], req_data['id'], req_data['now_page'])
    
    if(len(result['content']) == 0):
        return Response(json.dumps(result, cls=DecimalEncoder), mimetype='application/json', status=400);
    else:
        return Response(json.dumps(result, cls=DecimalEncoder), mimetype='application/json', status=200);
    
@app.route('/save_to_csv', methods=['POST'])
def save_csv():
    req_data = request.get_json();
    result = Data().savecsv(req_data['model_name'], req_data['start_date'], req_data['end_date'], req_data['start_lange'], req_data['end_lange'])
    print(result)
    # info = json.loads(json.dumps(result))
    # df = pd.json_normalize(info['content'])
    info = json.loads(json.dumps(result, cls=DecimalEncoder))
    now_date = datetime.date.today().isoformat();
    try:
        f = open("static/image/csv/inspectionResult_"+str(now_date) + ".csv", "w", newline="", encoding='cp949')
        fr = csv.writer(f)
        # 헤더 추가하기
        fr.writerow(["총 검사 갯수", "NG 판정 검사 갯수", "NG Percent", "파일 생성 날짜"])
        summary_data = [req_data['total_cnt'], req_data['ng_cnt'], req_data['ng_percent'], now_date]
        fr.writerow(summary_data)
        fr.writerow("")
        
        fr.writerow(["ID", "Model명", "두께(mm)", "길이(m)", "사진1경로", "사진2경로", "날짜"])
        for row in info:
            #0, 2, 3, 5, 6, 8, 10
            data = [str(row[0]), str(row[2]), str(row[3]), str(row[5]), row[6], row[8], str(row[10])]
            fr.writerow(data)
        f.close()
        
        return Response("", mimetype='application/json', status=200);
    except:
        return Response("", mimetype='application/json', status=200);
   
@app.route('/download_csv')
def csv_file_download_with_file():
    now_date = datetime.date.today().isoformat();
    file_name = "static/image/csv/inspectionResult_"+str(now_date) + ".csv"
    return send_file(file_name,
                     mimetype='text/csv',
                     attachment_filename='downloaded_file_name.csv',# 다운받아지는 파일 이름. 
                     as_attachment=True)
    

# if __name__ == "__main__":
    #app.run(host='127.0.0.1', port=5000, debug=True);