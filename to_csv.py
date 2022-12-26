import csv;
import json;
import pandas as pd 
import json 

def json_saveto_csv(data):
    # #info = json.loads(data)
    # info = data;
    # print('====info====');
    # print(info);
    # print('=======');
    # #print(info[0].keys())

    # with open("samplecsv.csv", 'w') as f: 
    #     wr = csv.DictWriter(f, fieldnames = "") 
    #     wr.writeheader() 
    #     wr.writerows(info)     
    # f = open('result.do', 'r', encoding='UTF-8') 

    # line = f.readline() 

    # f.close() 

    #json_data = json.loads() 
    json_data = json.dumps(data)
    # data = json_data['data'] 

    df = pd.DataFrame( json.loads(json_data)) 
    df.to_csv('out.csv', header=True, index=True,encoding='ms949') 
        
        
        

