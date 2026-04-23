export type MediaKind = 'photo' | 'video' | 'audio-music' | 'audio-recording' | 'document';

export interface MediaItem {
  readonly id: string;
  readonly kind: MediaKind;
  readonly name: string;
  readonly mime: string;
  readonly sizeBytes: number;
  readonly createdAtMs: number;
  readonly storageUrl?: string;
  readonly thumbnailUrl?: string;
  /** Chemin local cote telephone source (pas persiste serveur). */
  readonly localUri?: string;
}

export const MEDIA_KIND_META: Record<MediaKind, { emoji: string; labelFr: string }> = {
  'photo':           { emoji: '📷', labelFr: 'Photos' },
  'video':           { emoji: '🎬', labelFr: 'Videos' },
  'audio-music':     { emoji: '🎵', labelFr: 'Musiques' },
  'audio-recording': { emoji: '🎙️', labelFr: 'Enregistrements' },
  'document':        { emoji: '📄', labelFr: 'Documents' },
};
