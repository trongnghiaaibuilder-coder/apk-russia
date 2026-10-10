/**
 * Dictionary Manifest Loader & Attribution Provider
 */
import { DictionarySourceManifest } from './types';
import manifestJson from './attribution/DATA_MANIFEST.json';

export const DICTIONARY_MANIFESTS: DictionarySourceManifest[] = manifestJson as DictionarySourceManifest[];

export function getSourceManifest(sourceId: string): DictionarySourceManifest | undefined {
  return DICTIONARY_MANIFESTS.find((m) => m.sourceId === sourceId);
}

export function getAllSources(): DictionarySourceManifest[] {
  return DICTIONARY_MANIFESTS;
}
