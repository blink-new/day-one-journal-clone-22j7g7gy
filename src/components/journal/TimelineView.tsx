import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Heart, 
  MessageCircle, 
  Camera, 
  Mic, 
  MoreHorizontal,
  Star,
  Tag,
  MapPin,
  Cloud
} from 'lucide-react'
import { JournalEntry } from '@/types/journal'
import { format } from 'date-fns'

interface TimelineViewProps {
  entries: JournalEntry[]
  onEntryClick: (entry: JournalEntry) => void
  onNewEntry: () => void
}

export function TimelineView({ entries, onEntryClick, onNewEntry }: TimelineViewProps) {
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)

  // Mock data for demonstration
  const mockEntries: JournalEntry[] = [
    {
      id: '1',
      userId: 'user1',
      title: 'A Beautiful Morning',
      content: 'Woke up to the most amazing sunrise today. The sky was painted in shades of orange and pink, and I couldn\'t help but feel grateful for this moment of peace. Sometimes it\'s the simple things that bring the most joy.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['gratitude', 'morning', 'nature'],
      photos: [],
      isFavorite: true,
      mood: 'happy',
      weather: 'sunny',
      location: 'Home'
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Team Meeting Insights',
      content: 'Had a productive team meeting today. We discussed the new project roadmap and I\'m excited about the challenges ahead. The collaboration with my colleagues has been inspiring.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ['work', 'team', 'productivity'],
      photos: [],
      isFavorite: false,
      mood: 'motivated',
      weather: 'cloudy'
    }
  ]

  const displayEntries = entries.length > 0 ? entries : mockEntries

  if (displayEntries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Journal</h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Capture your thoughts, memories, and moments. Your first entry is just a click away.
          </p>
          <Button onClick={onNewEntry} className="bg-primary hover:bg-primary/90">
            <MessageCircle className="w-4 h-4 mr-2" />
            Write Your First Entry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {displayEntries.map((entry) => (
          <Card 
            key={entry.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              hoveredEntry === entry.id ? 'ring-2 ring-primary/20' : ''
            }`}
            onMouseEnter={() => setHoveredEntry(entry.id)}
            onMouseLeave={() => setHoveredEntry(null)}
            onClick={() => onEntryClick(entry)}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {format(new Date(entry.createdAt), 'dd')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      {entry.title && (
                        <h3 className="font-medium text-gray-900">{entry.title}</h3>
                      )}
                      {entry.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.createdAt), 'EEEE, MMMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed line-clamp-3">
                  {entry.content}
                </p>
              </div>

              {/* Media indicators */}
              {(entry.photos.length > 0 || entry.voiceRecordingUrl) && (
                <div className="flex items-center space-x-4 mb-4">
                  {entry.photos.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Camera className="w-4 h-4 mr-1" />
                      {entry.photos.length} photo{entry.photos.length > 1 ? 's' : ''}
                    </div>
                  )}
                  {entry.voiceRecordingUrl && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Mic className="w-4 h-4 mr-1" />
                      Voice note
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  {entry.mood && (
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {entry.mood}
                    </span>
                  )}
                  {entry.weather && (
                    <span className="flex items-center">
                      <Cloud className="w-4 h-4 mr-1" />
                      {entry.weather}
                    </span>
                  )}
                  {entry.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {entry.location}
                    </span>
                  )}
                </div>
                <div className="text-xs">
                  {entry.content.length} characters
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}