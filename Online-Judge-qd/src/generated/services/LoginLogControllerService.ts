/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponsePageLoginLog } from '../models/BaseResponsePageLoginLog';
import type { LoginLogRequest } from '../models/LoginLogRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoginLogControllerService {
    /**
     * @param requestBody
     * @returns BaseResponsePageLoginLog OK
     * @throws ApiError
     */
    public static getLoginLogList(
        requestBody: LoginLogRequest,
    ): CancelablePromise<BaseResponsePageLoginLog> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/loginLog/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
