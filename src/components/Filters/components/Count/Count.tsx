import React from 'react';
import { isNonEmptyString } from 'ramda-adjunct';

import { Error } from '../../../forms/Message';
import { validateNumber } from '../../helpers';
import { NumberPropTypes, NumberProps } from '../Number/Number.types';
import { Input } from '../../../forms';

const Count: React.FC<NumberProps> = ({
  value = '',
  onChange,
  min,
  max,
  placeholder = 'Count',
  errorMessage = 'Use only integers',
  isInvalid = false,
  onError,
}) => {
  const handleKeyPress = (event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };
  const handleOnChange = (event) => {
    onChange(event);
    const hasError =
      !validateNumber(event.target.value, min, max) &&
      isNonEmptyString(event.target.value);

    onError(hasError);
  };

  return (
    <>
      <Input
        data-has-spin="false"
        isInvalid={isInvalid}
        placeholder={placeholder}
        type="number"
        value={value}
        onChange={handleOnChange}
        onKeyPress={handleKeyPress}
      />
      {isInvalid && <Error>{errorMessage}</Error>}
    </>
  );
};

export default Count;

Count.propTypes = NumberPropTypes;
