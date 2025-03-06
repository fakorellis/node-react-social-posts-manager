import LikeService from '../LikeService'
import LikeRepository from '../../repositories/LikeRepository'
import { HashKey } from '../../enums'

jest.mock('../../repositories/LikeRepository')

describe('LikeService', () => {
    const userId = 'user123'
    const postId = 'post456'
  
    beforeEach(() => {
      jest.clearAllMocks() 
    })
  
    describe('toggleLikePost', () => {
      it('should like a post if not already liked', async () => {
        // Mock `findLike` to return null (post not liked)
        jest.spyOn(LikeRepository, 'findLike').mockResolvedValue(null)
  
        // Mock `addLike` to resolve successfully
        // @ts-ignore
        jest.spyOn(LikeRepository, 'addLike').mockResolvedValue({ userId, postId })
  
        await LikeService.toggleLikePost(userId, postId)
  
        expect(LikeRepository.findLike).toHaveBeenCalledWith(userId, postId)
        expect(LikeRepository.addLike).toHaveBeenCalledWith(userId, postId)
        expect(LikeRepository.removeLike).not.toHaveBeenCalled()
      })
  
      it('should unlike a post if already liked', async () => {
        // Mock `findLike` to return an existing like (post already liked)
        // @ts-ignore
        jest.spyOn(LikeRepository, 'findLike').mockResolvedValue({ userId, postId })
  
        // Mock `removeLike` to resolve successfully
        jest.spyOn(LikeRepository, 'removeLike').mockResolvedValue(undefined)
  
        await LikeService.toggleLikePost(userId, postId)
  
        expect(LikeRepository.findLike).toHaveBeenCalledWith(userId, postId)
        expect(LikeRepository.removeLike).toHaveBeenCalledWith(userId, postId)
        expect(LikeRepository.addLike).not.toHaveBeenCalled()
      })
    })
  
    describe('unlikeAllPosts', () => {
      it('should remove all liked posts for a user', async () => {
        // Mock `deleteByCriteria`
        jest.spyOn(LikeRepository, 'deleteByCriteria').mockResolvedValue(undefined)
  
        await LikeService.unlikeAllPosts(userId)
  
        expect(LikeRepository.deleteByCriteria).toHaveBeenCalledWith({ userId })
      })
    })
  
    describe('getUserLikedPosts', () => {
      it('should retrieve paginated liked posts', async () => {
        const mockResponse = {
          data: [{ _id: postId, title: 'Sample Post', body: 'Sample Body' }],
          totalItems: 1,
          totalPages: 1,
          currentPage: 1
        }
  
        jest.spyOn(LikeRepository, 'getLikedPosts').mockResolvedValue(mockResponse)
  
        const result = await LikeService.getUserLikedPosts(userId, 1, 10)
  
        expect(LikeRepository.getLikedPosts).toHaveBeenCalledWith(userId, 1, 10)
        expect(result).toEqual(mockResponse)
      })
    })
  })