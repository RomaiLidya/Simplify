import React from 'react';
import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;
  prefix: string;
  thousandSeparator: boolean;
}

const NumberFormatCustom: React.FC<NumberFormatCustomProps> = props => {
  const { inputRef, onChange, prefix, thousandSeparator, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator={thousandSeparator}
      prefix={prefix}
    />
  );
};

export default NumberFormatCustom;
