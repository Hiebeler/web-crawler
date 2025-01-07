interface GraphInput {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface GraphNode {
    id: string;
    name: string;
    val: number;
}

interface GraphLink {
    source: string;
    target: string;
}