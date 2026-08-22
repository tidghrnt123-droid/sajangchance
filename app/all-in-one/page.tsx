"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  Check,
  ChevronRight,
  ShieldCheck,
  Store,
  MessageCircle,
} from "lucide-react";

const KAKAO_CHAT_URL = "https://pf.kakao.com/_xcxhFen/chat";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwPMLZtXEIMJ4k7VcaDhSPETBtaFaT_iGuKAgj38MzS3gbAGhbGAnjyjkCKq_LrzUcR/exec";

type MetaPixel = (
  action: "track",
  eventName: string,
  params?: Record<string, string | number | boolean>
) => void;

function trackMetaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return false;

  const fbq = (window as Window & { fbq?: MetaPixel }).fbq;

  if (typeof fbq !== "function") return false;

  fbq("track", eventName, params);
  return true;
}

export default function AllInOneLandingPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [internet, setInternet] = useState(true);
  const [cctv, setCctv] = useState(true);
  const [terminal, setTerminal] = useState(true);

  const [businessStatus, setBusinessStatus] =
    useState("신규 오픈 예정");

  const [openDate, setOpenDate] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  // 메타 광고 전환 최적화를 위한 상세페이지 조회 이벤트
  useEffect(() => {
    let timer: number | undefined;
    let tries = 0;

    const sendViewContent = () => {
      const sent = trackMetaEvent("ViewContent", {
        content_name: "올인원 랜딩페이지",
        content_category: "인터넷_CCTV_카드단말기",
      });

      if (sent) {
        console.log("Meta Pixel ViewContent sent: all-in-one");
        return;
      }

      tries += 1;

      // 픽셀 스크립트가 늦게 로드되는 경우 최대 약 5초간 재시도
      if (tries < 10) {
        timer = window.setTimeout(sendViewContent, 500);
      }
    };

    sendViewContent();

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const scrollToForm = () => {
    document
      .getElementById("consult")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("성함을 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    if (!internet && !cctv && !terminal) {
      alert("상담받을 상품을 하나 이상 선택해주세요.");
      return;
    }

    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    const selectedProducts = [
      internet ? "인터넷" : "",
      cctv ? "CCTV" : "",
      terminal ? "카드단말기" : "",
    ]
      .filter(Boolean)
      .join(", ");

    const params = new URLSearchParams();

    params.append("name", name.trim());
    params.append("phone", phone.trim());
    params.append("product", selectedProducts);

    params.append(
      "message",
      [
        `사업장 상태: ${businessStatus}`,
        `오픈 예정일: ${openDate || "미입력"}`,
        "유입경로: 올인원 랜딩페이지",
      ].join("\n")
    );

    params.append("pageUrl", window.location.href);
    params.append("ua", navigator.userAgent);

    try {
      setLoading(true);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
      });

      setComplete(true);

      // 실제 상담 신청 완료를 Meta 표준 Lead 이벤트로 전송
      const leadSent = trackMetaEvent("Lead", {
        content_name: "올인원 무료 상담 신청",
        content_category: selectedProducts,
      });

      if (leadSent) {
        console.log("Meta Pixel Lead sent: all-in-one");
      } else {
        console.warn("Meta Pixel Lead not sent: fbq is not ready");
      }

      setName("");
      setPhone("");
      setInternet(true);
      setCctv(true);
      setTerminal(true);
      setBusinessStatus("신규 오픈 예정");
      setOpenDate("");
      setAgree(false);
    } catch (error) {
      console.error(
        "Landing contact submit error:",
        error
      );

      alert(
        "상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-[76px] md:pb-0">
      <Header />
     {/* =====================================================
    HERO
====================================================== */}

<section className="relative overflow-hidden bg-[#061321] text-white">
  <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px]" />

  <div className="pointer-events-none absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[140px]" />

  <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-16">

    {/* 왼쪽 문구 */}

    <div className="text-center md:text-left">

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/50 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200 md:text-base">
        <Store size={18} />
        신규 사업장 원스톱 준비
      </div>

     <h1 className="font-black leading-[1.18] tracking-tight">
  <span className="block whitespace-nowrap text-[25px] sm:text-[32px] md:text-[48px] lg:text-[52px]">
    인터넷 · CCTV · 카드단말기
  </span>

  <span className="mt-3 block whitespace-nowrap text-[34px] text-cyan-400 sm:text-[40px] md:mt-2 md:text-[48px] lg:text-[52px]">
    올인원 원클릭 신청
  </span>
</h1>

      <p className="mt-6 text-[16px] leading-7 text-slate-300 md:text-xl md:leading-9">
        매장 오픈에 필요한 상품을
        <br className="md:hidden" />
        여기저기 알아볼 필요 없이

        <br />

        <strong className="text-white">
          상담 한 번으로 비교부터 설치까지
        </strong>
      </p>

      {/* 최대 100만원 */}

      <div className="mx-auto mt-6 max-w-[430px] rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 md:mx-0">

        <div className="text-sm font-bold text-cyan-300">
          신규 사업장 가입 혜택
        </div>

        <div className="mt-1 text-2xl font-black text-white md:text-3xl">
          최대 100만원

          <span className="ml-2 text-cyan-400">
            현금 사은품
          </span>
        </div>

      </div>

      {/* 상담 버튼 */}

      <button
        type="button"
        onClick={scrollToForm}
        className="mx-auto mt-8 flex w-full max-w-[430px] items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-5 text-lg font-black text-white shadow-[0_15px_40px_rgba(59,130,246,0.35)] transition hover:bg-blue-400 md:mx-0 md:text-xl"
      >
        30초 무료 상담 신청하기

        <ChevronRight size={24} />
      </button>

    </div>

    {/* 오른쪽 카드단말기 이미지 */}

    <div className="relative mx-auto w-full max-w-[520px]">

      {/* 제품 뒤 빛 효과 */}

      <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[90px]" />

      <div className="relative">

        <img
          src="/images/front2-hero.png"
          alt="토스 프론트2 카드단말기"
          className="mx-auto block h-auto w-full max-w-[500px] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.5)]"
        />

        {/* 제품 설명 배지 */}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#0b1d32]/90 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur">
          카드단말기까지 한 번에
        </div>

      </div>

    </div>

  </div>


</section>

      {/* =====================================================
          서비스 소개
      ====================================================== */}

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <span className="text-sm font-extrabold text-blue-600">
              ONE STOP SERVICE
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
              매장 준비할 게 많은데
              <br />
              하나씩 알아보고 계신가요?
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500 md:text-lg">
              인터넷은 인터넷 업체,
              <br className="md:hidden" />
              CCTV는 보안 업체,
              <br className="md:hidden" />
              카드단말기는 또 다른 업체.
            </p>

            <p className="mt-4 text-lg font-bold text-slate-900 md:text-xl">
              이제 사장님찬스에서 한 번에 준비하세요.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <ServiceCard
              image="/images/service-internet.png"
              title="인터넷"
              description="매장 환경에 맞는 인터넷 상품과 설치 조건을 비교해드립니다."
            />

            <ServiceCard
              image="/images/service-cctv.png"
              title="CCTV"
              description="매장 규모와 구조에 맞춰 필요한 CCTV 구성을 상담해드립니다."
            />

            <ServiceCard
              image="/images/service-terminal.png"
              title="카드단말기"
              description="유선·무선·토스 단말기까지 매장에 맞는 결제 환경을 안내합니다."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          혜택
      ====================================================== */}

      <section className="bg-blue-600 py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              사장님찬스 올인원
            </div>

            <h2 className="mt-5 text-3xl font-black md:text-5xl">
              인터넷 · CCTV · 카드단말기
              <br />
              한 번에 준비하세요.
            </h2>

            <p className="mt-5 text-blue-100 md:text-lg">
              신규 사업장이라면 더 큰 혜택으로
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
            <BenefitCard
              number="01"
              title="최대 100만원"
              text="가입 조건에 따라 현금 사은품 지원"
            />

            <BenefitCard
              number="02"
              title="맞춤 상품 비교"
              text="인터넷 · CCTV 상품을 사업장 환경에 맞춰 비교"
            />

            <BenefitCard
              number="03"
              title="카드단말기까지"
              text="결제 환경 구축까지 한 번에 상담"
            />
          </div>

          <button
            type="button"
            onClick={scrollToForm}
            className="mx-auto mt-10 flex w-full max-w-[430px] items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-5 text-lg font-black text-slate-900 shadow-xl transition hover:bg-cyan-200"
          >
            내 매장 혜택 확인하기
            <ChevronRight size={22} />
          </button>

          <p className="mt-5 text-center text-xs text-blue-200">
            ※ 실제 사은품 및 제공 조건은 지역, 상품,
            가입 조건에 따라 달라질 수 있습니다.
          </p>
        </div>
      </section>

      {/* =====================================================
          진행 순서
      ====================================================== */}

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <span className="text-sm font-black text-blue-600">
              EASY PROCESS
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">
              신청은 간단하게,
              <br className="md:hidden" />
              설치까지 편하게
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-4">
            <ProcessCard
              number="01"
              title="상담 신청"
              text="성함과 연락처를 남겨주세요."
            />

            <ProcessCard
              number="02"
              title="맞춤 상담"
              text="필요한 상품과 사업장 상황을 확인합니다."
            />

            <ProcessCard
              number="03"
              title="혜택 비교"
              text="비용과 가입 혜택을 안내해드립니다."
            />

            <ProcessCard
              number="04"
              title="설치 진행"
              text="희망 일정에 맞춰 설치를 진행합니다."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          상담 폼
      ====================================================== */}

      <section
        id="consult"
        className="relative scroll-mt-10 overflow-hidden bg-[#061321] py-20 md:py-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-4xl px-5">
          <div className="text-center text-white">
            <div className="inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              무료 상담 신청
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
              우리 매장에는
              <br className="md:hidden" />
              어떤 구성이 좋을까요?
            </h2>

            <p className="mt-4 text-slate-300">
              30초면 상담 신청 완료
            </p>
          </div>

          <div className="mt-10 rounded-[28px] bg-white p-6 shadow-2xl md:p-9">
            {complete ? (
              <div className="py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check size={34} strokeWidth={3} />
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-900">
                  상담 신청이 완료되었습니다.
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  담당자가 확인 후
                  <br />
                  빠르게 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FormLabel>성함</FormLabel>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="사장님 성함을 입력해주세요"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <FormLabel>연락처</FormLabel>

                    <input
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="010-0000-0000"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <FormLabel>필요한 상품</FormLabel>

                  <p className="mb-3 text-xs text-slate-400">
                    복수 선택 가능합니다.
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <SelectButton
                      active={internet}
                      onClick={() =>
                        setInternet(!internet)
                      }
                    >
                      인터넷
                    </SelectButton>

                    <SelectButton
                      active={cctv}
                      onClick={() =>
                        setCctv(!cctv)
                      }
                    >
                      CCTV
                    </SelectButton>

                    <SelectButton
                      active={terminal}
                      onClick={() =>
                        setTerminal(!terminal)
                      }
                    >
                      카드단말기
                    </SelectButton>
                  </div>
                </div>

                <div className="mt-6">
                  <FormLabel>사업장 상태</FormLabel>

                  <div className="grid grid-cols-2 gap-2">
                    <SelectButton
                      active={
                        businessStatus ===
                        "신규 오픈 예정"
                      }
                      onClick={() =>
                        setBusinessStatus(
                          "신규 오픈 예정"
                        )
                      }
                    >
                      신규 오픈 예정
                    </SelectButton>

                    <SelectButton
                      active={
                        businessStatus ===
                        "현재 운영 중"
                      }
                      onClick={() =>
                        setBusinessStatus(
                          "현재 운영 중"
                        )
                      }
                    >
                      현재 운영 중
                    </SelectButton>
                  </div>
                </div>

                <div className="mt-6">
                  <FormLabel>
                    오픈 예정일{" "}
                    <span className="font-normal text-slate-400">
                      (선택)
                    </span>
                  </FormLabel>

                  <input
                    type="date"
                    value={openDate}
                    onChange={(e) =>
                      setOpenDate(e.target.value)
                    }
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) =>
                      setAgree(e.target.checked)
                    }
                    className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
                  />

                  <span>
                    개인정보 수집 및 이용에 동의합니다.
                    <strong className="ml-1 text-blue-600">
                      (필수)
                    </strong>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-lg font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading
                    ? "신청 중..."
                    : "무료 상담 신청하기"}

                  {!loading && (
                    <ChevronRight size={23} />
                  )}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
                  <ShieldCheck size={15} />
                  상담 신청 후 담당자가 확인하여 연락드립니다.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          모바일 하단 고정 CTA
      ====================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:hidden">
        <div className="mx-auto flex max-w-xl gap-2">
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="카카오톡 상담"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FEE500] text-[#191919]"
          >
            <MessageCircle size={23} />
          </a>

          <button
            type="button"
            onClick={scrollToForm}
            className="flex h-14 flex-1 items-center justify-center rounded-xl bg-blue-600 text-base font-black text-white"
          >
            30초 무료 상담 신청
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* 실제 상품 사진 */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 상품 설명 */}
      <div className="p-7">
        <h3 className="text-xl font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-3 leading-7 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   BENEFIT CARD
========================================================= */

function BenefitCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/20 bg-white/10 p-7 backdrop-blur">
      <div className="text-sm font-black text-cyan-300">
        BENEFIT {number}
      </div>

      <h3 className="mt-3 text-2xl font-black">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-blue-100">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-black text-blue-600">
        STEP {number}
      </div>

      <h3 className="mt-3 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   FORM LABEL
========================================================= */

function FormLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 text-sm font-black text-slate-800">
      {children}
    </div>
  );
}

/* =========================================================
   SELECT BUTTON
========================================================= */

function SelectButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-xl border px-1 text-[13px] font-bold transition sm:px-2 sm:text-sm md:text-base ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
    <span className="flex items-center justify-center gap-1 whitespace-nowrap">
        {active && (
          <Check size={17} strokeWidth={3} />
        )}

        {children}
      </span>
    </button>
  );
}