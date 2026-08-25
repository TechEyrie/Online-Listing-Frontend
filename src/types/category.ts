export type CategoryAttributeType = 'text' | 'number' | 'select' | 'multiselect' | 'boolean';

export interface CategoryAttribute {
  name: string;
  type: CategoryAttributeType;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parent: string | null;
  order: number;
  isActive: boolean;
  attributes: CategoryAttribute[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  parent?: string | null;
  order?: number;
  isActive?: boolean;
  attributes?: CategoryAttribute[];
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
