/**
 *  loggingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 * 
 * <ul>
 * <li>Logging service currently writes to console.</li>
 * <li>Production services could write to a remote service. Include severity as part of payload.</li>
 * <li>An enhancement would be to enable various severities.</li>
 * </ul>
 *
 */
import { describe, expect, it, vitest } from 'vitest'
import { NodeService } from './NodeService';
import { DataAccessObject } from '@digitalaidseattle/core';
import {
    Node

} from '../types';
describe('NodeService tests', () => {

    const service = new NodeService({} as DataAccessObject<Node>);

    it('findNodeByNo', async () => {

        const node_1 = { id: "id_1", node_no: "test_1" } as Node;
        const node_2 = { id: "id_2", node_no: "test_2" } as Node;
        const node_3 = { id: "id_3", node_no: "test_3" } as Node;
        const node_4 = { id: "id_4", node_no: "test_4", children: [node_3] } as Node;

        expect(service.findNodeByNo([], 'test_no')).toBeUndefined();
        expect(service.findNodeByNo([node_1, node_2], 'test_2')).toBe(node_2);
        expect(service.findNodeByNo([node_1, node_2, node_4], 'test_3')).toBe(node_3);

    });

    it('findNodeById', async () => {

        const node_1 = { id: "id_1", node_no: "test_1" } as Node;
        const node_2 = { id: "id_2", node_no: "test_2" } as Node;
        const node_3 = { id: "id_3", node_no: "test_3" } as Node;
        const node_4 = { id: "id_4", node_no: "test_4", children: [node_3] } as Node;
        const node_5 = { id: "id_5", node_no: "test_5", children: [] as Node[] } as Node;

        expect(service.findNodeById([], 'test_no')).toBeUndefined();
        expect(service.findNodeById([node_1, node_2], 'id_2')).toBe(node_2);
        expect(service.findNodeById([node_1, node_2, node_4, node_5], 'id_3')).toBe(node_3);

    });

    it('getAncestors', async () => {

        const node_1 = { id: "id_1", node_no: "test_1" } as Node;
        const node_2 = { id: "id_2", node_no: "test_2" } as Node;
        const node_3 = { id: "id_3", node_no: "test_3", parent_id: "id_4" } as Node;
        const node_4 = { id: "id_4", node_no: "test_4" } as Node;
        const node_5 = { id: "id_5", node_no: "test_5" } as Node;
        const ancestors = service.getAncestors([node_1, node_2, node_3, node_4, node_5], node_3);

        expect(ancestors[0].node_no).toBe("test_4");

    });

})
