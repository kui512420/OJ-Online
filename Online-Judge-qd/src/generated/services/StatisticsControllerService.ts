/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseLong } from '../models/BaseResponseLong';
import type { BaseResponseMapStringObject } from '../models/BaseResponseMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatisticsControllerService {
    /**
     * @returns BaseResponseLong OK
     * @throws ApiError
     */
    public static getUserCount(): CancelablePromise<BaseResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/statistics/user/count',
        });
    }
    /**
     * @returns BaseResponseMapStringObject OK
     * @throws ApiError
     */
    public static getSystemStatistics(): CancelablePromise<BaseResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/statistics/system',
        });
    }
    /**
     * @returns BaseResponseLong OK
     * @throws ApiError
     */
    public static getSubmitCount(): CancelablePromise<BaseResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/statistics/submit/count',
        });
    }
    /**
     * @returns BaseResponseLong OK
     * @throws ApiError
     */
    public static getQuestionCount(): CancelablePromise<BaseResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/statistics/question/count',
        });
    }
    /**
     * @returns BaseResponseLong OK
     * @throws ApiError
     */
    public static getLogCount(): CancelablePromise<BaseResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/statistics/log/count',
        });
    }
}
