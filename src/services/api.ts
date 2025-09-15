import { createApiWrapper } from './apiWrapper'

// 认证相关API
import {authApi} from "./authApi";
// 交易相关API
import {transactionApi} from "./transactionApi";
// 用户管理相关API
import {userApi} from "./userApi";
// 仪表盘相关API
import {dashboardApi} from "./dashboardApi";
// 统计相关API
import {statisticsApi} from "./statisticsApi";
// 系统配置相关API
import {configApi} from "./configApi";
// 操作日志相关API
import {logApi} from "./logApi";
// 文件上传相关API
import {uploadApi} from "./uploadApi";
// 统计报表相关API
import {reportApi} from "./reportApi";
// 折扣策略相关API - 强制使用真实API
import {discountApi} from "./discountApi";
// 设备管理相关API
import {deviceApi} from "./deviceApi";
// 站点管理API
import {siteApi} from "./siteApi";

// 统一导出
export {
  authApi,
  transactionApi,
  userApi,
  dashboardApi,
  statisticsApi,
  configApi,
  logApi,
  uploadApi,
  reportApi,
  discountApi,
  deviceApi,
  siteApi,
  createApiWrapper
}
