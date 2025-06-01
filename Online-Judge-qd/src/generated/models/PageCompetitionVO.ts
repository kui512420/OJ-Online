/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompetitionVO } from './CompetitionVO';
import type { OrderItem } from './OrderItem';
export type PageCompetitionVO = {
    records?: Array<CompetitionVO>;
    total?: number;
    size?: number;
    current?: number;
    orders?: Array<OrderItem>;
    optimizeCountSql?: PageCompetitionVO;
    searchCount?: PageCompetitionVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
};

