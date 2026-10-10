/**
 * Dictionary Source Attribution & License Verification Service
 * Ensures 100% offline compliance and transparent sourcing
 */
import { DictionarySourceManifest, DictionaryEntry } from '../types';
import { DICTIONARY_MANIFESTS, getSourceManifest, getAllSources } from '../manifest';

export class DictionarySourceService {
  public getAllManifests(): DictionarySourceManifest[] {
    return getAllSources();
  }

  public getManifestById(sourceId: string): DictionarySourceManifest | undefined {
    return getSourceManifest(sourceId);
  }

  public verifyEntrySources(entry: DictionaryEntry): { compliant: boolean; missingRefs: string[] } {
    const missingRefs: string[] = [];
    const validSourceIds = new Set(DICTIONARY_MANIFESTS.map((m) => m.sourceId));

    for (const ref of entry.sourceRefs) {
      if (!validSourceIds.has(ref)) {
        missingRefs.push(ref);
      }
    }

    return {
      compliant: missingRefs.length === 0,
      missingRefs,
    };
  }

  public isFullyOfflineCompliant(): boolean {
    return DICTIONARY_MANIFESTS.every((m) => m.offlineCompliant === true);
  }

  public getAttributionSummary(): Array<{ sourceName: string; license: string; attribution: string }> {
    return DICTIONARY_MANIFESTS.map((m) => ({
      sourceName: m.sourceName,
      license: m.license,
      attribution: m.attribution,
    }));
  }
}

export const dictionarySourceService = new DictionarySourceService();
