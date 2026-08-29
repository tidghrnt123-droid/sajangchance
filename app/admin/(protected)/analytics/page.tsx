import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type VisitRow = {
  id: number;
  session_id: string;
  path: string;
  page_title: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  device_type: string | null;
  created_at: string;
};

type ConversionRow = {
  id: number;
  session_id: string;
  event_type: "phone_click" | "kakao_click" | "contact_submit";
  path: string | null;
  page_title: string | null;
  product_code: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  device_type: string | null;
  created_at: string;
};

type AnalyticsPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

type PeriodType =
  | "today"
  | "yesterday"
  | "7d"
  | "30d";

function getKoreaDateString(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getSourceName(visit: VisitRow) {
  const utmSource =
    visit.utm_source?.toLowerCase();

  if (utmSource) {
    if (
      utmSource.includes("meta")
    ) {
      return "Meta";
    }

    if (
      utmSource === "ig" ||
      utmSource.includes("instagram")
    ) {
      return "Instagram";
    }

    if (
      utmSource === "th" ||
      utmSource.includes("threads")
    ) {
      return "Threads";
    }

    if (
      utmSource.includes("facebook")
    ) {
      return "Facebook";
    }

    if (
      utmSource.includes("naver")
    ) {
      return "네이버";
    }

    if (
      utmSource.includes("daangn")
    ) {
      return "당근";
    }

    if (
      utmSource.includes("google")
    ) {
      return "Google";
    }

    return (
      visit.utm_source ?? "기타"
    );
  }

  const referrer =
    visit.referrer?.toLowerCase() ??
    "";

  if (!referrer) {
    return "직접 방문";
  }

  if (
    referrer.includes(
      "instagram.com"
    )
  ) {
    return "Instagram";
  }

  if (
    referrer.includes(
      "threads.net"
    )
  ) {
    return "Threads";
  }

  if (
    referrer.includes(
      "facebook.com"
    )
  ) {
    return "Facebook";
  }

  if (
    referrer.includes("naver.com")
  ) {
    return "네이버";
  }

  if (
    referrer.includes("google.")
  ) {
    return "Google";
  }

  if (
    referrer.includes(
      "daangn.com"
    )
  ) {
    return "당근";
  }

  if (
    referrer.includes(
      "sajangchance.com"
    )
  ) {
    return "내부 이동";
  }

  return "기타";
}

function getPageName(path: string) {
  const pageNames: Record<
    string,
    string
  > = {
    "/": "메인",

    "/card-terminal":
      "카드단말기 목록",

    "/front2":
      "토스 프론트2",

    "/front2-printer":
      "프론트2 + 프린터",

    "/front2-terminal2":
      "프론트2 + 터미널2",

    "/wireless":
      "무선 카드단말기",

    "/phone":
      "휴대폰 목록",

    "/phone/a175":
      "갤럭시 A175",

    "/phone/a175-study":
      "갤럭시 A175 공부폰",

    "/phone/m140":
      "AT-M140 폴더폰",

    "/phone/aroot-a1":
      "에이루트 A1",

    "/all-in-one":
      "올인원 랜딩",
  };

  return (
    pageNames[path] ?? path
  );
}

function getDeviceName(
  device: string
) {
  if (device === "mobile") {
    return "Mobile";
  }

  if (device === "desktop") {
    return "Desktop";
  }

  if (device === "tablet") {
    return "Tablet";
  }

  return "Unknown";
}

function getCampaignName(
  name: string
) {
  const campaignNames: Record<
    string,
    string
  > = {
    a175_study:
      "공부폰 A175 · 구매",

    a175_traffic:
      "공부폰 A175 · 트래픽",

    toss_terminal:
      "토스 단말기 · 구매",

    toss_traffic:
      "토스 단말기 · 트래픽",

    a175_purchase:
      "공부폰 A175 · 구매",

    toss_purchase:
      "토스 단말기 · 구매",
  };

  return (
    campaignNames[name] ?? name
  );
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params =
    await searchParams;

  const requestedPeriod =
    params.period;

  const period: PeriodType =
    requestedPeriod === "today" ||
    requestedPeriod ===
      "yesterday" ||
    requestedPeriod === "30d"
      ? requestedPeriod
      : "7d";

  /*
   * ================================
   * 날짜 계산
   * ================================
   */

  const now = new Date();

  const today =
    getKoreaDateString(now);

  const yesterdayDate =
    new Date(
      now.getTime() -
        24 *
          60 *
          60 *
          1000
    );

  const sevenDaysAgoDate =
    new Date(
      now.getTime() -
        6 *
          24 *
          60 *
          60 *
          1000
    );

  const thirtyDaysAgoDate =
    new Date(
      now.getTime() -
        29 *
          24 *
          60 *
          60 *
          1000
    );

  const yesterday =
    getKoreaDateString(
      yesterdayDate
    );

  const sevenDaysAgo =
    getKoreaDateString(
      sevenDaysAgoDate
    );

  const thirtyDaysAgo =
    getKoreaDateString(
      thirtyDaysAgoDate
    );

  /*
   * ================================
   * Supabase
   * 최근 30일 데이터 조회
   * ================================
   */

  const {
    data,
    error,
  } = await supabaseServer
    .from("site_visits")
    .select(
      `
        id,
        session_id,
        path,
        page_title,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        device_type,
        created_at
      `
    )
    .gte(
      "created_at",
      `${thirtyDaysAgo}T00:00:00+09:00`
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Analytics load error:",
      error
    );
  }

  const visits =
    (data ?? []) as VisitRow[];

  const {
    data: conversionData,
    error: conversionError,
  } = await supabaseServer
    .from("conversion_events")
    .select("*")
    .gte("created_at", `${thirtyDaysAgo}T00:00:00+09:00`)
    .order("created_at", { ascending: false });

  const conversions =
    (conversionData ?? []) as ConversionRow[];

  const getVisitDate = (
    visit: VisitRow
  ) =>
    getKoreaDateString(
      new Date(
        visit.created_at
      )
    );

  /*
   * ================================
   * 기간별 방문 데이터
   * ================================
   */

  const todayVisits =
    visits.filter(
      (visit) =>
        getVisitDate(visit) ===
        today
    );

  const yesterdayVisits =
    visits.filter(
      (visit) =>
        getVisitDate(visit) ===
        yesterday
    );

  const sevenDayVisits =
    visits.filter(
      (visit) =>
        getVisitDate(visit) >=
        sevenDaysAgo
    );

  const thirtyDayVisits =
    visits;

  function uniqueVisitors(
    rows: VisitRow[]
  ) {
    return new Set(
      rows.map(
        (visit) =>
          visit.session_id
      )
    ).size;
  }

  const todayVisitors =
    uniqueVisitors(
      todayVisits
    );

  const yesterdayVisitors =
    uniqueVisitors(
      yesterdayVisits
    );

  const sevenDayVisitors =
    uniqueVisitors(
      sevenDayVisits
    );

  const thirtyDayVisitors =
    uniqueVisitors(
      thirtyDayVisits
    );

  /*
   * ================================
   * 선택한 기간
   * ================================
   */

  let selectedVisits:
    VisitRow[] =
    sevenDayVisits;

  let selectedPeriodLabel =
    "최근 7일";

  if (period === "today") {
    selectedVisits =
      todayVisits;

    selectedPeriodLabel =
      "오늘";
  }

  if (
    period === "yesterday"
  ) {
    selectedVisits =
      yesterdayVisits;

    selectedPeriodLabel =
      "어제";
  }

  if (period === "30d") {
    selectedVisits =
      thirtyDayVisits;

    selectedPeriodLabel =
      "최근 30일";
  }

  const selectedVisitors =
    uniqueVisitors(
      selectedVisits
    );

  /*
   * ================================
   * 인기 페이지
   * ================================
   */

  const pageMap =
    new Map<
      string,
      number
    >();

  for (
    const visit of
    selectedVisits
  ) {
    pageMap.set(
      visit.path,
      (
        pageMap.get(
          visit.path
        ) ?? 0
      ) + 1
    );
  }

  const popularPages =
    Array.from(
      pageMap.entries()
    )
      .map(
        ([path, count]) => ({
          path,

          name:
            getPageName(
              path
            ),

          count,
        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )
      .slice(0, 10);

  /*
   * ================================
   * 유입 경로
   * ================================
   */

  const sourceMap =
    new Map<
      string,
      number
    >();

  for (
    const visit of
    selectedVisits
  ) {
    const source =
      getSourceName(
        visit
      );

    sourceMap.set(
      source,
      (
        sourceMap.get(
          source
        ) ?? 0
      ) + 1
    );
  }

  const sources =
    Array.from(
      sourceMap.entries()
    )
      .map(
        ([name, count]) => ({
          name,
          count,
        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      );

  /*
   * ================================
   * 접속 기기
   * ================================
   */

  const deviceMap =
    new Map<
      string,
      number
    >();

  for (
    const visit of
    selectedVisits
  ) {
    const device =
      visit.device_type ||
      "unknown";

    deviceMap.set(
      device,
      (
        deviceMap.get(
          device
        ) ?? 0
      ) + 1
    );
  }

  const devices =
    Array.from(
      deviceMap.entries()
    )
      .map(
        ([name, count]) => ({
          name,
          count,
        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      );

  /*
   * ================================
   * UTM 캠페인
   * ================================
   */

  const campaignMap =
    new Map<
      string,
      number
    >();

  for (
    const visit of
    selectedVisits
  ) {
    if (
      !visit.utm_campaign
    ) {
      continue;
    }

    campaignMap.set(
      visit.utm_campaign,
      (
        campaignMap.get(
          visit.utm_campaign
        ) ?? 0
      ) + 1
    );
  }

  const campaigns =
    Array.from(
      campaignMap.entries()
    )
      .map(
        ([name, count]) => ({
          name,
          displayName:
            getCampaignName(
              name
            ),
          count,
        })
      )
      .sort(
        (a, b) =>
          b.count -
          a.count
      )
      .slice(0, 20);

  const getConversionDate = (row: ConversionRow) =>
    getKoreaDateString(new Date(row.created_at));

  let selectedConversions = conversions.filter(
    (row) => getConversionDate(row) >= sevenDaysAgo
  );

  if (period === "today") {
    selectedConversions = conversions.filter(
      (row) => getConversionDate(row) === today
    );
  }

  if (period === "yesterday") {
    selectedConversions = conversions.filter(
      (row) => getConversionDate(row) === yesterday
    );
  }

  if (period === "30d") {
    selectedConversions = conversions;
  }

  const phoneClicks = selectedConversions.filter(
    (row) => row.event_type === "phone_click"
  ).length;

  const kakaoClicks = selectedConversions.filter(
    (row) => row.event_type === "kakao_click"
  ).length;

  const contactSubmits = selectedConversions.filter(
    (row) => row.event_type === "contact_submit"
  ).length;

  const totalConversions = selectedConversions.length;

  const conversionRate =
    selectedVisitors > 0
      ? ((totalConversions / selectedVisitors) * 100).toFixed(1)
      : "0.0";

  type CampaignStat = {
    source: string;
    campaign: string;
    visitors: Set<string>;
    phone: number;
    kakao: number;
    form: number;
    total: number;
  };

  const campaignStats = new Map<string, CampaignStat>();

  function statKey(source: string, campaign: string) {
    return `${source}::${campaign}`;
  }

  for (const visit of selectedVisits) {
    const source = visit.utm_source || getSourceName(visit);
    const campaign = visit.utm_campaign || "-";
    const key = statKey(source, campaign);
    const row = campaignStats.get(key) || {
      source,
      campaign,
      visitors: new Set<string>(),
      phone: 0,
      kakao: 0,
      form: 0,
      total: 0,
    };

    row.visitors.add(visit.session_id);
    campaignStats.set(key, row);
  }

  for (const event of selectedConversions) {
    const source = event.utm_source || "직접/기타";
    const campaign = event.utm_campaign || "-";
    const key = statKey(source, campaign);
    const row = campaignStats.get(key) || {
      source,
      campaign,
      visitors: new Set<string>(),
      phone: 0,
      kakao: 0,
      form: 0,
      total: 0,
    };

    row.visitors.add(event.session_id);

    if (event.event_type === "phone_click") row.phone += 1;
    if (event.event_type === "kakao_click") row.kakao += 1;
    if (event.event_type === "contact_submit") row.form += 1;

    row.total += 1;
    campaignStats.set(key, row);
  }

  const campaignConversions = Array.from(campaignStats.values())
    .filter((row) => row.total > 0 || row.campaign !== "-")
    .map((row) => ({
      source: row.source,
      campaign: row.campaign,
      campaignName:
        row.campaign === "-" ? "-" : getCampaignName(row.campaign),
      visitors: row.visitors.size,
      phone: row.phone,
      kakao: row.kakao,
      form: row.form,
      total: row.total,
      rate:
        row.visitors.size > 0
          ? ((row.total / row.visitors.size) * 100).toFixed(1)
          : "0.0",
    }))
    .sort((a, b) => b.total - a.total || b.visitors - a.visitors);

  /*
   * ================================
   * 페이지
   * ================================
   */

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1500px]">

        {/* =========================
            상단
        ========================= */}
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              방문자 통계
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              자사몰 방문자와
              페이지 조회,
              유입경로 및 광고
              캠페인 유입을
              확인할 수 있습니다.
            </p>
          </div>

          <a
            href="/admin"
            className="w-fit rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            ← 관리자 홈
          </a>
        </header>

        {/* =========================
            오류
        ========================= */}
        {error && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              방문자 통계를
              불러오지 못했습니다.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </section>
        )}

        {conversionError && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              문의 전환 통계를 불러오지 못했습니다.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {conversionError.message}
            </p>
          </section>
        )}

        {/* =========================
            핵심 숫자
        ========================= */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* 오늘 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              오늘 방문자
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {todayVisitors.toLocaleString()}
              명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {todayVisits.length.toLocaleString()}
              회
            </p>
          </div>

          {/* 어제 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              어제 방문자
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {yesterdayVisitors.toLocaleString()}
              명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {yesterdayVisits.length.toLocaleString()}
              회
            </p>
          </div>

          {/* 최근 7일 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              최근 7일
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {sevenDayVisitors.toLocaleString()}
              명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {sevenDayVisits.length.toLocaleString()}
              회
            </p>
          </div>

          {/* 최근 30일 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              최근 30일
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {thirtyDayVisitors.toLocaleString()}
              명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {thirtyDayVisits.length.toLocaleString()}
              회
            </p>
          </div>
        </section>

        {/* =========================
            기간 선택
        ========================= */}
        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">
                조회 기간
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {selectedPeriodLabel} 상세 통계
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                방문자{" "}
                {selectedVisitors.toLocaleString()}
                명 · 페이지 조회{" "}
                {selectedVisits.length.toLocaleString()}
                회
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href="/admin/analytics?period=today"
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  period === "today"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                오늘
              </a>

              <a
                href="/admin/analytics?period=yesterday"
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  period ===
                  "yesterday"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                어제
              </a>

              <a
                href="/admin/analytics?period=7d"
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  period === "7d"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                최근 7일
              </a>

              <a
                href="/admin/analytics?period=30d"
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  period === "30d"
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                최근 30일
              </a>
            </div>
          </div>
        </section>

        {/* =========================
            문의 전환
        ========================= */}
        <section className="mt-6">
          <div className="mb-5">
            <p className="text-sm font-bold text-rose-600">CONVERSION</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">문의 전환</h2>
            <p className="mt-2 text-sm text-gray-500">
              {selectedPeriodLabel} 전화·카카오·상담폼 클릭/제출 기준입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["전화 클릭", phoneClicks, "text-blue-600"],
              ["카카오 클릭", kakaoClicks, "text-yellow-600"],
              ["상담폼 제출", contactSubmits, "text-green-600"],
              ["총 문의 행동", totalConversions, "text-gray-900"],
            ].map(([label, value, color]) => (
              <div key={String(label)} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`mt-2 text-3xl font-bold ${color}`}>
                  {Number(value).toLocaleString()}건
                </p>
              </div>
            ))}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">문의 행동률</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {conversionRate}%
              </p>
              <p className="mt-2 text-xs text-gray-400">총 문의 행동 ÷ 방문자</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900">캠페인별 문의 전환</h3>
              <p className="mt-2 text-sm text-gray-500">
                UTM 유입 기준으로 방문자와 문의 행동을 비교합니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500">
                  <tr>
                    <th className="px-5 py-4">유입</th>
                    <th className="px-5 py-4">캠페인</th>
                    <th className="px-5 py-4 text-right">방문자</th>
                    <th className="px-5 py-4 text-right">전화</th>
                    <th className="px-5 py-4 text-right">카카오</th>
                    <th className="px-5 py-4 text-right">상담폼</th>
                    <th className="px-5 py-4 text-right">총 문의</th>
                    <th className="px-5 py-4 text-right">문의율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {campaignConversions.length > 0 ? (
                    campaignConversions.map((row) => (
                      <tr key={`${row.source}-${row.campaign}`} className="text-sm">
                        <td className="px-5 py-4 font-semibold text-gray-700">{row.source}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">{row.campaignName}</p>
                          {row.campaign !== "-" && row.campaignName !== row.campaign && (
                            <p className="mt-1 text-xs text-gray-400">{row.campaign}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right font-semibold">{row.visitors.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right">{row.phone.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right">{row.kakao.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right">{row.form.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-bold text-blue-600">{row.total.toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-bold text-purple-600">{row.rate}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                        해당 기간의 문의 전환 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =========================
            인기 페이지 / 유입경로
        ========================= */}
        <section className="mt-6 grid gap-5 lg:grid-cols-2">

          {/* 인기 페이지 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div>
              <p className="text-sm font-bold text-blue-600">
                PAGE
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                인기 페이지
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {selectedPeriodLabel} 페이지 조회 기준입니다.
              </p>
            </div>

            <div className="mt-6 divide-y divide-gray-100">
              {popularPages.length >
              0 ? (
                popularPages.map(
                  (
                    page,
                    index
                  ) => (
                    <div
                      key={
                        page.path
                      }
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                          {index +
                            1}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {
                              page.name
                            }
                          </p>

                          <p className="truncate text-xs text-gray-400">
                            {
                              page.path
                            }
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 font-bold text-gray-900">
                        {page.count.toLocaleString()}
                        회
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  해당 기간의 방문
                  데이터가 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* 유입 경로 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-green-600">
              SOURCE
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              유입 경로
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {selectedPeriodLabel} 페이지 조회 기준입니다.
            </p>

            <div className="mt-6 divide-y divide-gray-100">
              {sources.length > 0 ? (
                sources.map(
                  (source) => (
                    <div
                      key={
                        source.name
                      }
                      className="flex items-center justify-between py-4"
                    >
                      <p className="font-semibold text-gray-700">
                        {
                          source.name
                        }
                      </p>

                      <p className="font-bold text-gray-900">
                        {source.count.toLocaleString()}
                        회
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  해당 기간의 유입
                  데이터가 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            접속기기 / 광고캠페인
        ========================= */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">

          {/* 접속 기기 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-purple-600">
              DEVICE
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              접속 기기
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {selectedPeriodLabel} 페이지 조회 기준입니다.
            </p>

            <div className="mt-6 space-y-3">
              {devices.length >
              0 ? (
                devices.map(
                  (device) => {
                    const total =
                      selectedVisits.length ||
                      1;

                    const percent =
                      Math.round(
                        (device.count /
                          total) *
                          100
                      );

                    return (
                      <div
                        key={
                          device.name
                        }
                        className="rounded-2xl bg-gray-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-700">
                            {getDeviceName(
                              device.name
                            )}
                          </p>

                          <p className="font-bold text-gray-900">
                            {
                              percent
                            }
                            %
                          </p>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${percent}%`,
                            }}
                          />
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                          {device.count.toLocaleString()}
                          회
                        </p>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  해당 기간의 기기
                  데이터가 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* 광고 캠페인 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-orange-600">
              CAMPAIGN
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              광고 캠페인 유입
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {selectedPeriodLabel} UTM 캠페인이 설정된 방문입니다.
            </p>

            <div className="mt-6 divide-y divide-gray-100">
              {campaigns.length >
              0 ? (
                campaigns.map(
                  (campaign) => (
                    <div
                      key={
                        campaign.name
                      }
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-700">
                          {
                            campaign.displayName
                          }
                        </p>

                        {campaign.displayName !==
                          campaign.name && (
                          <p className="mt-1 truncate text-xs text-gray-400">
                            {
                              campaign.name
                            }
                          </p>
                        )}
                      </div>

                      <p className="shrink-0 font-bold text-gray-900">
                        {campaign.count.toLocaleString()}
                        회
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  해당 기간의 광고
                  캠페인 데이터가
                  없습니다.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}