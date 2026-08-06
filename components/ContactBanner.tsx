import { Phone } from "lucide-react";

const PHONE_NUMBER = "010-7908-3099";
const PHONE_LINK = "tel:01079083099";

export default function ContactBanner() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-8">
      <a
        href={PHONE_LINK}
        className="block rounded-[28px] bg-blue-600 px-6 py-8 text-white shadow-lg transition hover:bg-blue-700 md:px-10 md:py-10"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-100">
              카드단말기
            </p>

            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
              설치와 가입이 궁금하시면
              <br />
              바로 전화주세요
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <Phone className="shrink-0" size={28} />

              <span className="text-3xl font-black tracking-tight md:text-4xl">
                {PHONE_NUMBER}
              </span>
            </div>

            <div className="mt-5 inline-flex items-center rounded-full border border-white/50 bg-white/10 px-4 py-2 text-sm font-bold md:text-base">
              24시간 상담 가능
            </div>
          </div>

          <div className="hidden items-center justify-center rounded-full bg-white/10 p-8 md:flex">
            <Phone size={64} strokeWidth={1.5} />
          </div>
        </div>
      </a>
    </section>
  );
}