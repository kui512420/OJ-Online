/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseMapStringObject } from '../models/BaseResponseMapStringObject';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { ChatResponse } from '../models/ChatResponse';
import type { QuestionConfingRequest } from '../models/QuestionConfingRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiControllerService {
    /**
     * @param requestBody
     * @returns ChatResponse OK
     * @throws ApiError
     */
    public static chat(
        requestBody: string,
    ): CancelablePromise<Array<ChatResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/chat',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static ai(
        requestBody: QuestionConfingRequest,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/generate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns BaseResponseMapStringObject OK
     * @throws ApiError
     */
    public static getApiBalance(): CancelablePromise<BaseResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai/balance',
        });
    }
}
