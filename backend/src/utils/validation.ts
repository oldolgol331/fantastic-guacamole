/**
 * 공통 유효성 검사 및 유틸리티 함수
 */

/**
 * 문자열을 정수로 변환하고 검증합니다.
 * @param value - 변환할 문자열
 * @param fieldName - 필드명 (에러 메시지용)
 * @returns 변환된 정수
 * @throws HttpError - 유효하지 않은 경우
 */
export function parseId(value: string, fieldName: string = "ID"): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    const { HttpError } = require("../middleware/error.middleware.js");
    throw new HttpError(400, `잘못된 ${fieldName} 형식입니다.`);
  }
  return parsed;
}

/**
 * 문자열이 비어있지 않은지 검증합니다.
 * @param value - 검증할 문자열
 * @param fieldName - 필드명 (에러 메시지용)
 * @throws HttpError - 비어있는 경우
 */
export function validateNonEmptyString(
  value: string | undefined,
  fieldName: string,
): asserts value is string {
  if (!value || value.trim().length === 0) {
    const { HttpError } = require("../middleware/error.middleware.js");
    throw new HttpError(400, `${fieldName}(을)를 입력해주세요.`);
  }
}

/**
 * 문자열 길이를 검증합니다.
 * @param value - 검증할 문자열
 * @param min - 최소 길이
 * @param max - 최대 길이
 * @param fieldName - 필드명
 * @throws HttpError - 길이가 범위를 벗어난 경우
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string,
): void {
  if (value.length < min || value.length > max) {
    const { HttpError } = require("../middleware/error.middleware.js");
    throw new HttpError(
      400,
      `${fieldName}(은)는 ${min}자 이상 ${max}자 이하이어야 합니다.`,
    );
  }
}

/**
 * 이메일 형식을 검증합니다.
 * @param email - 검증할 이메일
 * @throws HttpError - 유효하지 않은 경우
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const { HttpError } = require("../middleware/error.middleware.js");
    throw new HttpError(400, "올바른 이메일 형식이 아닙니다.");
  }
}

/**
 * 비밀번호 강도를 검증합니다.
 * @param password - 검증할 비밀번호
 * @param minLength - 최소 길이 (기본값: 8)
 * @throws HttpError - 조건을 만족하지 않는 경우
 */
export function validatePassword(
  password: string,
  minLength: number = 8,
): void {
  if (password.length < minLength) {
    const { HttpError } = require("../middleware/error.middleware.js");
    throw new HttpError(
      400,
      `비밀번호는 ${minLength}자 이상이어야 합니다.`,
    );
  }
}

/**
 * 두 값이 일치하는지 검증합니다.
 * @param value1 - 첫 번째 값
 * @param value2 - 두 번째 값
 * @param fieldName - 필드명
 * @throws HttpError - 일치하지 않는 경우
 */
export function validateMatch(
  value1: string,
  value2: string,
  fieldName: string = "값",
): void {
  if (value1 !== value2) {
    const { HttpError } = require("../middleware/error.middleware.js");
    throw new HttpError(`${fieldName}이 (가) 일치하지 않습니다.`);
  }
}
