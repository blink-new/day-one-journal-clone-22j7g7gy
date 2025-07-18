import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Save, 
  X, 
  Camera, 
  Mic, 
  MicOff,
  Star,
  Tag,
  MapPin,
  Cloud,
  Heart,
  Plus
} from 'lucide-react'
import { JournalEntry } from '@/types/journal'

interface EntryEditorProps {
  entry?: JournalEntry
  onSave: (entry: Partial<JournalEntry>) => void
  onCancel: () => void
}

export function EntryEditor({ entry, onSave, onCancel }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [tags, setTags] = useState<string[]>(entry?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [mood, setMood] = useState(entry?.mood || '')
  const [weather, setWeather] = useState(entry?.weather || '')
  const [location, setLocation] = useState(entry?.location || '')
  const [isFavorite, setIsFavorite] = useState(entry?.isFavorite || false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    // Validate required content
    if (!content.trim() || isSaving) {
      return
    }

    setIsSaving(true)
    
    try {
      const entryData: Partial<JournalEntry> = {
        title: title.trim() || undefined,
        content: content.trim(),
        tags,
        mood: mood.trim() || undefined,
        weather: weather.trim() || undefined,
        location: location.trim() || undefined,
        isFavorite,
        photos: entry?.photos || [],
        voiceRecordingUrl: entry?.voiceRecordingUrl
      }

      if (entry) {
        entryData.id = entry.id
        entryData.updatedAt = new Date().toISOString()
      }

      await onSave(entryData)
    } catch (error) {
      console.error('Error preparing entry data:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording functionality
  }

  const moods = ['happy', 'grateful', 'excited', 'calm', 'thoughtful', 'motivated', 'nostalgic', 'peaceful']
  const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy', 'foggy', 'windy']

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {entry ? 'Edit Entry' : 'New Entry'}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? 'text-yellow-500' : 'text-gray-400'}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={onCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Input
                placeholder="Entry title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium border-none px-0 focus-visible:ring-0 placeholder:text-gray-400"
              />
            </div>

            {/* Content */}
            <div>
              <Textarea
                ref={textareaRef}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] border-none px-0 resize-none focus-visible:ring-0 text-base leading-relaxed"
                autoFocus
              />
            </div>

            {/* Media Controls */}
            <div className="flex items-center space-x-4 py-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePhotoUpload}
                className="text-gray-600 hover:text-gray-900"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRecording}
                className={`${isRecording ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Note
                  </>
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  // TODO: Handle photo upload
                  console.log('Photos selected:', e.target.files)
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mood */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Mood</span>
                </div>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                >
                  <option value="">Select mood...</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Weather */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Weather</span>
                </div>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md text-sm"
                >
                  <option value="">Select weather...</option>
                  {weatherOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Location</span>
                </div>
                <Input
                  placeholder="Where are you?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                {content.length} characters
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!content.trim() || isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : (entry ? 'Update' : 'Save')} Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}