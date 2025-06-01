/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseBoolean } from '../models/BaseResponseBoolean';
import type { BaseResponseInteger } from '../models/BaseResponseInteger';
import type { BaseResponsePageQuestionListVo } from '../models/BaseResponsePageQuestionListVo';
import type { BaseResponseQuestion } from '../models/BaseResponseQuestion';
import type { BaseResponseQuestionViewVo } from '../models/BaseResponseQuestionViewVo';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { QuestionPostRequest } from '../models/QuestionPostRequest';
import type { QuestionRequest } from '../models/QuestionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionControllerService {
    /**
     * @param requestBody
     * @param accessToken
     * @returns BaseResponseInteger OK
     * @throws ApiError
     */
    public static updateQuestion(
        requestBody: QuestionPostRequest,
        accessToken?: string,
    ): CancelablePromise<BaseResponseInteger> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/question/question',
            headers: {
                'AccessToken': accessToken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseInteger OK
     * @throws ApiError
     */
    public static question(
        requestBody: QuestionPostRequest,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseInteger> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/question',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static deleteQuestions(
        requestBody: Array<number>,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/question/question',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static submit(): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponsePageQuestionListVo OK
     * @throws ApiError
     */
    public static questions(
        requestBody: QuestionRequest,
    ): CancelablePromise<BaseResponsePageQuestionListVo> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/questions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static export(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/export',
        });
    }
    /**
     * @param id
     * @returns BaseResponseQuestion OK
     * @throws ApiError
     */
    public static questionInfoDetail(
        id: number,
    ): CancelablePromise<BaseResponseQuestion> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/questionInfoDetail/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns BaseResponseQuestionViewVo OK
     * @throws ApiError
     */
    public static questionInfo(
        id: number,
    ): CancelablePromise<BaseResponseQuestionViewVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/questionInfo/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static deleteQuestion(
        id: number,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/question/question/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 获取数量最多的前4个题目标签及其数量
     * @returns any OK
     * @throws ApiError
     */
    public static getTop4PopularTags(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/popularTags',
        });
    }
}
