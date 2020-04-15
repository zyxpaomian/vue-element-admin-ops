import Mock from 'mockjs';
import task from './task.js';
import user from './user.js';
Mock.mock('/mgt/api/v1/agent/agentinfo','post', task.agentInfo);
Mock.mock('/mgt/api/v1/task/historyinfo','post',task.historyInfo);
Mock.mock('/mgt/api/v1/task/taskdetail','post',task.taskDetail);
Mock.mock('/mgt/api/v1/task/blackiplist','get',task.blackIpList);
Mock.mock('/mgt/api/v1/user/userinfo','post',user.userInfo);
export default Mock;