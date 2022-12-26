var loading_ms = 5;

export const show_graph = (json_data) => {
    //로딩 현황 보여주기
    var loading = document.querySelector('#loading_state')
    show_hight_chart(json_data);
    loading.innerHTML = `5초 이후 자동갱신`;
    //setInterval(() => loading_sate(loading,json_data), 1000);   
}

const loading_sate = (loading_dom, json_data) => {
    loading_ms = loading_ms - 1;
    loading_dom.innerHTML = `${loading_ms}초 이후 자동갱신`;
    console.log(loading_ms)
    if(loading_ms == 0){
        loading_ms = 5;
    }
}

const show_hight_chart = (json_data) => {
    // console.log("look?");
    // console.log(json_data);
    Highcharts.setOptions({
        lang: { thousandsSep:',' },
        global: {
            useUTC : false
        }
    })
    Highcharts.chart('thickness_chart', {
        chart: {
            width: 1355,
            height: 250,
            marginTop:40,
        },

        title: {
            text: '측정중인 Model 두께 현황'
        },
    
        subtitle: {
            text: '-'
        },
        
        //세로축
        yAxis: {
            title: {
                text: '측정 두께(mm)'
            },
            min:0,
            max:0.5
        },
        //가로축
        xAxis: {
            //type: 'datetime',
            labels: {
                formatter: function() {
                    //return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value);
                    return Highcharts.dateFormat('%H:%M:%S', this.value);
                }
            },
            title: {
                text: '측정시간'
            },
            // accessibility: {
            //     rangeDescription: y_axis_data
            // }

        },
        //현재 상태에서는 legend 불필요
        // legend: {
        //     layout: 'vertical',
        //     align: 'right',
        //     verticalAlign: 'middle'
        // },
        //xAxis 빈도
        plotOptions: {
            series: {
                turboThreshold: 0,
                label: {
                    connectorAllowed: false
                },
                //pointStart: 1
            }
        },
        //주석 관련
        series: [{
            name: 'Thick Data',
            data: json_data
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 700,
                    Height:200
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}
