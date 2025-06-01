/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FilleControllerService {
    /**
     * 上传文件
     * 支持文件上传，返回 JSON 格式响应
     * @param accesstoken
     * @param formData
     * @returns any 文件上传成功
     * @throws ApiError
     */
    public static uploadFile(
        accesstoken?: string,
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/file/upload',
            headers: {
                'Accesstoken': accesstoken,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * 上传文件
     * 支持文件上传，返回 JSON 格式响应
     * @param accesstoken
     * @param formData
     * @returns any 文件上传成功
     * @throws ApiError
     */
    public static uploadQuestionFile(
        accesstoken?: string,
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/file/upload/question',
            headers: {
                'Accesstoken': accesstoken,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param filename
     * @returns string OK
     * @throws ApiError
     */
    public static getImage(
        filename: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/file/userheader/{filename}',
            path: {
                'filename': filename,
            },
        });
    }
    /**
     * @param filename
     * @returns string OK
     * @throws ApiError
     */
    public static getQuestionContent(
        filename: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/file/questionContent/{filename}',
            path: {
                'filename': filename,
            },
        });
    }
}
