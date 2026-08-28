import NewProductForm from "@/components/NewProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-semibold text-blue-600">
              사장님찬스 관리자
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              새 상품 등록
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              상품정보와 이미지를 등록하면 사이트에 바로 노출할 수 있습니다.
            </p>
          </div>

          <a
            href="/admin/products"
            className="w-fit rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            ← 상품관리
          </a>
        </header>

        <NewProductForm />
      </div>
    </main>
  );
}
