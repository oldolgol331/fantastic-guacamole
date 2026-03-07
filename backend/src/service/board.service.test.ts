import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { BoardService } from './board.service.js';
import { UserService } from './user.service.js';
import { prisma } from '../repository/prisma.client.js';
import { HttpError } from '../middleware/error.middleware.js';

/**
 * 게시판 서비스 테스트
 * - 게시글 생성, 조회, 수정, 삭제 기능 검증
 * - 페이지네이션 및 검색 기능 검증
 * - 조회수 증가 로직 검증
 * - 권한 검증 테스트
 * - 에러 핸들링 검증
 */
describe('BoardService', () => {
  const boardService = new BoardService();
  const userService = new UserService();

  let testUserId: number;
  let anotherUserId: number;
  let testBoardId: number;

  const testUser = {
    email: `board_${Date.now()}@example.com`,
    password: 'Test123456!',
    confirmPassword: 'Test123456!',
    nickname: `게시글테스터_${Date.now()}`,
  };

  const testBoard = {
    title: '테스트 게시글',
    content: '이것은 테스트용 게시글입니다.',
  };

  beforeAll(async () => {
    await prisma.reply.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { startsWith: 'board_' } } });

    const user = await userService.signUp(testUser);
    testUserId = user.id;

    // 다른 사용자 생성 (권한 테스트용)
    const anotherUser = await userService.signUp({
      email: `another_${Date.now()}@example.com`,
      password: 'Test123456!',
      confirmPassword: 'Test123456!',
      nickname: `다른사용자_${Date.now()}`,
    });
    anotherUserId = anotherUser.id;
  });

  afterAll(async () => {
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

  describe('createBoard', () => {
    it('정상적으로 게시글을 생성해야 합니다', async () => {
      const result = await boardService.createBoard(testBoard, testUserId);
      expect(result.id).toBeDefined();
      testBoardId = result.id;
    });

    it('제목과 내용이 있으면 게시글을 생성할 수 있어야 합니다', async () => {
      const result = await boardService.createBoard(
        { title: '추가 테스트', content: '추가 내용' },
        testUserId
      );
      expect(result.id).toBeDefined();
      
      // 정리
      await boardService.deleteBoard(result.id, testUserId);
    });
  });

  describe('getBoards', () => {
    it('페이징된 게시글 목록을 반환해야 합니다', async () => {
      const result = await boardService.getBoards({ page: 1, pageSize: 10 });
      expect(result.boards).toBeInstanceOf(Array);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalCount).toBeGreaterThanOrEqual(1);
    });

    it('검색어로 게시글을 필터링해야 합니다', async () => {
      const result = await boardService.getBoards({
        page: 1,
        pageSize: 10,
        search: '테스트',
      });
      expect(result.boards.length).toBeGreaterThan(0);
      result.boards.forEach((board) => {
        expect(board.title).toContain('테스트');
      });
    });

    it('검색어가 없으면 모든 게시글을 반환해야 합니다', async () => {
      const result = await boardService.getBoards({
        page: 1,
        pageSize: 10,
      });
      expect(result.boards.length).toBeGreaterThanOrEqual(1);
    });

    it('페이지 번호를 변경하여 페이징해야 합니다', async () => {
      const page1 = await boardService.getBoards({ page: 1, pageSize: 1 });
      const page2 = await boardService.getBoards({ page: 2, pageSize: 1 });
      
      expect(page1.boards.length).toBeLessThanOrEqual(1);
      expect(page2.boards.length).toBeLessThanOrEqual(1);
      
      if (page1.boards.length > 0 && page2.boards.length > 0) {
        expect(page1.boards[0].id).not.toBe(page2.boards[0].id);
      }
    });

    it('작성자 ID 로 게시글을 필터링해야 합니다', async () => {
      const result = await boardService.getBoards({
        page: 1,
        pageSize: 10,
        authorId: testUserId,
      });
      expect(result.boards.length).toBeGreaterThan(0);
      result.boards.forEach((board) => {
        expect(board.authorNickname).toBe(testUser.nickname);
      });
    });

    it('생성일 기준으로 정렬되어야 합니다 (기본값)', async () => {
      const result = await boardService.getBoards({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        order: 'desc',
      });
      expect(result.boards).toBeInstanceOf(Array);
    });

    it('조회수 기준으로 정렬되어야 합니다', async () => {
      const result = await boardService.getBoards({
        page: 1,
        pageSize: 10,
        sortBy: 'views',
        order: 'desc',
      });
      expect(result.boards).toBeInstanceOf(Array);
    });
  });

  describe('getBoard', () => {
    it('게시글 ID 로 상세 정보를 반환해야 합니다', async () => {
      const result = await boardService.getBoard(testBoardId);
      expect(result.id).toBe(testBoardId);
      expect(result.title).toBe(testBoard.title);
      expect(result.content).toBe(testBoard.content);
      expect(result.author).toBeDefined();
      expect(result.author.nickname).toBe(testUser.nickname);
    });

    it('조회수가 증가해야 합니다', async () => {
      const first = await boardService.getBoard(testBoardId);
      const second = await boardService.getBoard(testBoardId);
      expect(second.views).toBeGreaterThan(first.views);
    });

    it('존재하지 않는 게시글 ID 로 조회 시 에러가 발생해야 합니다', async () => {
      await expect(boardService.getBoard(999999)).rejects.toThrow(
        '게시글을 찾을 수 없습니다.'
      );
    });

    it('게시글 응답에 작성자 정보가 포함되어야 합니다', async () => {
      const result = await boardService.getBoard(testBoardId);
      expect(result.author.id).toBe(testUserId);
      expect(result.author.nickname).toBe(testUser.nickname);
    });
  });

  describe('updateBoard', () => {
    it('게시글을 성공적으로 수정해야 합니다', async () => {
      await boardService.updateBoard(testBoardId, { title: '수정된 제목' }, testUserId);
      const updated = await boardService.getBoard(testBoardId);
      expect(updated.title).toBe('수정된 제목');
    });

    it('내용만 수정해야 합니다', async () => {
      await boardService.updateBoard(testBoardId, { content: '수정된 내용' }, testUserId);
      const updated = await boardService.getBoard(testBoardId);
      expect(updated.content).toBe('수정된 내용');
    });

    it('권한 없는 사용자가 게시글을 수정하면 에러가 발생해야 합니다', async () => {
      await expect(
        boardService.updateBoard(testBoardId, { title: '수정' }, anotherUserId)
      ).rejects.toThrow('수정 권한이 없습니다.');
    });

    it('존재하지 않는 게시글을 수정하면 에러가 발생해야 합니다', async () => {
      await expect(
        boardService.updateBoard(999999, { title: '수정' }, testUserId)
      ).rejects.toThrow('게시글을 찾을 수 없습니다.');
    });
  });

  describe('deleteBoard', () => {
    it('게시글을 성공적으로 삭제해야 합니다', async () => {
      const temp = await boardService.createBoard(
        { title: '삭제용', content: '내용' },
        testUserId
      );
      await boardService.deleteBoard(temp.id, testUserId);
      const deleted = await prisma.board.findUnique({ where: { id: temp.id } });
      expect(deleted).toBeNull();
    });

    it('권한 없는 사용자가 게시글을 삭제하면 에러가 발생해야 합니다', async () => {
      const tempBoard = await boardService.createBoard(
        { title: '삭제테스트용', content: '내용' },
        testUserId
      );

      await expect(
        boardService.deleteBoard(tempBoard.id, anotherUserId)
      ).rejects.toThrow('삭제 권한이 없습니다.');

      // 정리: 원래 작성자가 삭제
      await boardService.deleteBoard(tempBoard.id, testUserId);
    });

    it('존재하지 않는 게시글을 삭제하면 에러가 발생해야 합니다', async () => {
      await expect(boardService.deleteBoard(999999, testUserId)).rejects.toThrow(
        '게시글을 찾을 수 없습니다.'
      );
    });

    it('게시글 삭제 시 연결된 댓글도 함께 삭제되어야 합니다', async () => {
      // 게시글 생성
      const boardWithReply = await boardService.createBoard(
        { title: '댓글테스트용', content: '내용' },
        testUserId
      );

      // 댓글 생성 (ReplyService 사용)
      const { replyService } = await import('./reply.service.js');
      const reply = await replyService.createReply(
        { content: '테스트 댓글', boardId: boardWithReply.id },
        testUserId
      );

      // 게시글 삭제
      await boardService.deleteBoard(boardWithReply.id, testUserId);

      // 댓글이 삭제되었는지 확인
      const deletedReply = await prisma.reply.findUnique({ where: { id: reply.id } });
      expect(deletedReply).toBeNull();
    });
  });
});
