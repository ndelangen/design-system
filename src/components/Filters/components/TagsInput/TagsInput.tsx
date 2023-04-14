import type { FC } from 'react';
import type { TagsContainerProps, TagsInputProps } from './TagsInput.types';

import { useState } from 'react';
import styled from 'styled-components';
import {
  __,
  any,
  filter,
  includes,
  map,
  pipe,
  remove,
  split,
  trim,
} from 'ramda';
import { isEmptyArray, isNonEmptyString, isNotEmpty } from 'ramda-adjunct';

import Tag from './Tag';
import { Error } from '../../../forms/Message';
import { Padbox } from '../../../layout';
import {
  getFontSize,
  getFormStyle,
  getLineHeight,
  getRadii,
  pxToRem,
} from '../../../../utils';
import { validatePattern } from '../../helpers';

const Container = styled(Padbox)<TagsContainerProps>`
  display: flex;
  width: 100%;
  min-height: ${pipe(getFormStyle('fieldHeight'), pxToRem)};
  padding: ${({ isFocused }) => pxToRem(0, isFocused ? 15 : 16)};
  background: ${getFormStyle('bgColor')};
  border-width: ${({ isFocused, isInvalid }) =>
    getFormStyle(
      isFocused || isInvalid ? 'statefulBorderWidth' : 'borderWidth',
    )};
  border-style: solid;
  border-color: ${({ isFocused, isInvalid }) =>
    getFormStyle(
      isInvalid
        ? 'invalidBorderColor'
        : isFocused
        ? 'focusBorderColor'
        : 'borderColor',
    )};
  border-radius: ${getRadii('default')};
  color: ${getFormStyle('color')};
  font-size: ${getFontSize('md')};
  line-height: ${getLineHeight('md')};
`;

const StyledInput = styled.input`
  border: none;
  width: 100%;
  padding: ${pxToRem(3, 0)};
  color: ${getFormStyle('color')};
  font-size: ${getFontSize('md')};
  line-height: ${getLineHeight('md')};
  &:focus {
    outline: none;
  }
  ::placeholder,
  ::-webkit-input-placeholder {
    color: ${getFormStyle('placeholderColor')};
  }
  :-ms-input-placeholder {
    color: ${getFormStyle('placeholderColor')};
  }
`;

const Tags = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const InputContainer = styled.div`
  background: none;
  flex-grow: 1;
  padding: 0;
`;

const doesValueAlreadyExist = (tags, valueArray) =>
  any(includes(__, tags))(valueArray);

const TagsInput: FC<TagsInputProps> = ({
  value: tags = [],
  onChange,
  maxLength,
  pattern,
  errorMessage,
  placeholder = 'Enter value',
  isInvalid = false,
  onValidate = validatePattern,
  onError,
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const addNewTag = (value) => {
    const valueArray = pipe(split(';'), map(trim), filter(isNotEmpty))(value);

    if (doesValueAlreadyExist(tags, valueArray)) {
      return;
    }
    onChange([...tags, ...valueArray]);
    setInput('');
  };

  const handleRemoveTag = (index) => {
    const newTags = remove(index, 1, tags);
    onChange(isEmptyArray(newTags) ? undefined : newTags);
  };

  const handleKeyDown = (event) => {
    const { target, key } = event;
    const { value, validity } = target;

    if (key === 'Enter') {
      event.preventDefault();
    }
    if (key === 'Enter' && value && !validity.patternMismatch) {
      addNewTag(value);
    } else if (event.key === 'Backspace' && !value) {
      handleRemoveTag(tags.length - 1);
    }
  };

  const handleOnValidate = (event) => {
    const { target } = event;

    const hasError = onValidate(target) && isNonEmptyString(target.value);
    onError(hasError);
  };

  const handleOnChange = (event) => {
    const {
      target: { value },
    } = event;
    setInput(value);
    handleOnValidate(event);
  };

  const placeholderText = tags.length === 0 ? placeholder : '';

  const handleOnBlur = (event) => {
    const {
      target: { value },
    } = event;

    if (value && !isInvalid) {
      addNewTag(value);
    }
    setIsFocused(false);
  };

  return (
    <>
      <Container
        alignItems="center"
        flexWrap="wrap"
        isFocused={isFocused}
        isInvalid={isInvalid}
      >
        <Tags>
          {tags.map((tag, index) => (
            <Tag key={tag} value={tag} onClose={() => handleRemoveTag(index)} />
          ))}
          <InputContainer>
            <StyledInput
              maxLength={maxLength}
              pattern={pattern}
              placeholder={placeholderText}
              type="text"
              value={input}
              onBlur={handleOnBlur}
              onChange={handleOnChange}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
            />
          </InputContainer>
        </Tags>
      </Container>
      {isInvalid && <Error>{errorMessage}</Error>}
    </>
  );
};

export default TagsInput;
