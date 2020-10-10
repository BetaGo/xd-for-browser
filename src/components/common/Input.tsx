import { TextField } from "@adobe/react-spectrum";
import { SpectrumTextFieldProps } from "@react-types/textfield";
import React, { useEffect, useState } from "react";

export interface IInputNumberProps {
  autoSelect?: boolean;
  addonAfter?: string;
}

const Input: React.FC<SpectrumTextFieldProps & IInputNumberProps> = (props) => {
  const {
    autoSelect,
    addonAfter,
    value,
    onChange,
    onFocus,
    onBlur,
    ...restProps
  } = props;

  const [displayValue, setDisplayValue] = useState<string | undefined>("");
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (isFocus) {
      setDisplayValue(value);
    } else {
      const v = addonAfter ? value + addonAfter : value;
      setDisplayValue(v);
    }
  }, [value, addonAfter, isFocus]);

  const handleOnFocus = (e: React.FocusEvent) => {
    const v = addonAfter
      ? displayValue?.slice(0, -addonAfter.length)
      : displayValue;
    setDisplayValue(v);
    if (autoSelect) {
      const target = e.target;
      setTimeout(() => {
        // @ts-ignore
        target.select?.();
      }, 0);
    }
    onFocus?.(e);
  };

  const handleOnBlur = (e: React.FocusEvent) => {
    setIsFocus(false);
    const v = addonAfter ? displayValue + addonAfter : displayValue;
    setDisplayValue(v);
    onBlur?.(e);
  };

  const handleOnChange = (e: string) => {
    setIsFocus(true);
    // const v = addonAfter ? e + addonAfter : e;
    setDisplayValue(e);
    onChange?.(e);
  };

  return (
    <TextField
      {...restProps}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      value={displayValue}
    />
  );
};

export default Input;
