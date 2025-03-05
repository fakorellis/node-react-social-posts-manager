type PaginationResponse<T> = {
  data: T
  totalItems: number
  totalPages: number
  currentPage: number
}
