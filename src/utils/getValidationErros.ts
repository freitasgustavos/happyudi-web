import { ValidationError } from "yup";

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
    window.location.hash = error.path;
  });

  return validationErrors;
}
