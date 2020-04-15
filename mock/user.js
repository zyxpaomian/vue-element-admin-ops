import Mock from 'mockjs';
export default {
    //user 相关接口
    userInfo:function(req){
        const params= JSON.parse(req.body)
        if (params.user == "barney") {
            var ret = {"Msg":[],"Status":"OK","Total":1}
            ret.Msg.push(Mock.mock( 
                {"username": Mock.Random.first(), 
                "usergroup|1":["GroupA","GroupB","GroupC"],
                "account|1":["sso","local"],
                "createtime":Mock.Random.datetime(),     
                }) 
            )
            return ret;     
        } else if (params.user === 'all' && params.group === 'all') {
            var ret = {"Msg":[],"Status":"OK","Total":30}
            for (var i=1; i<30; i++) {
                ret.Msg.push(Mock.mock(           
                    {"username": Mock.Random.first(), 
                    "usergroup|1":["GroupA","GroupB","GroupC"],
                    "account|1":["sso","local"],
                    "createtime":Mock.Random.datetime(),  
                    })
                )
            }
            return ret;            

        } else {
            var ret = {"Msg":[],"Status":"OK","Total":0}
            return ret;
        }     
    }
}