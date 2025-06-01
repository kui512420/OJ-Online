/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromptMetadata } from './PromptMetadata';
import type { RateLimit } from './RateLimit';
import type { Usage } from './Usage';
export type ChatResponseMetadata = {
    id?: string;
    model?: string;
    rateLimit?: RateLimit;
    usage?: Usage;
    promptMetadata?: PromptMetadata;
    empty?: boolean;
};

