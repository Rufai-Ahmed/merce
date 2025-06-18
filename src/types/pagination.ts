export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export type Pagination = {
  total: number;
  per_page: number;
  total_pages: number;
  current_page: number;
  paging_counter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prev_page: number | null;
  next_page: number | null;
};
