import { MESSAGES } from '@/constants/messages';
import { UseFormReturnType } from '@mantine/form';
import { ErrorResponse } from '@/types';
import { toPascalCase } from '@/utils/string';
import { notify } from '@/utils/notifications';

export function objectToFormData(obj: any, form: HTMLFormElement, namespace: string) {
  const formData = form || new FormData();

  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }

    const formKey = namespace ? `${namespace}[${property}]` : property;
    const value = obj[property];

    if (value instanceof Date) {
      formData.append(formKey, value.toISOString());
    } else if (value instanceof Array) {
      value.forEach((element, index) => {
        const tempFormKey = `${formKey}[${index}]`;
        objectToFormData(element, formData, tempFormKey);
      });
    } else if (typeof value === 'object' && !(value instanceof File)) {
      objectToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  }

  return formData;
}

const VALIDATION_RULES = {
  REQUIRED: 'REQUIRED',
  MIN_LENGTH: 'MIN_LENGTH',
  MAX_LENGTH: 'MAX_LENGTH',
  MIN_VALUE: 'MIN_VALUE',
  MAX_VALUE: 'MAX_VALUE',
  MIN_EQUAL_VALUE: 'MIN_EQUAL_VALUE',
  MAX_EQUAL_VALUE: 'MAX_EQUAL_VALUE',
  EMAIL: 'EMAIL',
  MATCH: 'MATCH',
  UNIQUE: 'UNIQUE',
} as const;

type ValidationRule = keyof typeof VALIDATION_RULES;

export function validator(name: string, value: string | number | Date | undefined, ...validations: string[]): string | null {
  for (let validation of validations) {
    const [rule, param] = validation.split(':');

    switch (rule as ValidationRule) {
      case VALIDATION_RULES.REQUIRED:
        if (value == null || value === '') {
          return `${name}${MESSAGES.VALIDATION.REQUIRED}`;
        }
        break;
      case VALIDATION_RULES.MIN_LENGTH:
        if (typeof value === 'string' && value.length < parseInt(param)) {
          return `${name}${MESSAGES.VALIDATION.MIN_LENGTH}${param} characters long.`;
        }
        break;
      case VALIDATION_RULES.MAX_LENGTH:
        if (typeof value === 'string' && value.length > parseInt(param)) {
          return `${name}${MESSAGES.VALIDATION.MAX_LENGTH}${param} characters long.`;
        }
        break;
      case VALIDATION_RULES.MIN_VALUE:
        if (typeof value === 'number' && value < parseFloat(param)) {
          return `${name}${MESSAGES.VALIDATION.MIN_VALUE}${param}.`;
        }
        break;
      case VALIDATION_RULES.MAX_VALUE:
        if (typeof value === 'number' && value > parseFloat(param)) {
          return `${name}${MESSAGES.VALIDATION.MAX_VALUE}${param}.`;
        }
        break;
      case VALIDATION_RULES.MIN_EQUAL_VALUE:
        if (typeof value === 'number' && value <= parseFloat(param)) {
          return `${name}${MESSAGES.VALIDATION.MIN_VALUE}${param}.`;
        }
        break;
      case VALIDATION_RULES.MAX_EQUAL_VALUE:
        if (typeof value === 'number' && value >= parseFloat(param)) {
          return `${name}${MESSAGES.VALIDATION.MAX_VALUE}${param}.`;
        }
        break;
      case VALIDATION_RULES.EMAIL:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          return `${name}${MESSAGES.VALIDATION.EMAIL}`;
        }
        break;
      case VALIDATION_RULES.MATCH:
        if (value !== param) {
          return `${name}${MESSAGES.VALIDATION.MATCH}${param}.`;
        }
        break;
      case VALIDATION_RULES.UNIQUE:
        // Not yet implemented
        break;
      default:
        break;
    }
  }
  return null;
}

export function errorHandler(errorResponse: any, form: UseFormReturnType<any>) {
  const errors: Record<string, string> = {};

  const handleStringMessage = (message: string) => {
    const uniqueMatch = message.match(/Key \((.*?)\)=/);
    if (uniqueMatch) {
      const key = uniqueMatch[1];
      const errorMessage = message.split(') ')[1] ?? '';

      errors[key] = `${toPascalCase(key)} ${errorMessage}`;
    } else {
      const [key, ...rest] = message.split(' ');
      const errorMsg = rest.join(' ');

      if (!errors[key]) {
        errors[key] = errorMsg;
      } else {
        errors[key] += `, ${errorMsg}`;
      }
    }
  };

  if (typeof errorResponse.message === 'string') {
    handleStringMessage(errorResponse.message);
  } else if (Array.isArray(errorResponse.message)) {
    errorResponse.message.forEach((msg: string) => {
      handleStringMessage(msg);
    });
  }

  notify(MESSAGES.ERROR.SUBMIT, 'error');
  form.setErrors(errors);
}