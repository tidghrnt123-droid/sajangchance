"use client";

type DeleteOrderButtonProps = {
  disabled?: boolean;
};

export default function DeleteOrderButton({
  disabled = false,
}: DeleteOrderButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        const confirmed = window.confirm(
          "이 주문을 삭제하시겠습니까?\n\n삭제한 주문은 복구할 수 없습니다."
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
        disabled
          ? "cursor-not-allowed bg-gray-100 text-gray-400"
          : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
      }`}
    >
      삭제
    </button>
  );
}