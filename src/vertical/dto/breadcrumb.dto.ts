export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'vertical' | 'batch' | 'module' | 'week' | 'lecture';
  url: string;
}

export interface BreadcrumbResponse {
  breadcrumbs: BreadcrumbItem[];
  current: BreadcrumbItem;
}
