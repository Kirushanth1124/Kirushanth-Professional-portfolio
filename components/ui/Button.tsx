type ButtonProps = {
  children: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg">
      {children}
    </button>
  );
}