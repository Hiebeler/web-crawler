import ForceGraph from "react-force-graph-2d"

interface GraphProps {
    graphData: GraphInput
}

const Graph = (props: GraphProps) => {
    return (
        <ForceGraph graphData={props.graphData} />
    )
}

export default Graph