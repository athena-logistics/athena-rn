import { Maybe, ValidationMessage } from '../apollo/schema';

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

export function isNodeType<TypeName extends string>(
  node: { __typename?: string } | null | undefined,
  type: TypeName
): node is { __typename: TypeName } {
  return node !== null && node !== undefined && node.__typename === type;
}

export function assertNodeType<TypeName extends string>(
  node: { __typename?: string } | null | undefined,
  type: TypeName
): asserts node is { __typename: TypeName } {
  if (!isNodeType(node, type))
    throw new Error(`Expected node of type ${type}, got ${node?.__typename}`);
}

type MutationMessage = Pick<ValidationMessage, 'code' | 'field' | 'message'>;

interface MutationResult<T> {
  messages?: Maybe<Array<Maybe<MutationMessage>>>;
  successful: boolean;
  result?: Maybe<T>;
}

export class MutationFailedMessageError extends Error {
  public mutationMessage: MutationMessage;

  constructor(mutationMessage: MutationMessage) {
    super(mutationMessage.message ?? 'Unknown error');
    this.mutationMessage = mutationMessage;
  }
}

export default function getMutationResult<T>(result: MutationResult<T>) {
  if (result.successful === false) {
    for (const mutationMessage of result.messages ?? []) {
      if (!mutationMessage) {
        continue;
      }
      throw new MutationFailedMessageError(mutationMessage);
    }
    if (!result.messages || result.messages.length === 0) {
      throw new Error('Expected message for failed mutation');
    }
  }
  if (!result.result) {
    throw new Error('Expected result for successful mutation');
  }
  return result.result;
}
