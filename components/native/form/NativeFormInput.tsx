import React, { FC, useEffect, useReducer } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';
import NativeInput from '../NativeInput';
import NativeText from '../NativeText';

interface NativeFormInputProps extends TextInputProps {
  label: string;
  errorText: string;
  initiallyValid?: boolean;
  email?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  onInputChange: (value: string, isValid: boolean) => void;
}

interface InputAction {
  type: ActionType;
  payload?: {
    value: string;
    isValid: boolean;
    touched?: boolean;
  };
}

interface InputState {
  value: string;
  isValid: boolean;
  touched: boolean;
}

enum ActionType {
  Change,
  Blur,
}

const inputReducer = (state: InputState, action: InputAction): InputState => {
  switch (action.type) {
    case ActionType.Change:
      return {
        ...state,
        value: action.payload!.value,
        isValid: action.payload!.isValid,
      };
    case ActionType.Blur:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};
const NativeFormInput: FC<NativeFormInputProps> = ({
  label,
  style,
  errorText,
  onInputChange,
  defaultValue,
  initiallyValid,
  email,
  required,
  min,
  max,
  minLength,
  ...rest
}) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: defaultValue || '',
    isValid: initiallyValid || false,
    touched: false,
  });

  const { value, isValid, touched } = inputState;

  useEffect(() => {
    onInputChange(inputState.value, inputState.isValid);
  }, [inputState]);

  const handleTextChange = (text: string) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (required && text.trim().length === 0) {
      isValid = false;
    }
    if (email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (min != null && +text < min) {
      isValid = false;
    }
    if (max != null && +text > max) {
      isValid = false;
    }
    if (minLength != null && text.length < minLength) {
      isValid = false;
    }
    dispatch({
      type: ActionType.Change,
      payload: { value: text, isValid },
    });
  };

  const handleBlur = () => {
    dispatch({ type: ActionType.Blur });
  };

  return (
    <View style={styles.formControl}>
      <NativeText style={styles.label} type="bold">
        {label}
      </NativeText>
      <NativeInput
        {...rest}
        value={value}
        defaultValue={defaultValue}
        style={styles.input}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
      />
      {!isValid && touched && (
        <View style={styles.errorContainer}>
          <NativeText style={styles.errorText}>{errorText}</NativeText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: { width: '100%' },
  label: {
    marginVertical: 0,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});

export default NativeFormInput;
