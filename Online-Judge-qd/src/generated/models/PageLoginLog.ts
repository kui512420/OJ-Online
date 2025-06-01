/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginLog } from './LoginLog';
import type { OrderItem } from './OrderItem';
export type PageLoginLog = {
    records?: Array<LoginLog>;
    total?: number;
    size?: number;
    current?: number;
    orders?: Array<OrderItem>;
    optimizeCountSql?: PageLoginLog;
    searchCount?: PageLoginLog;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
};

