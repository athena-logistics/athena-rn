type Edge<Node> = { node?: Node | null | undefined };
type Connection<Node> = { edges: Edge<Node>[] };

export function getNodes<Node>(
  connection: Connection<Node> | undefined | null
): Node[] {
  if (!connection) return [];

  return connection.edges
    .filter((edge): edge is { node: Node } => edge.node !== undefined)
    .map((edge) => edge.node);
}
