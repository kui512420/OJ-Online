/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseInteger } from '../models/BaseResponseInteger';
import type { BaseResponsePageTag } from '../models/BaseResponsePageTag';
import type { BaseResponseString } from '../models/BaseResponseString';
import type { Tag } from '../models/Tag';
import type { TagRequest } from '../models/TagRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TagControllerService {
    /**
     * @param requestBody
     * @returns BaseResponseString OK
     * @throws ApiError
     */
    public static tag(
        requestBody: Tag,
    ): CancelablePromise<BaseResponseString> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/tag/tag',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponsePageTag OK
     * @throws ApiError
     */
    public static list(
        requestBody: TagRequest,
    ): CancelablePromise<BaseResponsePageTag> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/tag/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns BaseResponseInteger OK
     * @throws ApiError
     */
    public static del(
        id: number,
    ): CancelablePromise<BaseResponseInteger> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/question/tag/del/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 获取热门标签
     * @param limit 可选参数，限制返回的标签数量，默认为10
     * @returns any OK
     * @throws ApiError
     */
    public static getPopularTags(
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/tag/popular',
            query: {
                'limit': limit,
            },
        });
    }
}
