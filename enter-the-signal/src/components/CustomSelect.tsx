import { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Selecciona una opción",
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group custom-select-container" ref={containerRef}>
      <label>{label} {required && "*"}</label>
      <div 
        className={`custom-select-trigger ${isOpen ? "open" : ""} ${!value ? "placeholder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <span className="chevron"></span>
      </div>

      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li
              key={option}
              className={`custom-option ${value === option ? "selected" : ""}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
