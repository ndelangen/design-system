import React from 'react';
import PropTypes from 'prop-types';
import { isNonEmptyString } from 'ramda-adjunct';

import { Error } from '../../../forms/Message';
import { TagsInputProps } from './TagsInput.types';
import { MultiValueInput } from '../../../forms';
import { validatePattern } from '../../helpers';

const TagsInput: React.FC<TagsInputProps> = ({
  value: tags = [],
  onChange,
  maxLength,
  pattern,
  errorMessage,
  onValidate = validatePattern,
  onError,
  placeholder = 'Enter value',
  isInvalid = false,
}) => {
  const handleOnValidate = (event) => {
    const { target } = event;
    const hasError = onValidate(target) && isNonEmptyString(target.value);
    onError(hasError);
  };

  return (
    <>
      <MultiValueInput
        maxLength={maxLength}
        pattern={pattern}
        placeholder={placeholder}
        value={tags}
        onInputChange={handleOnValidate}
        onValuesChange={onChange}
      />
      {isInvalid && <Error>{errorMessage}</Error>}
    </>
  );
};

export default TagsInput;

TagsInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
  isInvalid: PropTypes.bool,
  onValidate: PropTypes.func,
  onError: PropTypes.func,
};
