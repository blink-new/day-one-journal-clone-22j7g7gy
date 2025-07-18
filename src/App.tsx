import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { TimelineView } from '@/components/journal/TimelineView'
import { EntryEditor } from '@/components/journal/EntryEditor'
import { JournalEntry, ViewMode } from '@/types/journal'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

function App() {
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewMode>('timeline')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>()

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleNewEntry = () => {
    setEditingEntry(undefined)
    setIsEditing(true)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setIsEditing(true)
  }

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    try {
      if (editingEntry) {
        // Update existing entry
        setEntries(prev => prev.map(entry => 
          entry.id === editingEntry.id 
            ? { ...entry, ...entryData, updatedAt: new Date().toISOString() }
            : entry
        ))
        toast({
          title: "Success",
          description: "Entry updated successfully"
        })
      } else {
        // Create new entry
        const newEntry: JournalEntry = {
          id: `entry_${Date.now()}`,
          userId: user?.id || 'demo',
          title: entryData.title,
          content: entryData.content || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: entryData.tags || [],
          photos: entryData.photos || [],
          voiceRecordingUrl: entryData.voiceRecordingUrl,
          voiceTranscription: entryData.voiceTranscription,
          isFavorite: entryData.isFavorite || false,
          mood: entryData.mood,
          weather: entryData.weather,
          location: entryData.location
        }
        
        setEntries(prev => [newEntry, ...prev])
        toast({
          title: "Success",
          description: "Entry saved successfully"
        })
      }
      
      // Always close the editor after successful save
      setIsEditing(false)
      setEditingEntry(undefined)
      
      // Ensure we stay on the timeline view
      setCurrentView('timeline')
      
    } catch (error) {
      console.error('Failed to save entry:', error)
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive"
      })
      // Don't close the editor on error so user can retry
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingEntry(undefined)
  }

  const filteredEntries = entries.filter(entry => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      entry.title?.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query)) ||
      entry.location?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Day One Journal</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your journal</p>
          <button 
            onClick={() => blink.auth.login()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewEntry={handleNewEntry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-1 flex flex-col">
        {isEditing ? (
          <EntryEditor
            entry={editingEntry}
            onSave={handleSaveEntry}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            {currentView === 'timeline' && (
              <TimelineView
                entries={filteredEntries}
                onEntryClick={handleEditEntry}
                onNewEntry={handleNewEntry}
              />
            )}
            {currentView === 'calendar' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </div>
            )}
            {currentView === 'search' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h2>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Toaster />
    </div>
  )
}

export default App