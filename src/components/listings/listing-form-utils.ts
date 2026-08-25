import type { CategoryTreeNode } from '@/types/category';

export const findNode = (
  nodes: CategoryTreeNode[],
  id: string,
): CategoryTreeNode | null => {
  for (const node of nodes) {
    if (node._id === id) return node;
    const child = findNode(node.children, id);
    if (child) return child;
  }
  return null;
};

export const findRootFor = (
  nodes: CategoryTreeNode[],
  id: string,
): CategoryTreeNode | null => {
  for (const root of nodes) {
    if (root._id === id) return root;
    if (findNode(root.children, id)) return root;
  }
  return null;
};
