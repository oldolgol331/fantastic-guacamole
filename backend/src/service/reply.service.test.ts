import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { ReplyService } from './reply.service.js';
import { BoardService } from './board.service.js';
import { UserService } from './user.service.js';
import { prisma } from '../repository/prisma.client.js';
import { HttpError } from '../middleware/error.middleware.js';

/**
 * 댓글 서비스 테스트
 * - 댓글 생성, 조회, 수정, 삭제 기능 검증
 * - 페이지네이션 검증
 * - 권한 검증 테스트
 * - 에러 핸들링 검증
 */
describe('ReplyService', () => {
  const replyService = new ReplyService();
  const boardService = new BoardService();
  const userService = new UserService();

  let testUserId: number;
  let anotherUserId: number;
  let testBoardId: number;
  let testReplyId: number;

  const testUser = {
    email: `reply_${Date.now()}@example.com`,
    password: 'Test123456!',
    confirmPassword: 'Test123456!',
    nickname: `댓글테스터_${Date.now()}`,
  };

  const testBoard = {
    title: '댓글 테스트용 게시글',
    content: '이 게시글은 댓글 테스트에 사용됩니다.',
  };

  const testReply = {
    content: '테스트 댓글입니다.',
  };

  beforeAll(async () => {
    await prisma.reply.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { startsWith: 'reply_' } } });

    // 사용자 생성
    const user = await userService.signUp(testUser);
    testUserId = user.id;

    // 다른 사용자 생성 (권한 테스트용)
    const anotherUser = await userService.signUp({
      email: `another_reply_${Date.now()}@example.com`,
      password: 'Test123456!',
      confirmPassword: 'Test123456!',
      nickname: `다른댓글사용자_${Date.now()}`,
    });
    anotherUserId = anotherUser.id;

    // 게시글 생성
    const board = await boardService.createBoard(testBoard, testUserId);
    testBoardId = board.id;
  });

  afterAll(async () => {
    if (testReplyId) {
      await prisma.reply.delete({ where: { id: testReplyId } }).catch(() => {});
    }
    if (testBoardId) {
      await prisma.board.delete({ where: { id: testBoardId } }).catch(() => {});
    }
    if (testUserId) {
      await prisma.board.deleteMany({ where: { authorId: testUserId } }).catch(() => {});
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    if (anotherUserId) {
      await prisma.board.deleteMany({ where: { authorId: anotherUserId } }).catch(() => {});
      await prisma.user.delete({ where: { id: anotherUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('createReply', () => {
    it('정상적으로 댓글을 생성해야 합니다', async () => {
      const result = await replyService.createReply(
        { content: testReply.content, boardId: testBoardId },
        testUserId
      );
      expect(result.id).toBeDefined();
      testReplyId = result.id;
    });

    it('내용이 비어있으면 댓글을 생성할 수 없습니다', async () => {
      await expect(
        replyService.createReply({ content: '', boardId: testBoardId }, testUserId)
      ).rejects.toThrow('댓글 내용을 입력해주세요.');
    });

    it('내용이 공백만 있으면 댓글을 생성할 수 없습니다', async () => {
      await expect(
        replyService.createReply({ content: '   ', boardId: testBoardId }, testUserId)
      ).rejects.toThrow('댓글 내용을 입력해주세요.');
    });

    it('존재하지 않는 게시글에 댓글을 작성하면 에러가 발생해야 합니다', async () => {
      await expect(
        replyService.createReply({ content: '테스트', boardId: 999999 }, testUserId)
      ).rejects.toThrow('게시글을 찾을 수 없습니다.');
    });

    it('댓글 생성 시 작성자 정보가 포함되어야 합니다', async () => {
      const tempReply = await replyService.createReply(
        { content: '작성자확인용', boardId: testBoardId },
        testUserId
      );

      const replies = await replyService.getReplies(testBoardId, 1, 10);
      const createdReply = replies.replies.find((r) => r.id === tempReply.id);
      
      expect(createdReply).toBeDefined();
      expect(createdReply?.author.id).toBe(testUserId);
      expect(createdReply?.author.nickname).toBe(testUser.nickname);

      // 정리
      await replyService.deleteReply(tempReply.id, testUserId);
    });
  });

  describe('getReplies', () => {
    it('게시글의 댓글 목록을 반환해야 합니다', async () => {
      const result = await replyService.getReplies(testBoardId);
      expect(result.replies).toBeInstanceOf(Array);
      expect(result.pagination.page).toBe(1);
    });

    it('페이징된 댓글 목록을 반환해야 합니다', async () => {
      // 여러 댓글 생성
      const reply1 = await replyService.createReply(
        { content: '댓글 1', boardId: testBoardId },
        testUserId
      );
      const reply2 = await replyService.createReply(
        { content: '댓글 2', boardId: testBoardId },
        testUserId
      );

      const result = await replyService.getReplies(testBoardId, 1, 1);
      expect(result.replies.length).toBeLessThanOrEqual(1);
      expect(result.pagination.pageSize).toBe(1);
      expect(result.pagination.totalCount).toBeGreaterThanOrEqual(2);

      // 정리
      await replyService.deleteReply(reply1.id, testUserId);
      await replyService.deleteReply(reply2.id, testUserId);
    });

    it('댓글은 생성일 기준으로 오름차순 정렬되어야 합니다', async () => {
      const reply1 = await replyService.createReply(
        { content: '첫번째 댓글', boardId: testBoardId },
        testUserId
      );
      
      // 약간의 지연 후 두 번째 댓글 생성
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const reply2 = await replyService.createReply(
        { content: '두번째 댓글', boardId: testBoardId },
        testUserId
      );

      const result = await replyService.getReplies(testBoardId);
      const replyIds = result.replies.map((r) => r.id);
      
      // reply1 이 reply2 보다 앞에 있어야 함 (오름차순)
      expect(replyIds.indexOf(reply1.id)).toBeLessThan(replyIds.indexOf(reply2.id));

      // 정리
      await replyService.deleteReply(reply1.id, testUserId);
      await replyService.deleteReply(reply2.id, testUserId);
    });

    it('존재하지 않는 게시글의 댓글을 조회하면 에러가 발생해야 합니다', async () => {
      await expect(replyService.getReplies(999999)).rejects.toThrow(
        '게시글을 찾을 수 없습니다.'
      );
    });

    it('댓글이 없는 게시글은 빈 배열을 반환해야 합니다', async () => {
      const emptyBoard = await boardService.createBoard(
        { title: '댓글없는 게시글', content: '내용' },
        testUserId
      );

      const result = await replyService.getReplies(emptyBoard.id);
      expect(result.replies).toEqual([]);
      expect(result.pagination.totalCount).toBe(0);

      // 정리
      await boardService.deleteBoard(emptyBoard.id, testUserId);
    });
  });

  describe('updateReply', () => {
    it('댓글을 성공적으로 수정해야 합니다', async () => {
      const tempReply = await replyService.createReply(
        { content: '수정전 내용', boardId: testBoardId },
        testUserId
      );

      await replyService.updateReply(tempReply.id, { content: '수정후 내용' }, testUserId);

      const replies = await replyService.getReplies(testBoardId);
      const updatedReply = replies.replies.find((r) => r.id === tempReply.id);
      
      expect(updatedReply?.content).toBe('수정후 내용');

      // 정리
      await replyService.deleteReply(tempReply.id, testUserId);
    });

    it('권한 없는 사용자가 댓글을 수정하면 에러가 발생해야 합니다', async () => {
      const tempReply = await replyService.createReply(
        { content: '내 댓글', boardId: testBoardId },
        testUserId
      );

      await expect(
        replyService.updateReply(tempReply.id, { content: '수정' }, anotherUserId)
      ).rejects.toThrow('수정 권한이 없습니다.');

      // 정리
      await replyService.deleteReply(tempReply.id, testUserId);
    });

    it('존재하지 않는 댓글을 수정하면 에러가 발생해야 합니다', async () => {
      await expect(
        replyService.updateReply(999999, { content: '수정' }, testUserId)
      ).rejects.toThrow('댓글을 찾을 수 없습니다.');
    });

    it('내용이 공백만 있으면 댓글을 수정할 수 없습니다', async () => {
      const tempReply = await replyService.createReply(
        { content: '원본 내용', boardId: testBoardId },
        testUserId
      );

      await expect(
        replyService.updateReply(tempReply.id, { content: '   ' }, testUserId)
      ).rejects.toThrow('댓글 내용을 입력해주세요.');

      // 정리
      await replyService.deleteReply(tempReply.id, testUserId);
    });
  });

  describe('deleteReply', () => {
    it('댓글을 성공적으로 삭제해야 합니다', async () => {
      const tempReply = await replyService.createReply(
        { content: '삭제용 댓글', boardId: testBoardId },
        testUserId
      );

      await replyService.deleteReply(tempReply.id, testUserId);

      const deleted = await prisma.reply.findUnique({ where: { id: tempReply.id } });
      expect(deleted).toBeNull();
    });

    it('권한 없는 사용자가 댓글을 삭제하면 에러가 발생해야 합니다', async () => {
      const tempReply = await replyService.createReply(
        { content: '내 댓글', boardId: testBoardId },
        testUserId
      );

      await expect(
        replyService.deleteReply(tempReply.id, anotherUserId)
      ).rejects.toThrow('삭제 권한이 없습니다.');

      // 정리
      await replyService.deleteReply(tempReply.id, testUserId);
    });

    it('존재하지 않는 댓글을 삭제하면 에러가 발생해야 합니다', async () => {
      await expect(replyService.deleteReply(999999, testUserId)).rejects.toThrow(
        '댓글을 찾을 수 없습니다.'
      );
    });
  });
});
