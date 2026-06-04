import React from "react";
import { twMerge } from "tailwind-merge";
import { badgeTokens } from "../../theme/token";

/**
 * Badge 컴포넌트의 Props 인터페이스
 *
 * @interface BadgeProps
 */
interface BadgeProps {
  /** 배지 본체 내부에 출력하여 표시할 메인 텍스트, 숫자 카운터, 아이콘 등의 리액트 자식 콘텐츠 노드 */
  children: React.ReactNode;

  /**
   * 배지의 시각적 무드와 배경색 테마를 결정합니다.
   * - `"primary"`: 파란색 배경테마, 주도적인 핵심 정보 식별용
   * - `"secondary"`: 회색 배경테마, 가벼운 부가 정보나 마이너 상태 마킹용
   * - `"danger"`: 빨간색 배경테마, 주의 요망, 유효성 에러, 삭제 또는 거절 알림용
   * - `"success"`: 초록색 배경테마, 완료, 정상 작동, 승인 완료 상태 식별용
   * - `"outline"`: 순수 라인 테 border 스타일, 무채색 계열이나 밝은 영역과의 경계 조율용
   * @default "primary"
   */
  variant?: keyof typeof badgeTokens.variants;

  /**
   * 배지 내부 문구 좌측에 작은 컴팩트 상태 점(dot)을 원형으로 노출할지 여부를 결정합니다.
   * 주로 유저 접속 온/오프라인 상태, 실시간 알림 가중치, 라이브 트래킹 상태를 강조할 때 요긴합니다.
   * @default false
   */
  dot?: boolean;

  /**
   * 배지의 외부 컴포넌트 래핑 또는 배치 마진 조정을 위해 유연하게 확장 주입할 커스텀 Tailwind CSS 스타일 클래스
   */
  className?: string;

  /**
   * 스크린 리더 사용자가 배지의 단순 텍스트 기호나 특수문자 의도를 올바르게 음성 인지하도록 설명해주는 웹 접근성 전용 대체 안내 속성
   * @example ariaLabel="현재 사용자 상태: 본인 인증 완료"
   */
  ariaLabel?: string;
}

/**
 * 상태 플래그, 카테고리 분류, 태그 식별용 숏 컴팩트 레이블 텍스트를 정돈되게 노출하는 배지(Badge) 컴포넌트입니다.
 *
 * ### ✨ 주요 활용 가이드라인
 * - 데이터 리스트 아이템의 성격 규정 마킹 (예: `"New"`, `"Popular"`, `"Sale"`)
 * - 프로필 계정 등급 권한 가시화 (예: `"Verified"`, `"Premium"`)
 * - 실시간 읽지 않은 메시지 수 카운팅 레이블 (예: `"3"`, `"5+"`)
 *
 * ### ♿ 접근성 및 시맨틱 보강 설계
 * - 스크린 리더가 단순 텍스트 파싱을 넘어 해당 요소를 상태 마커로 올바르게 읽을 수 있도록 최상위 영역에 `role="status"` 시맨틱 명세가 부여되었습니다.
 * - 내부에 탑재되는 인라인 시각용 장식 요소(`dot`)는 스크린 리더의 음성 중복 출력을 방지하기 위해 `aria-hidden="true"`로 설계 격리되었습니다.
 *
 * @example
 * // 1. 온라인 라이브 트래킹을 보여주는 success 배지
 * <Badge dot variant="success">Online</Badge>
 *
 * @example
 * // 2. 아이콘이나 기호에 대한 스크린 리더 전용 접근성 대응 예시
 * <Badge variant="primary" ariaLabel="인증 회원 자격 획득">✓</Badge>
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
