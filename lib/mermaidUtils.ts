export type NodeKind = 'start' | 'process' | 'decision' | 'io' | 'end';
export type Direction = 'TD' | 'TB' | 'LR' | 'RL' | 'BT';

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    kind: NodeKind;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export function graphToMermaid(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: Direction = 'TD'
): string {
  if (nodes.length === 0) {
    return `flowchart ${direction}\n    %% Empty flowchart`;
  }

  const lines: string[] = [`flowchart ${direction}`];
  
  // Generate node definitions
  const nodeDefinitions = new Set<string>();
  
  nodes.forEach(node => {
    const nodeId = sanitizeId(node.id);
    const label = node.data.label || getDefaultLabel(node.data.kind);
    const syntax = getNodeSyntax(label, node.data.kind);
    nodeDefinitions.add(`    ${nodeId}${syntax}`);
  });
  
  // Add all unique node definitions
  lines.push(...Array.from(nodeDefinitions));
  
  // Generate edge definitions
  if (edges.length > 0) {
    edges.forEach(edge => {
      const sourceId = sanitizeId(edge.source);
      const targetId = sanitizeId(edge.target);
      
      let edgeSyntax = ' --> ';
      if (edge.label) {
        edgeSyntax = ` -->|${edge.label}| `;
      }
      
      lines.push(`    ${sourceId}${edgeSyntax}${targetId}`);
    });
  }
  
  return lines.join('\n');
}

function sanitizeId(id: string): string {
  // Remove or replace characters that might cause issues in Mermaid
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

function getDefaultLabel(kind: NodeKind): string {
  switch (kind) {
    case 'start':
      return 'Start';
    case 'end':
      return 'End';
    case 'decision':
      return 'Decision?';
    case 'io':
      return 'Input/Output';
    case 'process':
      return 'Process';
    default:
      return 'Node';
  }
}

function getNodeSyntax(label: string, kind: NodeKind): string {
  const escapedLabel = label.replace(/[\[\]{}()]/g, '');
  
  switch (kind) {
    case 'start':
      return `([${escapedLabel}])`;
    case 'end':
      return `((${escapedLabel}))`;
    case 'decision':
      return `{${escapedLabel}}`;
    case 'io':
      return `[/${escapedLabel}/]`;
    case 'process':
    default:
      return `[${escapedLabel}]`;
  }
}

export function createDefaultNode(kind: NodeKind, position: { x: number; y: number }): FlowNode {
  return {
    id: `${kind}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'default',
    position,
    data: {
      label: getDefaultLabel(kind),
      kind,
    },
  };
}

export function getNodeBackgroundColor(kind: NodeKind): string {
  switch (kind) {
    case 'start':
      return '#22c55e'; // green
    case 'end':
      return '#ef4444'; // red
    case 'decision':
      return '#f59e0b'; // amber
    case 'io':
      return '#3b82f6'; // blue
    case 'process':
    default:
      return '#6b7280'; // gray
  }
}