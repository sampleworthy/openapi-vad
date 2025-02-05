import { ISpectralDiagnostic } from '@stoplight/spectral-core';

export interface ValidationResult {
  severity: string;
  code: string;
  message: string;
  path: string[];
  line: number;
  column: number;
}

export interface ValidationResults {
  errors: ValidationResult[];
  warnings: ValidationResult[];
  infos: ValidationResult[];
  hints: ValidationResult[];
}

export const mapSpectralResults = (results: ISpectralDiagnostic[]): ValidationResults => {
  const mapped = {
    errors: [],
    warnings: [],
    infos: [],
    hints: [],
  } as ValidationResults;

  results.forEach((result) => {
    const validationResult: ValidationResult = {
      severity: result.severity === 0 ? 'error' : 
                result.severity === 1 ? 'warning' :
                result.severity === 2 ? 'info' : 'hint',
      code: result.code,
      message: result.message,
      path: result.path || [],
      line: result.range.start.line,
      column: result.range.start.character
    };

    switch (result.severity) {
      case 0:
        mapped.errors.push(validationResult);
        break;
      case 1:
        mapped.warnings.push(validationResult);
        break;
      case 2:
        mapped.infos.push(validationResult);
        break;
      default:
        mapped.hints.push(validationResult);
    }
  });

  return mapped;
};