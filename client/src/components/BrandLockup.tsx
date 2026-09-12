export default function BrandLockup({ inverted: _inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center">
      <img
        src="/brand/logo-yellow.png"
        alt="Laser Parts"
        className="h-12 w-12 object-contain shrink-0 bg-black"
        width={48}
        height={48}
      />
    </span>
  );
}
