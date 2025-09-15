// 文件上传相关API
import {ApiResponse} from "../types/common.ts";
import {apiClient} from "../utils/apiClient.ts";

export const uploadApi = {
    // 上传头像
    uploadAvatar: (file: File, progressCallback?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> => {
        return apiClient.upload('/upload/avatar', file, progressCallback)
    },

    // 上传文件
    uploadFile: (file: File, type: string, progressCallback?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> => {
        return apiClient.upload(`/upload/${type}`, file, progressCallback)
    }
}
