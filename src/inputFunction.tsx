import React from "react";
export enum InputType {
  text,
  numeric,
}

type InputFunctionProps = {
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
  type: InputType;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
};

export default function InputFunction({
  title,
  onChange,
  value,
  type,
  inputProps,
}: InputFunctionProps) {
  return (
    <div className="function-input-wrapper">
      <label htmlFor="function-input">{title}</label>
      <input
        id="function-input"
        value={value}
        onChange={onChange}
        type={type === InputType.numeric ? "number" : "text"}
        pattern={type === InputType.numeric ? "[0-9]" : "[A-Za-z]+"}
        className={type === InputType.numeric ? "mini" : "large"}
        {...inputProps}
      />
    </div>
  );
}
