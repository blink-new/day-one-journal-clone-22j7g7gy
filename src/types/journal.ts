export interface JournalEntry {
  id: string
  userId: string
  title?: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  photos: string[]
  voiceRecordingUrl?: string
  voiceTranscription?: string
  isFavorite: boolean
  mood?: string
  weather?: string
  location?: string
}

export interface VoiceRecording {
  id: string
  url: string
  duration: number
  transcription?: string
}

export type ViewMode = 'timeline' | 'calendar' | 'search'
export type SortOrder = 'newest' | 'oldest'