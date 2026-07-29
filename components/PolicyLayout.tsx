import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

type PolicyLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function PolicyLayout({
  title,
  description,
  children,
}: PolicyLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:pt-24">
        <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-10 shadow-sm md:px-12 md:py-14">
          <div className="border-b border-gray-200 pb-8">
            <p className="mb-3 text-sm font-bold text-blue-600">
              사장님찬스 고객안내
            </p>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
              {title}
            </h1>

            {description && (
              <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                {description}
              </p>
            )}
          </div>

          <div className="prose prose-gray mt-10 max-w-none leading-relaxed">
            {children}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}