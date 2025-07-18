import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  PenSquare, 
  Calendar, 
  Search, 
  Settings, 
  BookOpen,
  Star,
  Tag,
  Clock
} from 'lucide-react'
import { ViewMode } from '@/types/journal'

interface SidebarProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  onNewEntry: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  onNewEntry,
  searchQuery,
  onSearchChange 
}: SidebarProps) {
  const [recentTags] = useState(['family', 'work', 'travel', 'gratitude', 'goals'])

  const menuItems = [
    { id: 'timeline' as ViewMode, label: 'Timeline', icon: BookOpen },
    { id: 'calendar' as ViewMode, label: 'Calendar', icon: Calendar },
    { id: 'search' as ViewMode, label: 'Search', icon: Search },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Day One</h1>
        <Button 
          onClick={onNewEntry}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          <PenSquare className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-100">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Entries</span>
            <Badge variant="secondary">0</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">This Month</span>
            <Badge variant="secondary">0</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Streak</span>
            <Badge variant="secondary">0 days</Badge>
          </div>
        </div>
      </div>

      {/* Recent Tags */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Tags</h3>
        <div className="flex flex-wrap gap-1">
          {recentTags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs cursor-pointer hover:bg-gray-100"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* On This Day */}
      <div className="p-4 flex-1">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-blue-900">On This Day</h3>
          </div>
          <p className="text-xs text-blue-700">
            No entries from previous years on this date.
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-100">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  )
}