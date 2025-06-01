/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponseBoolean } from '../models/BaseResponseBoolean';
import type { BaseResponseCompetitionVO } from '../models/BaseResponseCompetitionVO';
import type { BaseResponseListQuestionListVo } from '../models/BaseResponseListQuestionListVo';
import type { BaseResponseLong } from '../models/BaseResponseLong';
import type { BaseResponsePageCompetitionVO } from '../models/BaseResponsePageCompetitionVO';
import type { CompetitionAddRequest } from '../models/CompetitionAddRequest';
import type { CompetitionRequest } from '../models/CompetitionRequest';
import type { CompetitionSubmitRequest } from '../models/CompetitionSubmitRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompetitionControllerService {
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static submitCompetitionAnswers(
        requestBody: CompetitionSubmitRequest,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/competition/submit',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns BaseResponsePageCompetitionVO OK
     * @throws ApiError
     */
    public static listCompetitions(
        requestBody: CompetitionRequest,
    ): CancelablePromise<BaseResponsePageCompetitionVO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/competition/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param competitionId
     * @param accesstoken
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static joinCompetition(
        competitionId: number,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/competition/join/{competitionId}',
            path: {
                'competitionId': competitionId,
            },
            headers: {
                'Accesstoken': accesstoken,
            },
        });
    }
    /**
     * @param requestBody
     * @param accesstoken
     * @returns BaseResponseLong OK
     * @throws ApiError
     */
    public static addCompetition(
        requestBody: CompetitionAddRequest,
        accesstoken?: string,
    ): CancelablePromise<BaseResponseLong> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/competition/add',
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns BaseResponseListQuestionListVo OK
     * @throws ApiError
     */
    public static getCompetitionQuestions(
        id: number,
    ): CancelablePromise<BaseResponseListQuestionListVo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/competition/questions/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns BaseResponseCompetitionVO OK
     * @throws ApiError
     */
    public static getCompetitionDetail(
        id: number,
    ): CancelablePromise<BaseResponseCompetitionVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/competition/detail/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param accessToken
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static deleteCompetition(
        id: number,
        accessToken?: string,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/competition/delete/{id}',
            path: {
                'id': id,
            },
            headers: {
                'AccessToken': accessToken,
            },
        });
    }
    /**
     * 获取竞赛排行榜
     * @param competitionId
     * @returns BaseResponseArrayCompetitionLeaderboardVO OK
     * @throws ApiError
     */
    public static getCompetitionLeaderboard(
        competitionId: number,
    ): CancelablePromise<BaseResponseArrayCompetitionLeaderboardVO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/competition/leaderboard/{competitionId}',
            path: {
                'competitionId': competitionId,
            },
        });
    }
    /**
     * 交卷
     * @param competitionId
     * @param accesstoken
     * @param requestBody 
     * @returns BaseResponseBoolean OK
     * @throws ApiError
     */
    public static submitPaper(
        competitionId: number,
        accesstoken?: string,
        requestBody?: CompetitionSubmitRequest,
    ): CancelablePromise<BaseResponseBoolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/competition/submit-paper/{competitionId}',
            path: {
                'competitionId': competitionId,
            },
            headers: {
                'Accesstoken': accesstoken,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
