"use client";

import { useState } from "react";

export default function PhoneActivationOptions() {
  const [activationType, setActivationType] = useState("");

  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      {/* 가입 유형 */}
      <div>
        <label
          htmlFor="activationType"
          className="block text-sm font-bold text-gray-900"
        >
          가입 유형
        </label>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          구매하실 가입 유형을 선택해주세요.
        </p>

        <select
          id="activationType"
          name="activationType"
          required
          value={activationType}
          onChange={(e) => setActivationType(e.target.value)}
          className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="" disabled>
            가입 유형을 선택해주세요
          </option>

          <option value="NEW">
            신규가입
          </option>

          <option value="MNP">
            번호이동
          </option>
        </select>
      </div>

      {/* 번호이동 선택 시 기존 통신사 */}
      {activationType === "MNP" && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <label
            htmlFor="previousCarrier"
            className="block text-sm font-bold text-gray-900"
          >
            기존 통신사
          </label>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            현재 사용 중인 통신사를 선택해주세요.
          </p>

          <select
            id="previousCarrier"
            name="previousCarrier"
            required
            defaultValue=""
            className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              기존 통신사를 선택해주세요
            </option>

            <option value="KT">
              KT
            </option>

            <option value="LGU">
              LG U+
            </option>

            <option value="MVNO">
              알뜰통신사
            </option>
          </select>
        </div>
      )}

      <input
        type="hidden"
        name="productType"
        value="PHONE"
      />

      <input
        type="hidden"
        name="productCode"
        value="a175-study"
      />
    </div>
  );
}