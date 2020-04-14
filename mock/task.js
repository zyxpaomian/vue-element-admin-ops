import Mock from 'mockjs';
export default {
    //agent 相关接口
    agentInfo:function(req){
        const params= JSON.parse(req.body)
        if (params.ip == "1.1.1.1") {
            var ret = {"Msg":[],"Status":"OK","Total":1}
            ret.Msg.push(Mock.mock( 
                {"agentnum|+1": 1, 
                "agentip":Mock.Random.ip(),
                "agentidc":Mock.Random.region(),
                "agentzone":Mock.Random.string( 5 ),
                "agentstatus":Mock.Random.integer(0,1),
                "pingswitch":Mock.Random.integer(0,1),
                "tcpswitch":Mock.Random.integer(0,1),
                "tcpdumpswitch":Mock.Random.integer(0,1)       
                }) 
            ) 
            return ret;     
        } else if (params.ip === 'all' && params.idc === 'all') {
            var ret = {"Msg":[],"Status":"OK","Total":30}
            for (var i=1; i<30; i++) {
                ret.Msg.push(Mock.mock(           
                    {"agentnum|+1": 1, 
                    "agentip":Mock.Random.ip(),
                    "agentidc":Mock.Random.region(),
                    "agentzone":Mock.Random.string( 5 ),
                    "agentstatus":Mock.Random.integer(0,1),
                    "pingswitch":Mock.Random.integer(0,1),
                    "tcpswitch":Mock.Random.integer(0,1),
                    "tcpdumpswitch":Mock.Random.integer(0,1)
                    })
                )
            }
                return ret;            

        } else {
            var ret = {"Msg":[],"Status":"OK","Total":0}
            return ret;
        }     
    },    
    historyInfo:function(req){
        const params= JSON.parse(req.body)
        if (params.user == "all" && params.starttime == "all" && params.endtime == "all") {
            var ret = {"Msg":[],"Status":"OK","Total":30}
            for (var i=0; i<30; i++) {
                ret.Msg.push(Mock.mock(           
                    {"taskid|+1": 1, 
                    "execuser":Mock.Random.first(),
                    "exectime":Mock.Random.datetime(),
                    "execmethod|1":['agent','ansible'],
                    "exectype|1":['sync','rsync'],
                    "execcmd":Mock.Random.string( 15 ),                
                    "execstatus|1":['finish','executing','failed'],
                    })
                )
            }
            return ret;
        } else {
            var ret = {"Msg":[],"Status":"OK","Total":5}
            for (var i=0; i<5; i++) {
                ret.Msg.push(Mock.mock(           
                    {"taskid|+1": 1, 
                    "execuser":Mock.Random.first(),
                    "exectime":Mock.Random.datetime(),
                    "execmethod|1":['agent','ansible'],
                    "exectype|1":['sync','rsync'],
                    "execcmd":Mock.Random.string( 15 ),                
                    "execstatus|1":['finish','executing','failed'],
                })
                )
            }
            return ret       
        }
    },
    taskDetail:function(req){
        const params= JSON.parse(req.body)
        var taskid = params.taskid
        var ret = {"Msg":[],"Status":"OK","Total":30}
        for (var i=0; i<30; i++) {
            ret.Msg.push(Mock.mock(           
                {"execip":Mock.Random.ip(),
                "output":Mock.Random.string(30),
                "status|1":['success','failed'],
                })
            )
        }
        return ret;
    },
    blackIpList:function() {
        var ret = {"Msg":[],"Status":"OK","Total":30}
        for (var i=0; i<30; i++) {
            ret.Msg.push(Mock.mock(           
                {"ip":Mock.Random.ip(),
                "remark":Mock.Random.string(30),
                "adduser":Mock.Random.first(),                
                })
            )
        }
        return ret;        
    }

}