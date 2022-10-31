#from crypt import methods
from flask import Flask, render_template, request, make_response, Response, flash
import pymysql
import datetime
import json
from time import time, sleep
from random import random
from config import config;

import mimetypes
mimetypes.add_type('application/javascript', '.mjs')


app = Flask(__name__)
app.secret_key = "Master_Key"

DB_flag = 0


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

        sql = '''SELECT id, index_num, model_name, state FROM tb_inspection_model_list WHERE create_date = %s'''
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
            temp = {'id': e[0], 'number': e[1], 'model': e[2], 'state': state}
            ret.append(temp)

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

#데이터 분석 결과 노출 / 실시간 및 비동기 작업 필요
#main에서 호출됨
@app.route('/Detect')
def test_data():
    #
    def test_raw_data():

        # 테스트 데이터
        test_img_file = "test_image1"
        test_model_name = "test_model1"
        test_len_str = 100
        test_len_end = 200
        test_thick_len = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]
        test_thick = [37, 38, 37, 42, 41, 45, 37, 35, 36, 35, 33]
        test_color = []

        while True:

            # 검사항목 설정 확인
            last_Data = Data().checkData()
            now = datetime.datetime.now()
            date = now.strftime('%Y-%m-%d')
            if last_Data == 0:
                test_message = "[" + date + "] 설정된 검사항목이 존재하지 않습니다."
            else:
                test_message = "[" + date + "]"

            # 이미지 파일 테스트 용
            if test_img_file == "test_image1":
                test_img_file = "test_image2"
            elif test_img_file == "test_image2":
                test_img_file = "test_image1"

            # 모델명 테스트 용
            if test_model_name == "test_model1":
                test_model_name = "test_model2"
            elif test_model_name == "test_model2":
                test_model_name = "test_model1"

            # 길이 시작 지점, 종료 지점 테스트 용
            if test_len_str == 100:
                test_len_str = 200
                test_len_end = 300
            elif test_len_str == 200:
                test_len_str = 100
                test_len_end = 200

            if test_len_str == 100:
                test_len_str = 200
                test_len_end = 300
            elif test_len_str == 200:
                test_len_str = 100
                test_len_end = 200

            # 두께 그래프 테스트 용
            if test_thick_len[0] == 100:
                test_thick_len = [200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300]
                test_thick = [41, 48, 42, 38, 39, 40, 35, 35, 36, 35, 33]
            elif test_thick_len[0] == 200:
                test_thick_len = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]
                test_thick = [37, 38, 37, 42, 41, 45, 37, 35, 36, 35, 33]

            # 두께 그래프 색상 테스트
            test_color.clear()
            for test_list in test_thick:
                if test_list < 41:
                    test_color.append('rgba(0, 0, 0, 0.5)')
                else:
                    test_color.append('rgb(250, 83, 83)')

            # json형식 데이터 전달
            json_data = json.dumps({
                'test_message': test_message,
                'test_img': test_img_file,
                'test_model_name': test_model_name,
                'test_len_str': test_len_str,
                'test_len_end': test_len_end,
                'test_graph': {'test_thick_len': test_thick_len,
                               'test_thick': test_thick},
                'test_color': test_color})

            sleep(5)
            yield f"data:{json_data}\n\n"

    return Response(test_raw_data(), mimetype='text/event-stream')


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


# 항목 추가 페이지
@app.route('/insert')
def insert():
    select_Data = Data().selectData()
    now = datetime.datetime.now()
    date = now.strftime('%Y-%m-%d')
    return render_template("insert.html", date=date, select_Data=select_Data)

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

# if __name__ == "__main__":
    #app.run(host='127.0.0.1', port=5000, debug=True)