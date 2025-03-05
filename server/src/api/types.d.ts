declare namespace ApiResponse {
  type Response<T> = {
    status: import('../core/enums').HttpStatus
    data?: T
    contentType?: import('../core/enums').HttpContentType
    headers?: object
  }

  type PaginatedResponse<T> = {
    status: import('../core/enums').HttpStatus
    data: T
    totalItems: number
    totalPages: number
    currentPage: number
  }
}
