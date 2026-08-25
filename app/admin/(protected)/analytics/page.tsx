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

function getKoreaDateString(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getSourceName(visit: VisitRow) {
  const utmSource = visit.utm_source?.toLowerCase();

  if (utmSource) {
    if (utmSource.includes("meta")) return "Meta";
    if (utmSource.includes("facebook")) return "Facebook";
    if (utmSource.includes("instagram")) return "Instagram";
    if (utmSource.includes("naver")) return "네이버";
    if (utmSource.includes("daangn")) return "당근";
    if (utmSource.includes("google")) return "Google";

    return visit.utm_source ?? "기타";
  }

  const referrer = visit.referrer?.toLowerCase() ?? "";

  if (!referrer) return "직접 방문";

  if (referrer.includes("instagram.com")) return "Instagram";
  if (referrer.includes("facebook.com")) return "Facebook";
  if (referrer.includes("naver.com")) return "네이버";
  if (referrer.includes("google.")) return "Google";
  if (referrer.includes("daangn.com")) return "당근";

  if (
    referrer.includes("sajangchance.com")
  ) {
    return "내부 이동";
  }

  return "기타";
}

function getPageName(path: string) {
  const pageNames: Record<string, string> = {
    "/": "메인",
    "/card-terminal": "카드단말기 목록",
    "/front2": "토스 프론트2",
    "/front2-printer": "프론트2 + 프린터",
    "/front2-terminal2": "프론트2 + 터미널2",
    "/wireless": "무선 카드단말기",

    "/phone": "휴대폰 목록",
    "/phone/a175": "갤럭시 A175",
    "/phone/a175-study": "갤럭시 A175 공부폰",
    "/phone/m140": "AT-M140 폴더폰",
    "/phone/aroot-a1": "에이루트 A1",

    "/all-in-one": "올인원 랜딩",
  };

  return pageNames[path] ?? path;
}

export default async function AnalyticsPage() {
  const now = new Date();

  const today = getKoreaDateString(now);

  const yesterdayDate = new Date(
    now.getTime() - 24 * 60 * 60 * 1000
  );

  const sevenDaysAgoDate = new Date(
    now.getTime() - 6 * 24 * 60 * 60 * 1000
  );

  const thirtyDaysAgoDate = new Date(
    now.getTime() - 29 * 24 * 60 * 60 * 1000
  );

  const yesterday =
    getKoreaDateString(yesterdayDate);

  const sevenDaysAgo =
    getKoreaDateString(sevenDaysAgoDate);

  const thirtyDaysAgo =
    getKoreaDateString(thirtyDaysAgoDate);

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

  const getVisitDate = (
    visit: VisitRow
  ) =>
    getKoreaDateString(
      new Date(visit.created_at)
    );

  const todayVisits =
    visits.filter(
      (visit) =>
        getVisitDate(visit) === today
    );

  const yesterdayVisits =
    visits.filter(
      (visit) =>
        getVisitDate(visit) === yesterday
    );

  const sevenDayVisits =
    visits.filter(
      (visit) =>
        getVisitDate(visit) >= sevenDaysAgo
    );

  const thirtyDayVisits = visits;

  const uniqueVisitors = (
    rows: VisitRow[]
  ) =>
    new Set(
      rows.map(
        (visit) => visit.session_id
      )
    ).size;

  const todayVisitors =
    uniqueVisitors(todayVisits);

  const yesterdayVisitors =
    uniqueVisitors(yesterdayVisits);

  const sevenDayVisitors =
    uniqueVisitors(sevenDayVisits);

  const thirtyDayVisitors =
    uniqueVisitors(thirtyDayVisits);

  /*
   * 인기 페이지
   */
  const pageMap =
    new Map<string, number>();

  for (const visit of sevenDayVisits) {
    pageMap.set(
      visit.path,
      (pageMap.get(visit.path) ?? 0) + 1
    );
  }

  const popularPages = Array.from(
    pageMap.entries()
  )
    .map(([path, count]) => ({
      path,
      name: getPageName(path),
      count,
    }))
    .sort(
      (a, b) => b.count - a.count
    )
    .slice(0, 10);

  /*
   * 유입 경로
   */
  const sourceMap =
    new Map<string, number>();

  for (const visit of sevenDayVisits) {
    const source =
      getSourceName(visit);

    sourceMap.set(
      source,
      (sourceMap.get(source) ?? 0) + 1
    );
  }

  const sources = Array.from(
    sourceMap.entries()
  )
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort(
      (a, b) => b.count - a.count
    );

  /*
   * 기기
   */
  const deviceMap =
    new Map<string, number>();

  for (const visit of sevenDayVisits) {
    const device =
      visit.device_type ||
      "unknown";

    deviceMap.set(
      device,
      (deviceMap.get(device) ?? 0) + 1
    );
  }

  const devices = Array.from(
    deviceMap.entries()
  )
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort(
      (a, b) => b.count - a.count
    );

  /*
   * UTM 캠페인
   */
  const campaignMap =
    new Map<string, number>();

  for (const visit of sevenDayVisits) {
    if (!visit.utm_campaign) {
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
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (a, b) => b.count - a.count
      )
      .slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1500px]">
        {/* 상단 */}
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              방문자 통계
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              자사몰 방문자와 페이지 조회,
              유입경로를 확인할 수 있습니다.
            </p>
          </div>

          <a
            href="/admin"
            className="w-fit rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            ← 관리자 홈
          </a>
        </header>

        {error && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              방문자 통계를 불러오지 못했습니다.
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error.message}
            </p>
          </section>
        )}

        {/* 핵심 숫자 */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              오늘 방문자
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {todayVisitors.toLocaleString()}명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {todayVisits.length.toLocaleString()}회
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              어제 방문자
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {yesterdayVisitors.toLocaleString()}명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {yesterdayVisits.length.toLocaleString()}회
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              최근 7일
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {sevenDayVisitors.toLocaleString()}명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {sevenDayVisits.length.toLocaleString()}회
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              최근 30일
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {thirtyDayVisitors.toLocaleString()}명
            </p>

            <p className="mt-2 text-xs text-gray-400">
              페이지 조회{" "}
              {thirtyDayVisits.length.toLocaleString()}회
            </p>
          </div>
        </section>

        {/* 인기 페이지 / 유입경로 */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
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
                최근 7일 페이지 조회 기준입니다.
              </p>
            </div>

            <div className="mt-6 divide-y divide-gray-100">
              {popularPages.length > 0 ? (
                popularPages.map(
                  (
                    page,
                    index
                  ) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">
                            {page.name}
                          </p>

                          <p className="truncate text-xs text-gray-400">
                            {page.path}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 font-bold text-gray-900">
                        {page.count.toLocaleString()}회
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  아직 방문 데이터가 없습니다.
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
              최근 7일 페이지 조회 기준입니다.
            </p>

            <div className="mt-6 divide-y divide-gray-100">
              {sources.length > 0 ? (
                sources.map(
                  (source) => (
                    <div
                      key={source.name}
                      className="flex items-center justify-between py-4"
                    >
                      <p className="font-semibold text-gray-700">
                        {source.name}
                      </p>

                      <p className="font-bold text-gray-900">
                        {source.count.toLocaleString()}회
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  아직 유입 데이터가 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 기기 / UTM */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* 기기 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-purple-600">
              DEVICE
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              접속 기기
            </h2>

            <div className="mt-6 space-y-3">
              {devices.length > 0 ? (
                devices.map(
                  (device) => {
                    const total =
                      sevenDayVisits.length ||
                      1;

                    const percent =
                      Math.round(
                        (
                          device.count /
                          total
                        ) * 100
                      );

                    return (
                      <div
                        key={device.name}
                        className="rounded-2xl bg-gray-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold capitalize text-gray-700">
                            {device.name}
                          </p>

                          <p className="font-bold text-gray-900">
                            {percent}%
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
                          {device.count.toLocaleString()}회
                        </p>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  아직 기기 데이터가 없습니다.
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
              UTM 캠페인이 설정된 방문만 표시합니다.
            </p>

            <div className="mt-6 divide-y divide-gray-100">
              {campaigns.length > 0 ? (
                campaigns.map(
                  (campaign) => (
                    <div
                      key={
                        campaign.name
                      }
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <p className="truncate font-semibold text-gray-700">
                        {
                          campaign.name
                        }
                      </p>

                      <p className="shrink-0 font-bold text-gray-900">
                        {campaign.count.toLocaleString()}회
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="py-8 text-center text-sm text-gray-400">
                  아직 UTM 캠페인 데이터가 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}