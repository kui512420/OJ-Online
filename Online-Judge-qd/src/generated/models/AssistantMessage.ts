/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from './Media';
import type { ToolCall } from './ToolCall';
export type AssistantMessage = {
    messageType?: AssistantMessage.messageType;
    metadata?: Record<string, Record<string, any>>;
    toolCalls?: Array<ToolCall>;
    media?: Array<Media>;
    text?: string;
};
export namespace AssistantMessage {
    export enum messageType {
        USER = 'USER',
        ASSISTANT = 'ASSISTANT',
        SYSTEM = 'SYSTEM',
        TOOL = 'TOOL',
    }
}

