$(function () {

    // 修改时间

    class Park{
        constructor(){
            this.time=1000;
        }
        updataTime(){
            this.timeElement=$(".time");
            this.dataElement=$(".date");
            getCurrentTime.call(this);
            setInterval(getCurrentTime.bind(this),this.time);
            function getCurrentTime() {
                let time1=new Date();
                let year=time1.getFullYear(),
                    month=time1.getMonth()+1,
                    day=time1.getDate(),
                    hours=time1.getHours(),
                    min=time1.getMinutes(),
                    sec=time1.getSeconds();
                // month=month>=10?month:"0"+month;
                hours=hours>=10?hours:"0"+hours;
                min=min>=10?min:"0"+min;
                sec=sec>=10?sec:"0"+sec;
                this.timeElement.text(hours+":"+min+":"+sec);
                this.dataElement.text(year+"年"+month+"月"+day+"日");
            }
        }
    }
    var park=new Park();
    park.updataTime();


    //获取今日盈利的数据

    function gain(){

        $.get(config.mon_number,function (data) {
            var openId=data;

            $(".money-left").text(openId.data.t_number);
            $(".ratio").text(openId.data.ratio);
            // ratio
        })
    }
        setInterval(gain,1000);

    //获取停车时长
    function radioTime(){
    $.get(config.current_ratio,function (data) {
        var currentratio=data.data;
        // console.log(data.data);
        let radioname=[];
        let radiocontent=[];
        currentratio.forEach(elem=>{
            // console.log(elem.name);
            let obj={};
            obj.name=elem.name;
            obj.value=elem.total;
            obj.ratio=elem.total;
            radioname.push(elem.name);
            radiocontent.push(obj);
        })
       let pip=$(".pip")[0];

        let Pip=echarts.init(pip);
       let option={
           tooltip: {
               trigger: 'item',
               formatter: "{a} <br/>{b}: {c} ({d}%)"
           },
           series: [
               {
                   name:'访问来源',
                   type:'pie',
                   radius: ['50%', '70%'],
                   avoidLabelOverlap: false,
                   data:radiocontent,
                   itemStyle: {
                       emphasis: {
                           shadowBlur: 10,
                           shadowOffsetX: 0,
                           shadowColor: 'rgba(0, 0, 0, 0.5)'
                       }
                   }
               }
           ]
       }
       Pip.setOption(option);
    })

    }
    radioTime();
    setInterval(radioTime,6000);
//设备警告
    function diverWarning(){
    $.get(config.device_error,function (data) {
        var openId=data.data;

        let html=``;
        openId.forEach(elem=>{
            if (elem.status==0){
                html +=`
            <li class="device-item error">
                <div class="top">
                <div class="person">
                    <span>${elem.status_name}</span>
                    <span>巡逻人员：${elem.patrol_name}</span>
                </div>
                    <div class="time">${elem.time}</div>
                </div>
                <div class="info">
                    <div class="pos">${elem.park_name}</div>
                    <div class="error">${elem.error}</div>
                </div>
               </li>
            
            `
            } else{
                html +=`
                <li class="device-item success">
                    <div class="top">
                    <div class="person">
                        <span>${elem.status_name}</span>
                        <span>巡逻人员：${elem.patrol_name}</span>
                    </div>
                        <div class="time">${elem.time}</div>
                    </div>
                    <div class="info">
                        <div class="pos">${elem.park_name}</div>
                        <div class="error">${elem.error}</div>
                    </div>
                   </li>
            
            `
            }

            $(".device-list-box").html(html);

        })

        // ratio
    })
    }
    diverWarning();
    setInterval(diverWarning,6000);

//获取停车位和未停车位的数据

    function stopr_info(){
        $.get(config.stop_info,function (data) {
            var openId=data.data;
            // console.log(data.data.total_seat);
            // ratio
            $($(".stop-col-inner>div:first-child")[0]).text(openId.total_seat);
            $($(".stop-col-inner>div:first-child")[1]).text(openId.occupy_seat);
            $($(".stop-col-inner>div:first-child")[2]).text(openId.ratio+"%");
        })
    }
    stopr_info()
    setInterval(stopr_info,6000);
    //昨日运营情况

    function zuori_yunying(){
    $.get(config.zuori_yunying,function (data) {
        var openId=data.data;
        // console.log(data.data);
        let html=``;
        openId.forEach(elem=>{
            html +=`
            <li>
                <h3>${elem.name}</h3>
                    <div>
                   <span class="left">进出车辆<i>${elem.total_flow}</i></span>
                    <span class="right">总收入 <i>￥${elem.total_money}</i></span>
                    </div>
                </li>   
            
            `
        })
        $(".info-list-box").html(html);
        // ratio
    })
    };
    zuori_yunying();
    setInterval(zuori_yunying,6000);



    //记录拍照

    function china_new_plot(){


    $.get(config.china_new_plot,function (data){
        let plot=data.data;
        // console.log(data.data);
        let html=``;
        plot.forEach(elem=>{
           html +=`
                 <li>
                    <div class="in-outtime">${elem.in_out_time}</div>
                    <div class="img" style="background-image: url(${elem.photoFilepathIn})"></div>
                    <div class="stop-name">${elem.name}</div>
                    <div class="stop-number">${elem.plate_num}</div>
                </li>
              
           `
        })
        // console.log(html)
        $(".stop-box").html(html);
    });
    }
    china_new_plot();
    setInterval(china_new_plot,6000);

    //
    // $.get(config.shoufei_paihang,function (data) {
    //     let plot = data;
    //     console.log(data);
    // });

//停车收费排行
    let stop_pay_type=$(".stop-pay-type")[0];
    let stop_pay_time=$(".stop-pay-time")[0];
    console.log(stop_pay_type, stop_pay_time);
    let pay_type=echarts.init(stop_pay_type);
    let pay_time=echarts.init(stop_pay_time);
    let option5 = {
        color:['#b8e3ff','#009cff'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient:'horizontal',
            itemWidth:5,
            bottom:15,
            data:['现金缴费','电子缴费'],
            textStyle:{
                color:'#839bb0'
            }


        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                center:['50%','40%'],
                radius: ['45%', '65%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            // fontWeight: 'bold'
                        }
                    }
                },
                data:[
                    {value:120, name:'现金缴费' ,selected:true},
                    {value:310, name:'电子缴费'},

                ]
            }
        ]
    };
    var stopPayTypeOption = {
        color:['#fffbbe','#ffbd3d'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            bottom: 15,
            itemWidth:5,
            data:['提前缴费','出口缴费'],
            textStyle:{
                color:'#839bb0'
            }
        },
        series: [
            {
                name:'缴费类型',
                type:'pie',
                radius: ['45%', '65%'],
                center:['50%','40%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14'
                        }
                    }
                },
                data:[
                    {value:35, name:'提前缴费',selected:true},
                    {value:310, name:'出口缴费'}
                ]
            }
        ]
    };
    pay_type.setOption(option5);
    pay_time.setOption(stopPayTypeOption);

    //中间地理位置的设置


})