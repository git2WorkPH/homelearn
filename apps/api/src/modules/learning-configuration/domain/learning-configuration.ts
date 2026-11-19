export const dimensions = ['curriculum', 'pedagogy', 'scheduling', 'assessment'] as const;
export type Dimension = typeof dimensions[number];
export type ConfigurationLayer = Readonly<Partial<Record<Dimension, readonly string[]>>>;
export type Configuration = Readonly<Record<Dimension, readonly string[]>>;
export type Scope = 'default' | 'family' | 'learner' | 'subject' | 'activity';
export interface Selection { readonly dimension: Dimension; readonly id: string }
export interface ConfigurationCatalog {
  readonly definitions: Configuration;
  readonly conflicts?: readonly (readonly [Selection, Selection])[];
}
export interface ConfigurationLayers {
  readonly family?: ConfigurationLayer;
  readonly learner?: ConfigurationLayer;
  readonly subject?: ConfigurationLayer;
  readonly activity?: ConfigurationLayer;
}
export interface ConfigurationSnapshot {
  readonly version: 1;
  readonly values: Configuration;
  readonly sources: Readonly<Record<Dimension, Scope>>;
}
export class ConfigurationError extends Error {
  constructor(readonly code: 'INVALID_LAYER' | 'INVALID_CATALOG' | 'UNKNOWN_REFERENCE' | 'CONFLICT', readonly scope?: Scope, readonly dimension?: Dimension) {
    super(`Learning configuration rejected: ${code}`);
    this.name = 'ConfigurationError';
  }
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function validIds(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((id: unknown) => typeof id === 'string' && id.trim().length > 0 && id === id.trim()) && new Set(value).size === value.length;
}
function validateCatalog(catalog: ConfigurationCatalog): void {
  if (!isRecord(catalog) || !isRecord(catalog.definitions)) throw new ConfigurationError('INVALID_CATALOG');
  for (const dimension of dimensions) {
    if (!validIds(catalog.definitions[dimension])) throw new ConfigurationError('INVALID_CATALOG', undefined, dimension);
  }
  if (catalog.conflicts !== undefined && !Array.isArray(catalog.conflicts)) throw new ConfigurationError('INVALID_CATALOG');
  for (const pair of catalog.conflicts ?? []) {
    if (!Array.isArray(pair) || pair.length !== 2) throw new ConfigurationError('INVALID_CATALOG');
    for (const selection of pair) {
      if (!isRecord(selection) || !dimensions.some(dimension => dimension === selection.dimension) || typeof selection.id !== 'string') throw new ConfigurationError('INVALID_CATALOG');
      const match = dimensions.find(dimension => dimension === selection.dimension);
      if (match === undefined || !catalog.definitions[match].includes(selection.id)) throw new ConfigurationError('INVALID_CATALOG');
    }
  }
}
/** Runtime validation is independent of any future HTTP/Zod boundary. */
export function parseConfigurationLayer(input: unknown, catalog: ConfigurationCatalog, scope: Scope = 'family'): ConfigurationLayer {
  validateCatalog(catalog);
  if (!isRecord(input) || Object.keys(input).some(key => !dimensions.some(dimension => dimension === key))) throw new ConfigurationError('INVALID_LAYER', scope);
  const result: Partial<Record<Dimension, readonly string[]>> = {};
  for (const dimension of dimensions) {
    if (!Object.hasOwn(input, dimension)) continue;
    const ids = input[dimension];
    if (!validIds(ids)) throw new ConfigurationError('INVALID_LAYER', scope, dimension);
    if (ids.some(id => !catalog.definitions[dimension].includes(id))) throw new ConfigurationError('UNKNOWN_REFERENCE', scope, dimension);
    result[dimension] = Object.freeze([...ids]);
  }
  return Object.freeze(result);
}
export function resolveLearningConfiguration(layers: ConfigurationLayers, catalog: ConfigurationCatalog): ConfigurationSnapshot {
  validateCatalog(catalog);
  const values: Record<Dimension, readonly string[]> = { curriculum: [], pedagogy: [], scheduling: [], assessment: [] };
  const sources: Record<Dimension, Scope> = { curriculum: 'default', pedagogy: 'default', scheduling: 'default', assessment: 'default' };
  const scopes = ['family', 'learner', 'subject', 'activity'] as const;
  for (const scope of scopes) {
    const input = layers[scope];
    if (input === undefined) continue;
    const layer = parseConfigurationLayer(input, catalog, scope);
    for (const dimension of dimensions) {
      const ids = layer[dimension];
      if (ids !== undefined) { values[dimension] = ids; sources[dimension] = scope; }
    }
  }
  for (const [left, right] of catalog.conflicts ?? []) {
    if (values[left.dimension].includes(left.id) && values[right.dimension].includes(right.id)) throw new ConfigurationError('CONFLICT');
  }
  for (const dimension of dimensions) Object.freeze(values[dimension]);
  return Object.freeze({ version: 1, values: Object.freeze(values), sources: Object.freeze(sources) });
}
