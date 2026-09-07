"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  ChevronRight,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Users,
  WalletCards,
  LockKeyhole,
  Workflow,
  Building,
  MoonStar,
  ContactRound,
  ShieldCheck as ShieldIcon,
  Headphones,
  ReceiptText,
  FileText,
  Send,
} from "lucide-react";

import Header from "@/components/Header";

const KAKAO_CHAT_URL =
  "https://pf.kakao.com/_xcxhFen/chat";

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

export default function CorporatePhonePage() {
  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    let tries = 0;

    const sendViewContent = () => {
      const sent = trackMetaEvent("ViewContent", {
        content_name: "법인폰 랜딩페이지",
        content_category: "법인폰_업무용휴대폰",
      });

      if (sent) return;

      tries += 1;

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
      .getElementById("corporate-consult")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!companyName.trim()) {
      alert("회사명을 입력해주세요.");
      return;
    }

    if (!managerName.trim()) {
      alert("담당자명을 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    const params = new URLSearchParams();

    params.append(
      "name",
      `${managerName.trim()} (${companyName.trim()})`
    );
    params.append("phone", phone.trim());
    params.append("product", "법인폰");
    params.append(
      "message",
      [
        `회사명: ${companyName.trim()}`,
        `필요 수량: ${quantity}대`,
        `문의 내용: ${message.trim() || "미입력"}`,
        "유입경로: 법인폰 랜딩페이지",
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

      window.dispatchEvent(
        new Event("sajangchance:contact_submit")
      );

      trackMetaEvent("Lead", {
        content_name: "법인폰 상담 신청",
        content_category: "법인폰",
        quantity: Number(quantity) || 1,
      });

      setCompanyName("");
      setManagerName("");
      setPhone("");
      setQuantity("1");
      setMessage("");
      setAgree(false);
    } catch (error) {
      console.error(
        "Corporate phone contact submit error:",
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

      {/* HERO */}
      <section
        className="relative overflow-hidden bg-[#061321] text-white"
        style={{
          background:
            "radial-gradient(ellipse 58% 88% at 58% 50%, rgba(30,102,180,0.42) 0%, rgba(18,72,135,0.28) 30%, rgba(6,32,65,0.18) 48%, rgba(6,19,33,0) 72%), #061321",
        }}
      >
        {/* all-in-one Hero처럼 중앙이 은은하게 밝아지는 넓은 광원 */}
        <div className="pointer-events-none absolute left-[58%] top-1/2 h-[620px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-blue-500/15 blur-[170px]" />
        <div className="pointer-events-none absolute left-[64%] top-[49%] h-[500px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-cyan-300/10 blur-[145px]" />
        <div className="pointer-events-none absolute bottom-[-240px] right-[-120px] h-[520px] w-[520px] rounded-full bg-blue-400/10 blur-[150px]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
          <div className="text-center md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/50 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200">
              <Building2 size={18} />
              법인 · 사업자 업무용 휴대폰
            </div>

            <h1 className="font-black leading-[1.15] tracking-tight">
              <span className="block text-[34px] sm:text-[42px] md:text-[50px] lg:text-[56px]">
                직원 업무용 법인폰
              </span>

<span className="mt-3 block text-[32px] font-black leading-tight text-cyan-400 sm:text-[40px] md:text-[46px] lg:text-[50px]">
  월 2만원대 요금제부터,
  <br />
  단말기 0원 혜택까지
</span>
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-300 md:text-xl">
              1대부터 다회선까지
              <br />
              <strong className="text-white">
                회사 상황에 맞춰 한 번에 비교해드립니다.
              </strong>
            </p>

            <div className="mx-auto mt-7 grid max-w-[520px] grid-cols-2 gap-3 md:mx-0">
              <FeaturePill>월 2만원대 요금제부터</FeaturePill>
              <FeaturePill>통신사·모델별 단말기 0원 가능</FeaturePill>
              <FeaturePill>1대부터 다회선 개통 상담</FeaturePill>
              <FeaturePill>법인 명의 통신비 한 번에 관리</FeaturePill>
              <FeaturePill>개통 서류부터 출고까지 원스톱</FeaturePill>
              <FeaturePill>직원별 사용량 맞춤 요금제 상담</FeaturePill>
            </div>

            <p className="mx-auto mt-3 max-w-[520px] text-xs leading-5 text-slate-400 md:mx-0">
              ※ 요금 및 단말기 혜택은 통신사·모델·요금제·가입 조건에 따라 달라질 수 있습니다.
            </p>

            <button
              type="button"
              onClick={scrollToForm}
              className="mx-auto mt-7 flex w-full max-w-[520px] items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-5 text-lg font-black text-white shadow-[0_15px_40px_rgba(59,130,246,0.35)] transition hover:bg-blue-400 md:mx-0 md:text-xl"
            >
              우리 회사 법인폰 견적 받기
              <ChevronRight size={24} />
            </button>
          </div>

          {/* 오른쪽 갤럭시 A175 이미지 */}
          <div className="relative flex w-full items-center justify-center self-center lg:justify-end">
            {/* 제품 바로 뒤의 보조 광원 */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-300/16 blur-[115px]" />
            <div className="pointer-events-none absolute left-[54%] top-[50%] h-[310px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-blue-400/18 blur-[90px]" />

            <img
              src="/images/corporate-phone-a175.png"
              alt="갤럭시 A175 업무용 법인폰"
              className="relative z-10 mx-auto block h-auto w-full max-w-[560px] object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.38)] lg:mx-0"
            />
          </div>
          
        </div>
      </section>

      {/* WHY 법인폰 */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-sm font-black text-blue-600">
              WHY CORPORATE PHONE
            </span>

            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
              업무 효율은 올리고,
              <br />
              임직원 사생활 노출은 줄입니다.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-500 md:text-lg">
              개인 명의 휴대폰으로 업무 연락을 주고받으면 번호와 업무 이력이 개인에게 남을 수 있습니다.
              <br className="hidden md:block" />
              법인 명의 회선을 활용하면 업무와 개인 연락을 분리하고 회선 비용도 회사 단위로 관리하기 쉬워집니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <WhyCard
              icon={<WalletCards size={28} />}
              eyebrow="비용"
              title="통신비를 회사 단위로 관리"
              text="여러 업무용 회선을 회사 기준으로 관리해 비용 정리와 예산 관리가 한결 단순해집니다."
            />

            <WhyCard
              icon={<LockKeyhole size={28} />}
              eyebrow="보안"
              title="임직원 개인번호 노출 감소"
              text="업무용 번호를 분리하면 거래처나 고객에게 개인 번호가 노출되는 일을 줄일 수 있습니다."
            />

            <WhyCard
              icon={<Workflow size={28} />}
              eyebrow="운영"
              title="회선 관리 창구 일원화"
              text="신규 입사, 회선 추가, 기기 교체 등 업무용 회선 관련 문의를 한 곳에서 관리하기 편해집니다."
            />

            <WhyCard
              icon={<Building size={28} />}
              eyebrow="규모"
              title="1회선부터 다회선까지"
              text="단 1대의 업무폰부터 여러 직원이 사용하는 다회선 구성까지 필요한 수량에 맞춰 상담합니다."
            />
          </div>
        </div>
      </section>

      {/* 사장님찬스 장점 */}
      <section className="bg-[#061321] py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <span className="text-sm font-black text-cyan-300">
              SAJANGCHANCE
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              법인폰 상담,
              <br />
              필요한 내용만 빠르게 확인하세요.
            </h2>

            <p className="mt-5 text-slate-300 md:text-lg">
              회사 상황과 필요한 회선 수를 확인해 개통 준비사항과 진행 방법을 안내해드립니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <DarkBenefitCard
              icon={<Headphones size={28} />}
              title="전담 상담"
              text="회선 추가, 단말 변경, 개통 관련 문의를 담당자와 상담할 수 있습니다."
            />

            <DarkBenefitCard
              icon={<FileCheck2 size={28} />}
              title="서류 안내"
              text="법인 개통 시 준비해야 할 기본 서류와 추가 확인사항을 사전에 안내해드립니다."
            />

            <DarkBenefitCard
              icon={<ReceiptText size={28} />}
              title="개통 후 지원"
              text="추가 개통, 유심 인식, 번호·요금제 관련 문의 등 개통 이후 상담도 이어서 도와드립니다."
            />
          </div>
        </div>
      </section>

      {/* 프로세스 */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-sm font-black text-blue-600">
              PROCESS
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">
              법인 개통 프로세스
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500 md:text-lg">
              문의 접수부터 개통 후 지원까지 순서대로 안내해드립니다.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4">
            <LongProcessCard
              number="01"
              title="법인 문의 접수"
              text="상담 신청 내용을 확인하고 필요한 가입 절차와 기본 준비사항을 안내합니다."
            />

            <LongProcessCard
              number="02"
              title="법인 상담 진행"
              text="필요한 회선 수, 사용 목적, 희망 일정 등 실제 개통에 필요한 내용을 확인합니다."
            />

            <LongProcessCard
              number="03"
              title="다회선 개통 가능 여부 확인"
              text="다회선 개통은 통신사 및 심사 기준에 따라 가능 수량과 추가 확인사항이 달라질 수 있습니다."
            />

            <LongProcessCard
              number="04"
              title="추가 서류 안내"
              text="회선 수나 법인 상태에 따라 추가 서류 또는 별도 확인이 필요한 경우 준비사항을 안내합니다."
            />

            <LongProcessCard
              number="05"
              title="통신사별 조건 확인"
              text="희망 통신사와 개통 조건을 기준으로 가능한 진행 방식과 필요한 절차를 확인합니다."
            />

            <LongProcessCard
              number="06"
              title="개통 진행"
              text="필요한 서류와 확인 절차가 완료되면 법인 명의 개통과 단말 또는 유심 출고를 진행합니다."
            />

            <LongProcessCard
              number="07"
              title="세금계산서·비용 관련 안내"
              text="발행이나 비용 처리 관련 요청사항이 있다면 상담 과정에서 필요한 정보를 확인해 안내합니다."
            />

            <LongProcessCard
              number="08"
              title="개통 후 지원"
              text="추가 개통, 유심 인식, 번호·요금제 관련 문의 등 개통 이후 필요한 상담도 이어서 지원합니다."
            />
          </div>
        </div>
      </section>

      {/* 상담폼 */}
      <section
        id="corporate-consult"
        className="relative scroll-mt-24 overflow-hidden bg-[#061321] py-20 md:py-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-4xl px-5">
          <div className="text-center text-white">
            <div className="inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              법인폰 무료 상담
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
              몇 대가 필요하신가요?
            </h2>

            <p className="mt-4 text-slate-300">
              기본 정보만 남겨주시면 담당자가 확인 후 연락드립니다.
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
                  연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FormLabel>회사명</FormLabel>

                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) =>
                        setCompanyName(e.target.value)
                      }
                      placeholder="회사명을 입력해주세요"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <FormLabel>담당자명</FormLabel>

                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) =>
                        setManagerName(e.target.value)
                      }
                      placeholder="담당자 성함"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white"
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
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <FormLabel>필요 수량</FormLabel>

                    <select
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                      className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white"
                    >
                      <option value="1">1대</option>
                      <option value="2">2대</option>
                      <option value="3">3대</option>
                      <option value="5">4~5대</option>
                      <option value="10">6~10대</option>
                      <option value="20">11~20대</option>
                      <option value="30">20대 이상</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <FormLabel>
                    문의 내용{" "}
                    <span className="font-normal text-slate-400">
                      (선택)
                    </span>
                  </FormLabel>

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    rows={5}
                    placeholder="필요한 회선 수, 사용 목적, 문의사항을 입력해주세요."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
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
                    : "법인폰 상담 신청하기"}

                  {!loading && <Send size={20} />}
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

      {/* 모바일 하단 CTA */}
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
            법인폰 무료 상담
          </button>
        </div>
      </div>
    </main>
  );
}

function FeaturePill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[52px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-bold text-white">
      <Check
        className="mr-2 text-cyan-400"
        size={17}
        strokeWidth={3}
      />
      {children}
    </div>
  );
}

function InfoRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Check size={14} strokeWidth={3} />
      </span>

      <span className="font-semibold text-slate-700">
        {children}
      </span>
    </div>
  );
}

function WhyCard({
  icon,
  eyebrow,
  title,
  text,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-5 text-sm font-black text-blue-600">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function ProblemCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {text}
      </p>
    </div>
  );
}

function DarkBenefitCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/15 bg-white/5 p-7 backdrop-blur">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-300">
        {text}
      </p>
    </div>
  );
}

function LongProcessCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-4 rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[90px_1fr] md:items-start">
      <div className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-black text-blue-600">
        STEP {number}
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-2 leading-7 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

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
