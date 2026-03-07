import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { UserService } from './user.service.js';
import { prisma } from '../repository/prisma.client.js';
import { HttpError } from '../middleware/error.middleware.js';

/**
 * 사용자 서비스 테스트
 * - 회원가입, 로그인 기능 검증
 * - 중복 이메일/닉네임 검증
 * - 사용자 정보 조회 검증
 * - 에러 핸들링 검증
 * - 비밀번호 검증 로직 검증
 */
describe('UserService', () => {
  const userService = new UserService();
  let testUserId: number;

  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: 'Test123456!',
    confirmPassword: 'Test123456!',
    nickname: `테스터_${Date.now()}`,
  };

  beforeAll(async () => {
    await prisma.reply.deleteMany({});
    await prisma.board.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { startsWith: 'test_' } } });
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.board.deleteMany({ where: { authorId: testUserId } }).catch(() => {});
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('signUp', () => {
    it('정상적으로 회원가입이 되어야 합니다', async () => {
      const result = await userService.signUp(testUser);
      expect(result.email).toBe(testUser.email);
      expect(result.nickname).toBe(testUser.nickname);
      expect(result.id).toBeDefined();
      testUserId = result.id;
    });

    it('중복된 이메일로 회원가입 시 에러가 발생해야 합니다', async () => {
      await expect(userService.signUp(testUser)).rejects.toThrow(HttpError);
    });

    it('비밀번호와 확인 비밀번호가 다르면 에러가 발생해야 합니다', async () => {
      const invalidUser = {
        ...testUser,
        email: `test_diff2_${Date.now()}@example.com`,
        password: 'Test123456!',
        confirmPassword: 'DifferentPassword!',
        nickname: `테스터2_${Date.now()}`, // Use unique nickname
      };

      await expect(userService.signUp(invalidUser)).rejects.toThrow(
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
      );
    });

    it('이미 사용 중인 닉네임으로 회원가입 시 에러가 발생해야 합니다', async () => {
      const duplicateNicknameUser = {
        ...testUser,
        email: `test_dup2_${Date.now()}@example.com`,
        nickname: testUser.nickname, // 이미 사용 중인 닉네임
      };

      await expect(userService.signUp(duplicateNicknameUser)).rejects.toThrow(
        '이미 사용 중인 닉네임입니다.'
      );
    });
  });

  describe('login', () => {
    it('올바른 이메일과 비밀번호로 로그인해야 합니다', async () => {
      const result = await userService.login({
        email: testUser.email,
        password: testUser.password,
      });
      expect(result.accessToken).toBeDefined();
      expect(result.expiresIn).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.nickname).toBe(testUser.nickname);
    });

    it('잘못된 비밀번호로 로그인 시 에러가 발생해야 합니다', async () => {
      await expect(
        userService.login({ email: testUser.email, password: 'WrongPassword!' })
      ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다.');
    });

    it('존재하지 않는 이메일로 로그인 시 에러가 발생해야 합니다', async () => {
      await expect(
        userService.login({ email: 'nonexistent@example.com', password: 'Test123456!' })
      ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다.');
    });

    it('로그인 응답에 사용자 정보가 포함되어야 합니다', async () => {
      const result = await userService.login({
        email: testUser.email,
        password: testUser.password,
      });
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(testUserId);
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.nickname).toBe(testUser.nickname);
    });
  });

  describe('getMyInfo', () => {
    it('사용자 ID 로 내 정보를 조회해야 합니다', async () => {
      const result = await userService.getMyInfo(testUserId);
      expect(result.id).toBe(testUserId);
      expect(result.email).toBe(testUser.email);
      expect(result.nickname).toBe(testUser.nickname);
    });

    it('존재하지 않는 사용자 ID 로 조회 시 에러가 발생해야 합니다', async () => {
      await expect(userService.getMyInfo(999999)).rejects.toThrow(
        '사용자를 찾을 수 없습니다.'
      );
    });
  });

  describe('updateMyInfo', () => {
    let anotherUserId: number;

    beforeAll(async () => {
      // 다른 사용자 생성 (중복 닉네임 테스트용)
      const anotherUser = await userService.signUp({
        email: `another_${Date.now()}@example.com`,
        password: 'Test123456!',
        confirmPassword: 'Test123456!',
        nickname: `다른사용자_${Date.now()}`,
      });
      anotherUserId = anotherUser.id;
    });

    afterAll(async () => {
      if (anotherUserId) {
        await prisma.user.delete({ where: { id: anotherUserId } }).catch(() => {});
      }
    });

    it('닉네임을 성공적으로 수정해야 합니다', async () => {
      const newNickname = `수정된닉네임_${Date.now()}`;
      const result = await userService.updateMyInfo(testUserId, newNickname);
      expect(result.nickname).toBe(newNickname);
    });

    it('이미 사용 중인 닉네임으로 수정 시 에러가 발생해야 합니다', async () => {
      const anotherUser = await userService.signUp({
        email: `dupcheck_${Date.now()}@example.com`,
        password: 'Test123456!',
        confirmPassword: 'Test123456!',
        nickname: `중복체크_${Date.now()}`,
      });

      await expect(
        userService.updateMyInfo(testUserId, anotherUser.nickname)
      ).rejects.toThrow('이미 사용 중인 닉네임입니다.');
    });

    it('비밀번호를 성공적으로 수정해야 합니다', async () => {
      const newPassword = 'NewPassword123!';
      const result = await userService.updateMyInfo(
        testUserId,
        undefined,
        newPassword,
        newPassword
      );
      expect(result.id).toBe(testUserId);

      // 수정된 비밀번호로 로그인 가능한지 확인
      const loginResult = await userService.login({
        email: testUser.email,
        password: newPassword,
      });
      expect(loginResult.accessToken).toBeDefined();
    });

    it('새 비밀번호와 확인 비밀번호가 다르면 에러가 발생해야 합니다', async () => {
      await expect(
        userService.updateMyInfo(testUserId, undefined, 'NewPass123!', 'Different!')
      ).rejects.toThrow('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    });

    it('8 자 미만 새 비밀번호로 수정 시 에러가 발생해야 합니다', async () => {
      await expect(
        userService.updateMyInfo(testUserId, undefined, 'short', 'short')
      ).rejects.toThrow(/비밀번호는 8.?자 이상이어야 합니다/);
    });
  });

  describe('deleteAccount', () => {
    it('계정을 성공적으로 삭제해야 합니다', async () => {
      // 테스트용 사용자 생성
      const userToDelete = await userService.signUp({
        email: `delete_${Date.now()}@example.com`,
        password: 'Test123456!',
        confirmPassword: 'Test123456!',
        nickname: `삭제테스터_${Date.now()}`,
      });

      // 계정 삭제
      await userService.deleteAccount(userToDelete.id);

      // 삭제되었는지 확인
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id },
      });
      expect(deletedUser).toBeNull();
    });
  });
});
