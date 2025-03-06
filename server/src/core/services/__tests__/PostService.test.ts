import PostService from '../PostService'
import PostRepository from '../../repositories/PostRepository'

jest.mock('../../repositories/PostRepository')

describe('PostService.getPostsPaginated', () => {
    it('should return paginated posts', async () => {
      const mockPosts = [
        { _id: '1', title: 'Test Post 1', body: 'Body 1', userId: '123' },
        { _id: '2', title: 'Test Post 2', body: 'Body 2', userId: '123' }
      ]
  
      // Mock repository response
      jest.spyOn(PostRepository, 'getPostsPaginated').mockResolvedValue({
        data: mockPosts,
        totalItems: 2,
        totalPages: 1,
        currentPage: 1
      })
  
      const result = await PostService.getPostsPaginated(1, 10)
  
      expect(result.data).toHaveLength(2)
      expect(result.totalItems).toBe(2)
      expect(result.totalPages).toBe(1)
    })
  })