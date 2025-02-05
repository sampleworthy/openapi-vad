import { Spectral } from '@stoplight/spectral-core';
import { oas } from '@stoplight/spectral-rulesets';
import * as yaml from 'js-yaml';
import type { ISpectralDiagnostic } from '@stoplight/spectral-core';

export const validateOpenAPI = async (fileContent: string): Promise<ISpectralDiagnostic[]> => {
  const spectral = new Spectral();
  spectral.setRuleset(oas);

  try {
    // Try parsing as JSON first
    let document;
    try {
      document = JSON.parse(fileContent);
    } catch {
      // If JSON parsing fails, try YAML
      document = yaml.load(fileContent);
    }

    const results = await spectral.run(document);
    return results;
  } catch (error) {
    throw new Error('Failed to parse OpenAPI document');
  }
};