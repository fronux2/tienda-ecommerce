"use client";

type TipoInput = "text" | "number" | "textarea" | "select";

type EditableCellProps = {
  id: string;
  campo: string;
  valor: string | number | boolean | undefined;
  editando: { id: string; campo: string } | null;
  valorEditado: string | number;
  onDoubleClick: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  tipo?: TipoInput;
  opciones?: { value: string; label: string }[];
  inputClassName?: string;
  children: React.ReactNode;
};

export default function EditableCell({
  id,
  campo,
  editando,
  valorEditado,
  onDoubleClick,
  onChange,
  onSave,
  onEnter,
  tipo = "text",
  opciones,
  inputClassName = "w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500",
  children,
}: EditableCellProps) {
  const estaEditando = editando?.id === id && editando.campo === campo;

  if (estaEditando) {
    if (tipo === "textarea") {
      return (
        <textarea
          className={inputClassName}
          value={valorEditado}
          onChange={onChange}
          onBlur={onSave}
          rows={2}
          autoFocus
        />
      );
    }

    if (tipo === "select" && opciones) {
      return (
        <select
          className={inputClassName}
          value={valorEditado}
          onChange={onChange}
          onBlur={onSave}
          onKeyDown={onEnter}
          autoFocus
        >
          {opciones.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={tipo === "number" ? "number" : "text"}
        className={inputClassName}
        value={valorEditado}
        onChange={onChange}
        onBlur={onSave}
        onKeyDown={onEnter}
        autoFocus
      />
    );
  }

  return (
    <div className="cursor-pointer" onDoubleClick={onDoubleClick}>
      {children}
    </div>
  );
}
