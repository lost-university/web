export const LayoutConfig = {
  elkOptions: {
    algorithm: "layered",
    direction: "RIGHT",
    nodeSpacing: "5", 
    layeringStrategy: "INTERACTIVE",
    crossingMinStrategy: "INTERACTIVE",
    nodePlacementStrategy: "NETWORK_SIMPLEX",
    randomize: "false",
    spacingNodeNodeBetweenLayers: "250",
  },
  nodeSize: {
    width: 320,
    height: 100,
  },
  nodeGap: { // for unconnected nodes
    width: 400,
    height: 120,
  },
};
