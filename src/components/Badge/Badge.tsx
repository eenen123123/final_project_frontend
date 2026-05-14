import React from "react";
import { twMerge } from "tailwind-merge";
import { badgeTokens } from "../../theme/token";

/**
 * Badge 컴포넌트의 Props 인터페이스
 *
 * @interface BadgeProps
 */
interface BadgeProps {
  /** 배지 내부에 표시할 텍스트, 숫자, 아이콘 등의 콘텐츠 */
  children: React.ReactNode;

  /**
   * 배지의 색상 테마 (기본값: "primary")
   * - "primary": 파란색 배경, 주요 정보 표시
   * - "secondary": 회색 배경, 보조 정보 표시
   * - "danger": 빨간색 배경, 경고/에러 상태 표시
   * - "success": 초록색 배경, 성공/승인 상태 표시
   * - "outline": 테두리 스타일, 밝은 배경에서 사용
   */
  variant?: keyof typeof badgeTokens.variants;

  /**
   * 상태를 나타내는 작은 점(dot)을 배지 앞에 표시할지 여부 (기본값: false)
   * true인 경우 배지 왼쪽에 variant에 맞는 색상의 작은 원형 점이 표시됩니다.
   * 주로 온라인/오프라인, 활성/비활성 등의 상태를 표시할 때 사용합니다.
   */
  dot?: boolean;

  /**
   * 배지에 추가로 적용할 Tailwind CSS 클래스
   * twMerge를 사용하여 기존 클래스와 충돌하지 않도록 병합됩니다.
   */
  className?: string;

  /**
   * 배지의 의미를 설명하는 접근성 텍스트 (기본값: undefined)
   * 스크린 리더 사용자가 배지의 의도를 이해할 수 있도록 설정합니다.
   * 예: ariaLabel="Online status"
   */
  ariaLabel?: string;
}

/**
 * Badge 컴포넌트
 *
 * @description
 * 상태, 카테고리, 태그 등을 짧은 텍스트로 표시하는 작은 레이블 컴포넌트입니다.
 * 주로 다음과 같은 상황에서 사용됩니다:
 * - 리스트 아이템의 상태 표시 (예: "New", "Popular", "Sale")
 * - 사용자 프로필의 뱃지 (예: "Verified", "Premium")
 * - 알림이나 카운트 표시 (예: "3", "5+")
 * - 카테고리 또는 태그 (예: "React", "TypeScript")
 * - 온라인/오프라인 상태 (dot 속성과 함께 사용)
 *
 * @example
 * // 기본 배지
 * <Badge>New</Badge>
 *
 * @example
 * // 다양한 색상 테마
 * <Badge variant="success">Approved</Badge>
 * <Badge variant="danger">Rejected</Badge>
 *
 * @example
 * // 상태 점 표시
 * <Badge dot variant="success">Online</Badge>
 *
 * @example
 * // 접근성 설정
 * <Badge ariaLabel="User status: verified">✓</Badge>
 */
const Badge = ({
  children,
  variant = "primary",
  className,
  dot = false,
  ariaLabel,
}: BadgeProps) => {
  return (
    <span
      className={twMerge(
        // 모든 배지에 공통으로 적용되는 기본 스타일
        badgeTokens.base,
        // variant에 따른 색상 및 배경 스타일
        badgeTokens.variants[variant],
        // 외부에서 전달받은 추가 클래스 (twMerge로 충돌 방지)
        className,
      )}
      // 접근성: 배지의 의미를 스크린 리더에 전달
      aria-label={ariaLabel}
      // 시맨틱: 배지는 상태를 나타내는 요소이므로 mark 또는 span 사용
      role="status"
    >
      {/* dot 속성이 true일 경우 배지 앞에 작은 원형 점을 표시합니다. */}
      {dot && (
        <span
          className={twMerge(
            // 모든 dot에 공통으로 적용되는 스타일
            // h-1.5 w-1.5: 크기 설정 (6px x 6px)
            // rounded-full: 완전한 원형 모양
            // mr-1.5: 배지 텍스트와의 여백 설정
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            // variant에 맞는 dot 색상 적용
            // token에서 관리하므로 컴포넌트 내부의 하드코딩된 색상 제거
            badgeTokens.dotColors[variant],
          )}
          // 접근성: dot이 시각적 요소이므로 aria-hidden으로 스크린 리더에서 숨김
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
