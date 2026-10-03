export default function ScrollIndicator() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="
            flex
            h-9
            w-6
            justify-center
            rounded-full
            border
            border-cyan-500/40

            dark:border-cyan-400/30
          "
        >
          <div
            className="
              mt-1
              h-2
              w-1
              rounded-full
              bg-cyan-500

              dark:bg-cyan-400
            "
          />
        </div>

        <span
          className="
            text-[10px]
            uppercase
            tracking-widest
            text-gray-600

            dark:text-gray-500
          "
        >
          Scroll
        </span>
      </div>
    </div>
  );
}