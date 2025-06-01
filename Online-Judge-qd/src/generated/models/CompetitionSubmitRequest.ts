/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionSubmissionInfo } from './QuestionSubmissionInfo';
export type CompetitionSubmitRequest = {
    competitionId?: string;
    questionSubmissions?: Record<string, QuestionSubmissionInfo>;
    lastSavedAt?: string;
};

