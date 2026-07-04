export function Loading({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="feedback">
      <span className="spinner" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="feedback feedback-error" role="alert">
      {message}
    </div>
  );
}

export function Empty({ label = 'Sin registros para mostrar.' }: { label?: string }) {
  return <div className="feedback feedback-empty">{label}</div>;
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge badge-${slug(value)}`}>{value}</span>;
}

// Genera una clase CSS estable a partir del texto de estado.
// normalize('NFD') descompone los acentos y [^a-z0-9]+ elimina las marcas.
function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
