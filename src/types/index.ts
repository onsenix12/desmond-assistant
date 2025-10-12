// Core data types for the calendar application

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  type: 'work' | 'family' | 'personal' | 'study';
  location?: string;
  attendees?: string[];
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
  protected?: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly';
  conflict?: boolean;
  conflictsWith?: string[];
  addedBy?: string;
  tentative?: boolean;
  confirmed?: boolean;
  createdBy?: 'system' | 'suggestion' | 'pattern_insight' | 'user';
  subject?: string;
  person?: 'wife' | 'son';
  needsDecision?: boolean;
  decisionType?: 'restaurant';
}

export interface Conflict {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  date: string; // YYYY-MM-DD format
  description: string;
  events: string[]; // Array of event IDs
  impact: string;
  pattern?: string;
  resolutionOptions: ResolutionOption[];
}

export interface ResolutionOption {
  id: string;
  label: string;
  action: 'reschedule' | 'permanent_block' | 'decline' | 'family_adjust' | 'personal_adjust' | 'join' | 'create_event' | 'accept';
  reasoning: string;
  autoMessage?: string;
  impact?: string;
  recommended?: boolean;
}

export interface SmartSuggestion {
  id: string;
  category: 'restaurant' | 'exercise' | 'family' | 'study' | 'productivity';
  title: string;
  description: string;
  action?: string;
  options?: RestaurantOption[];
  availableSlots?: TimeSlot[];
  eventDetails?: Partial<CalendarEvent>;
  blockDetails?: BlockDetails;
  autoMessage?: string;
  familyLikelihood?: string;
  currentAllocation?: string;
  recommendation?: string;
  impact?: string;
  benefit?: string;
  oneClickBooking?: boolean;
}

export interface RestaurantOption {
  name: string;
  cuisine: string;
  reason: string;
  action: string;
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD format
  time: string; // "7:00 AM - 8:00 AM"
  reason: string;
}

export interface BlockDetails {
  title: string;
  time: string;
  type: string;
}

export interface Pattern {
  id: string;
  type: 'conflict_risk' | 'wellbeing' | 'family_time' | 'decision_fatigue';
  title: string;
  insight: string;
  prediction?: string;
  data?: string;
  recommendation?: string;
  action?: 'create_recurring_block' | 'protect_time' | 'enable_shield' | 'enable_restaurant_ai';
}

export interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  status: 'not_connected' | 'connecting' | 'connected';
  description: string;
  syncFrequency: string;
  loading?: boolean;
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface SelectedDate {
  year: number;
  month: number; // 0-indexed
  day: number;
}

export interface DesmondProfile {
  name: string;
  age: number;
  role: string;
  family: {
    wife: string;
    son: string;
  };
  preferences: {
    coffeeTime: string;
    exerciseSlots: string[];
    peakFocusHours: string[];
    cuisines: string[];
    weekendActivities: string[];
  };
  stressors: string[];
  values: string;
}

// Component Props Types
export interface CalendarHeaderProps {
  connectedCount: number;
}

export interface SuccessMessagesProps {
  showSuccessMessage: boolean;
  lastResolvedConflict: {
    conflict: Conflict;
    resolution: ResolutionOption;
  } | null;
  showPatternSuccess: boolean;
  lastPatternAction: {
    pattern: Pattern;
    action: string;
  } | null;
}

export interface MobileChatProps {
  showMobileChat: boolean;
  setShowMobileChat: (show: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
  handleChatSubmit: (e: React.FormEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
}

export interface MobileNavigationProps {
  showMobileChat: boolean;
  setShowMobileChat: (show: boolean) => void;
}

export interface EventListProps {
  selectedDate: SelectedDate | null;
  selectedDayEvents: CalendarEvent[];
  setSelectedDate: (date: SelectedDate | null) => void;
  shouldEventShowStrikethrough: (event: CalendarEvent) => boolean;
}

export interface SelectedDayDetailProps {
  selectedDate: SelectedDate | null;
  selectedDayEvents: CalendarEvent[];
  setSelectedDate: (date: SelectedDate | null) => void;
  shouldEventShowStrikethrough: (event: CalendarEvent) => boolean;
}

export interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
  conflicts: Conflict[];
  selectedDate: SelectedDate | null;
  onDateSelect: (date: SelectedDate) => void;
}

export interface IntelligencePanelProps {
  conflicts: Conflict[];
  suggestions: SmartSuggestion[];
  patterns: Pattern[];
  appliedPatterns: Set<string>;
  onResolveConflict: (conflict: Conflict, resolution: ResolutionOption) => void;
  onApplySuggestion: (suggestion: SmartSuggestion, option?: any) => void;
  onPatternAction: (pattern: Pattern) => void;
  onDismiss: (itemId: string, type: string) => void;
}

export interface ConflictCardProps {
  conflict: Conflict;
  onResolve: (conflict: Conflict, resolution: ResolutionOption) => void;
}

export interface SmartActionCardProps {
  suggestion: SmartSuggestion;
  onAction: (suggestion: SmartSuggestion, option?: any) => void;
}

export interface CalendarDashboardProps {
  connectedApps: Record<string, ConnectedApp>;
  onResetSetup: () => void;
}

export interface ConnectionFlowProps {
  onComplete: (connections: Record<string, ConnectedApp>) => void;
}

// Error Boundary Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}
