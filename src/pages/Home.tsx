import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

/** 스크롤 진입 시 페이드인 */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** 히어로 배경: 수학 노트 모눈 패턴 */
function GridPaper() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <svg className="h-full w-full">
        <defs>
          <pattern
            id="home-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0H0V32"
              fill="none"
              stroke="#0a0a0a"
              strokeOpacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#home-grid)" />
      </svg>
      {/* 가장자리 페이드 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,white_85%)]" />
    </div>
  );
}

const stats = [
  { value: "12,000+", label: "누적 수강생" },
  { value: "96%", label: "수강 만족도" },
  { value: "320+", label: "개설 강좌" },
  { value: "9년", label: "평균 강의 경력" },
];

const features = [
  {
    title: "체계적 커리큘럼",
    description:
      "진단부터 실전까지, 수준별로 설계된 학습 로드맵을 따라 빈틈없이 올라갑니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-7 w-7"
      >
        <path
          d="M3 19h6v-4h6v-4h6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M3 19V5" strokeLinecap="round" />
        <circle cx="21" cy="7" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "온라인 무제한 수강",
    description:
      "수강 기간 내 언제 어디서든, 이해될 때까지 반복해서 다시 볼 수 있습니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-7 w-7"
      >
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path
          d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    title: "1:1 질문·밀착 관리",
    description:
      "막히는 문제는 질문 게시판에서 바로 해결하고, 담당 선생님이 끝까지 챙깁니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-7 w-7"
      >
        <path
          d="M21 12a8 8 0 0 1-8 8H4l1.6-3.2A8 8 0 1 1 21 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 10h6M9 13.5h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "학습 리포트",
    description:
      "진도율과 성취도를 데이터로 확인하고, 다음에 공부할 것을 명확히 압니다.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-7 w-7"
      >
        <path d="M4 20V10M10 20V4M16 20v-8M21 20H3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const reviews = [
  {
    initial: "김",
    name: "김○○",
    meta: "고2 · 수학",
    quote:
      "개념 강의를 듣고 나서야 제가 그동안 문제를 '외워서' 풀고 있었다는 걸 알았어요. 3등급에서 1등급까지 올라온 건 커리큘럼 덕분입니다.",
  },
  {
    initial: "박",
    name: "박○○",
    meta: "고3 · 수능 대비",
    quote:
      "질문 게시판 답변이 정말 빨라요. 독학하면서 막히던 부분들이 하루 안에 해결되니까 페이스가 안 무너집니다.",
  },
  {
    initial: "이",
    name: "이○○",
    meta: "학부모",
    quote:
      "학습 리포트로 아이가 어디까지 듣고 어디서 막히는지 한눈에 보여서 안심돼요. 관리받는 인강은 처음입니다.",
  },
];

export default function Home() {
  return (
    <div className="w-full bg-white text-neutral-950">
      {/* 히어로 */}
      <section className="relative flex md:min-h-[calc(100svh-3.5rem)] w-full items-center">
        <GridPaper />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-24">
          <Reveal>
            <p className="font-mono-editorial text-xs tracking-[0.35em] text-neutral-500">
              HERMES ACADEMY — ONLINE
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display mt-6 break-keep text-4xl leading-[1.15] sm:text-6xl lg:text-7xl xl:text-8xl">
              개념부터 실전까지,
              <br />
              성적으로{" "}
              <span className="inline-block bg-neutral-950 px-3 text-white">
                증명합니다
              </span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-xl break-keep text-base leading-relaxed text-neutral-600 sm:text-lg">
              헤르메스는 체계적인 커리큘럼과 1:1 밀착 관리로 학생 한 명 한 명의
              변화를 만드는 온라인 학습 플랫폼입니다.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="rounded-lg bg-neutral-950 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
              >
                강좌 둘러보기
              </Link>
              <Link
                to="/instructors"
                className="rounded-lg border border-neutral-300 bg-white px-7 py-3.5 text-base font-bold text-neutral-950 transition-colors hover:border-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
              >
                강사진 보기
              </Link>
            </div>
          </Reveal>
        </div>
        <div
          aria-hidden
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-neutral-400 sm:flex"
        >
          <span className="font-mono-editorial text-[10px] tracking-[0.3em]">
            SCROLL
          </span>
          <span className="block h-8 w-px animate-pulse bg-neutral-400 motion-reduce:animate-none" />
        </div>
      </section>

      {/* 학원 소개 + 스탯 */}
      <section className="w-full border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Reveal>
            <p className="font-mono-editorial text-xs tracking-[0.35em] text-neutral-500">
              ABOUT
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              공부의 기준을 바꿉니다
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 max-w-3xl break-keep text-base leading-relaxed text-neutral-600 sm:text-lg">
              헤르메스는 "열심히"가 아니라 "제대로"를 가르칩니다. 검증된
              강사진의 강의, 수준별 커리큘럼, 그리고 수강 이후까지 이어지는 학습
              관리로 학생이 스스로 공부하는 힘을 만듭니다. 강의실이 아니라
              결과로 이야기하는 학원, 그것이 헤르메스의 방식입니다.
            </p>
          </Reveal>
          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="border-t border-neutral-950 pt-5">
                  <p className="font-mono-editorial text-4xl font-bold sm:text-5xl">
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm text-neutral-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 왜 헤르메스인가 */}
      <section className="w-full bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Reveal>
            <p className="font-mono-editorial text-xs tracking-[0.35em] text-neutral-400">
              WHY HERMES
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              왜 헤르메스인가
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="h-full rounded-xl border border-white/10 p-8 transition-colors hover:border-white/40">
                  <div className="text-white">{f.icon}</div>
                  <h3 className="mt-6 text-xl font-bold">{f.title}</h3>
                  <p className="mt-3 break-keep text-sm leading-relaxed text-neutral-400">
                    {f.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 수강생 후기 */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Reveal>
            <p className="font-mono-editorial text-xs tracking-[0.35em] text-neutral-500">
              REVIEWS
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              먼저 경험한 사람들
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 100}>
                <figure className="flex h-full flex-col rounded-xl border border-neutral-200 p-8">
                  <blockquote className="flex-1 break-keep text-sm leading-relaxed text-neutral-700">
                    "{r.quote}"
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white"
                    >
                      {r.initial}
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{r.name}</span>
                      <span className="font-mono-editorial block text-xs text-neutral-500">
                        {r.meta}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="w-full bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-28">
          <Reveal>
            <h2 className="font-display text-3xl leading-[1.25] sm:text-4xl lg:text-5xl">
              지금, 성적이 바뀌는
              <br />
              경험을 시작하세요
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="rounded-lg bg-white px-7 py-3.5 text-base font-bold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                무료 회원가입
              </Link>
              <Link
                to="/courses"
                className="rounded-lg border border-white/30 px-7 py-3.5 text-base font-bold text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                강좌 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
