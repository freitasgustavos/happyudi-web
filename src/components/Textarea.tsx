import React, { InputHTMLAttributes, useEffect, useRef } from "react";
import { useField } from "@unform/core";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

const Textarea: React.FC<InputProps> = ({ name, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textareaRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <>
      <textarea
        className={error && "error"}
        defaultValue={defaultValue}
        ref={textareaRef}
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
};

export default Textarea;
