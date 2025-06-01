/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseBoolean } from '../models/BaseResponseBoolean';
import type { BaseResponseInteger } from '../models/BaseResponseInteger';
import type { BaseResponseMapObjectObject } from '../models/BaseResponseMapObjectObject';
import type { BaseResponseMapStringString } from '../models/BaseResponseMapStringString';
import type { BaseResponsePageUser } from '../models/BaseResponsePageUser';
import type { BaseResponsePageUserRank } from '../models/BaseResponsePageUserRank';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { BaseResponseUserRank } from '../models/BaseResponseUserRank';
import type { EmailRequest } from '../models/EmailRequest';
import type { UserInfoRequest } from '../models/UserInfoRequest';
import type { UserListRequest } from '../models/UserListRequest';
import type { UserLoginRequset } from '../models/UserLoginRequset';
import type { UserPasswordRequest } from '../models/UserPasswordRequest';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static setUserProfile(
        requestBody: string,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/userProfile',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static setUserPassword(
        requestBody: UserPasswordRequest,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/userPassword',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static setUerName(
        requestBody: string,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/userName',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseInteger OK
     * @throws ApiError
     */
    public static putUserRole(
        requestBody: UserInfoRequest,
    ): CancelablePromise<BaseResponseInteger> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/userInfo',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param userRole
     * @returns BaseResponseInteger OK
     * @throws ApiError
     */
    public static putUserRole1(
        id: number,
        userRole: string,
    ): CancelablePromise<BaseResponseInteger> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/user/{id}/{userRole}',
            path: {
                'id': id,
                'userRole': userRole,
            },
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseInteger OK
     * @throws ApiError
     */
    public static updateUserInfo(
        requestBody: UserInfoRequest,
    ): CancelablePromise<BaseResponseInteger> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/admin/user/info',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponsePageUser OK
     * @throws ApiError
     */
    public static getUserList(
        requestBody: UserListRequest,
    ): CancelablePromise<BaseResponsePageUser> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/userList',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseMapStringString OK
     * @throws ApiError
     */
    public static register(
        requestBody: UserRegisterRequest,
    ): CancelablePromise<BaseResponseMapStringString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseMapStringString OK
     * @throws ApiError
     */
    public static login(
        requestBody: UserLoginRequset,
    ): CancelablePromise<BaseResponseMapStringString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static sendEmail(
        requestBody: EmailRequest,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param accessToken
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static outLogin(
        accessToken: string,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/OutLogin',
            query: {
                'accessToken': accessToken,
            },
        });
    }
    /**
     * @param accesstoken
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static refreshToken(
        accesstoken: string,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/refreshToken',
            headers: {
                'Accesstoken': accesstoken,
            },
        });
    }
    /**
     * @param userId
     * @returns BaseResponseUserRank OK
     * @throws ApiError
     */
    public static getUserRankByUserId(
        userId: number,
    ): CancelablePromise<BaseResponseUserRank> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/rank/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param current
     * @param pageSize
     * @returns BaseResponsePageUserRank OK
     * @throws ApiError
     */
    public static getTopUsersBySubmitCount(
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponsePageUserRank> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/rank/submit-count',
            query: {
                'current': current,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * @param current
     * @param pageSize
     * @returns BaseResponsePageUserRank OK
     * @throws ApiError
     */
    public static getTopUsersByAcceptRate(
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponsePageUserRank> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/rank/accept-rate',
            query: {
                'current': current,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * @param current
     * @param pageSize
     * @returns BaseResponsePageUserRank OK
     * @throws ApiError
     */
    public static getTopUsersByAcceptCount(
        current: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<BaseResponsePageUserRank> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/rank/accept-count',
            query: {
                'current': current,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * @param accesstoken
     * @returns BaseResponseMapObjectObject OK
     * @throws ApiError
     */
    public static getLogin(
        accesstoken?: string,
    ): CancelablePromise<BaseResponseMapObjectObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/get/login',
            headers: {
                'Accesstoken': accesstoken,
            },
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static deleteUsers(
        requestBody: Array<number>,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static deleteUser(
        id: number,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/captcha',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha2(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/captcha',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/captcha',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha3(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/captcha',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha6(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'OPTIONS',
            url: '/api/user/captcha',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha5(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'HEAD',
            url: '/api/user/captcha',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static captcha4(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/user/captcha',
        });
    }
}
