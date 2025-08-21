'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  graphToMermaid, 
  createDefaultNode, 
  getNodeBackgroundColor,
  type NodeKind, 
  type Direction,
  type FlowNode,
  type FlowEdge 
} from '@/lib/mermaidUtils';
import { downloadText, copyToClipboard } from '@/lib/file';
import { setPendingInsert } from '@/lib/storage';

const nodeTypes = ['start', 'process', 'decision', 'io', 'end'] as const;

export default function BuilderPage() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>('TD');
  const [mermaidOutput, setMermaidOutput] = useState('');

  // Update Mermaid output when nodes or edges change
  useEffect(() => {
    const flowNodes: FlowNode[] = nodes.map(node => ({
      id: node.id,
      type: node.type || 'default',
      position: node.position,
      data: node.data,
    }));

    const flowEdges: FlowEdge[] = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      ...(edge.label && typeof edge.label === 'string' ? { label: edge.label } : {}),
    }));

    const mermaid = graphToMermaid(flowNodes, flowEdges, direction);
    setMermaidOutput(mermaid);
  }, [nodes, edges, direction]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addNode = (nodeKind: NodeKind) => {
    const newNode = createDefaultNode(nodeKind, { 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 400 + 100 
    });
    
    const reactFlowNode: Node = {
      id: newNode.id,
      type: 'default',
      position: newNode.position,
      data: { 
        label: newNode.data.label,
        kind: newNode.data.kind,
      },
      style: {
        backgroundColor: getNodeBackgroundColor(nodeKind),
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    };
    
    setNodes((nds) => nds.concat(reactFlowNode));
  };

  const updateNodeLabel = (nodeId: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label } }
          : node
      )
    );
  };

  const updateNodeKind = (nodeId: string, kind: NodeKind) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { 
              ...node, 
              data: { ...node.data, kind },
              style: {
                ...node.style,
                backgroundColor: getNodeBackgroundColor(kind),
              },
            }
          : node
      )
    );
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  };

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };

  const clearFlow = () => {
    if (confirm('Are you sure you want to clear the entire flowchart?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  };

  const handleCopyMermaid = async () => {
    try {
      await copyToClipboard(mermaidOutput);
      alert('Mermaid code copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownloadMermaid = () => {
    try {
      downloadText('flowchart.mmd', mermaidOutput);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleInsertIntoDocument = () => {
    try {
      const markdownContent = `# Flowchart\n\n\`\`\`mermaid\n${mermaidOutput}\n\`\`\`\n`;
      setPendingInsert(markdownContent);
      router.push('/editor/new');
    } catch (error) {
      console.error('Error setting pending insert:', error);
      alert('Failed to prepare document insertion');
    }
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">Flow Builder</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create flowcharts with drag and drop
          </p>
        </div>

        {/* Node Palette */}
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Add Nodes</h2>
          <div className="grid grid-cols-2 gap-2">
            {nodeTypes.map((type) => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="p-2 text-xs rounded border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                style={{ backgroundColor: getNodeBackgroundColor(type), color: 'white', border: 'none' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Direction Selector */}
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Direction</h2>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as Direction)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TD">Top Down</option>
            <option value="TB">Top Bottom</option>
            <option value="LR">Left Right</option>
            <option value="RL">Right Left</option>
            <option value="BT">Bottom Top</option>
          </select>
        </div>

        {/* Node Editor */}
        {selectedNodeData && (
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Edit Node</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={selectedNodeData.data.label}
                  onChange={(e) => updateNodeLabel(selectedNode!, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={selectedNodeData.data.kind}
                  onChange={(e) => updateNodeKind(selectedNode!, e.target.value as NodeKind)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {nodeTypes.map((type) => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => deleteNode(selectedNode!)}
                className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Node
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Actions</h2>
          <div className="space-y-2">
            <button
              onClick={clearFlow}
              className="w-full px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="p-4 flex-1">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Export</h2>
          <div className="space-y-2">
            <button
              onClick={handleCopyMermaid}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Copy Mermaid
            </button>
            <button
              onClick={handleDownloadMermaid}
              className="w-full px-3 py-2 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download .mmd
            </button>
            <button
              onClick={handleInsertIntoDocument}
              className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Insert into Document
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Canvas</h2>
            <div className="text-sm text-gray-600">
              {nodes.length} nodes, {edges.length} edges
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => getNodeBackgroundColor(node.data?.kind || 'process')}
              className="bg-white"
            />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Mermaid Preview */}
        <div className="bg-white border-t p-4 max-h-48 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Mermaid Output</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
            {mermaidOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}