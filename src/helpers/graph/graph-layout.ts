import ELK from 'elkjs/lib/elk.bundled.js';
import type { ElkNode } from 'elkjs/lib/elk-api';

import type { XYPosition } from '@vue-flow/core';
import type { LayoutResult } from './graph-layout-utils';
import type { GraphNode } from './graph-nodes';
import type { GraphEdge } from './graph-edges';
import { components, isIsolated } from './graph-layout-utils';


const elk = new ELK();
const savedPositions: Record<string, { x: number; y: number }> = {};

function buildElkGraph(rawNodes: GraphNode[], rawEdges: GraphEdge[]) {
    return {
        id: 'root',
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': 'RIGHT',
            'elk.spacing.nodeNode': '50',
            'elk.layered.layering.strategy': 'INTERACTIVE',
            'elk.layered.crossingMinimization.strategy': 'INTERACTIVE',
            'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
            'elk.randomize': 'false',
        },
        children: rawNodes.map((n) => {
            const base = { id: n.id, width: 320, height: 100 };
            if (savedPositions[n.id]) {
                const { x, y } = savedPositions[n.id];
                return { ...base, x, y, layoutOptions: { 'org.eclipse.elk.fixed': 'true' } };
            }
            return base;
        }),
        edges: rawEdges.map((e) => ({
            id: e.id!,
            sources: [e.source],
            targets: [e.target],
        })),
    } as const;
}

function updatePositions(layout: ElkNode, rawNodes: GraphNode[]): GraphNode[] {
    return layout.children!.map((elkNode: ElkNode) => {
        const original = rawNodes.find((n) => n.id === elkNode.id)!;
        const pos = { x: elkNode.x!, y: elkNode.y! };
        savedPositions[original.id] = pos;
        return { ...original, position: pos };
    });
}

function reorderComponents(nodes: GraphNode[], edges: GraphEdge[]): void {
    const comps = components(nodes, edges)
        .filter((comp) => comp.length > 1)
        .sort((a, b) => b.length - a.length);

    const compGap = 150;
    let baselineY = 0;
    for (const comp of comps) {
        const compNodes = nodes.filter((n) => comp.includes(n.id));
        const minY = Math.min(...compNodes.map((n) => n.position.y));
        const maxY = Math.max(...compNodes.map((n) => n.position.y));
        const shiftY = baselineY - minY;
        compNodes.forEach((n) => {
            n.position.y += shiftY;
            savedPositions[n.id] = { ...n.position };
        });
        baselineY = maxY + shiftY + compGap;
    }
}

function addRandomPerturbation(nodes: GraphNode[]): void {
    nodes.forEach((n) => {
        n.position.x += Math.random();
        n.position.y += Math.random();
    });
}

function distributeIsolatedNodes(nodes: GraphNode[], edges: GraphEdge[]): void {
    const isolatedIds = nodes.map((n) => n.id).filter((id) => isIsolated(id, edges));
    if (isolatedIds.length === 0) return;

    const nonIsolatedYs = nodes
        .filter((n) => !isolatedIds.includes(n.id))
        .map((n) => n.position.y);
    const firstRowY = (nonIsolatedYs.length ? Math.max(...nonIsolatedYs) : 0) + 150;
    const colGap = 360;
    const rowGap = 150;

    const isolatedNodes = nodes
        .filter((n) => isolatedIds.includes(n.id))
        .sort((a, b) => a.id.localeCompare(b.id));

    const perRow = Math.ceil(isolatedNodes.length / 2);
    isolatedNodes.forEach((node, idx) => {
        const row = Math.floor(idx / perRow);
        const col = idx % perRow;
        const newPos: XYPosition = { x: col * colGap, y: firstRowY + row * rowGap };
        node.position = newPos;
        savedPositions[node.id] = newPos;
    });
}

export async function sortLayout(
    rawNodes: GraphNode[],
    rawEdges: GraphEdge[],
): Promise<LayoutResult> {
    const elkGraph = buildElkGraph(rawNodes, rawEdges);
    const layout = await elk.layout(elkGraph);
    const laidOutNodes = updatePositions(layout, rawNodes);
    reorderComponents(laidOutNodes, rawEdges);
    addRandomPerturbation(laidOutNodes); //workaround, because straight lines do not render
    distributeIsolatedNodes(laidOutNodes, rawEdges);

    return { nodes: laidOutNodes, edges: rawEdges };
}