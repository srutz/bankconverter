export function InfoField({
  name,
  value,
}: {
  name: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{name}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}
