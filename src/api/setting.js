import axios from "axios";
import {baseUrl} from "./api";

/**
 * 查询设置信息
 *
 * @see https://www.easyai.com
 */
export const findSetting = (params) => axios.get(`${baseUrl}/setting/find`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});
