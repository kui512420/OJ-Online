/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponsePageQuestionSubmit } from '../models/BaseResponsePageQuestionSubmit';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { BaseResponseUserCommitRequest } from '../models/BaseResponseUserCommitRequest';
import type { SubmitListRequest } from '../models/SubmitListRequest';
import type { SubmitRankRequest } from '../models/SubmitRankRequest';
import type { SubmitRequest } from '../models/SubmitRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionSubmitControllerService {
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static submitQuestion(
        requestBody: SubmitRequest,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submit/sub',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponsePageQuestionSubmit OK
     * @throws ApiError
     */
    public static submitQuestionRankList(
        requestBody: SubmitRankRequest,
    ): CancelablePromise<BaseResponsePageQuestionSubmit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submit/rank',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponsePageQuestionSubmit OK
     * @throws ApiError
     */
    public static submitQuestionList(
        requestBody: SubmitListRequest,
        accesstoken?: string,
    ): CancelablePromise<BaseResponsePageQuestionSubmit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submit/list',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param accesstoken
     * @returns BaseResponseUserCommitRequest OK
     * @throws ApiError
     */
    public static userCommitInfo(
        accesstoken?: string,
    ): CancelablePromise<BaseResponseUserCommitRequest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submit/userCommitInfo',
            headers: {
                'Accesstoken': accesstoken,
            },
        });
    }
    /**
     * @param pageNum
     * @param pageSize
     * @param accesstoken
     * @returns BaseResponsePageQuestionSubmit OK
     * @throws ApiError
     */
    public static getAllUserSubmissions(
        pageNum: number = 1,
        pageSize: number = 10,
        accesstoken?: string,
    ): CancelablePromise<BaseResponsePageQuestionSubmit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submit/user/all',
            headers: {
                'Accesstoken': accesstoken,
            },
            query: {
                'pageNum': pageNum,
                'pageSize': pageSize,
            },
        });
    }
}
