# LOCKED FUNCTIONALITY - DO NOT MODIFY

## Input Components (Plus Button & Voice/Send Button)

**STATUS**: LOCKED 🔒
**DATE LOCKED**: 2025-01-09
**REASON**: Core UI functionality matches GPT design pattern

### Protected Components:

#### 1. Plus Button Dropdown Menu
**Location**: `client/src/components/command-bar.tsx` and `client/src/pages/home.tsx`

**LOCKED FEATURES**:
- Plus icon button with dropdown functionality
- Menu items: "Add photos & files", "Agent mode (NEW)", "Deep research", "Create image", "Think longer", "More"
- Exact spacing, icons, and styling
- NEW badge on Agent mode

**CODE PATTERN** (DO NOT CHANGE):
```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-3 hover:bg-gray-100 flex-shrink-0">
      <Plus size={16} className="text-gray-500" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-64">
    {/* LOCKED MENU ITEMS */}
  </DropdownMenuContent>
</DropdownMenu>
```

#### 2. Dynamic Voice/Send Button
**Location**: Both command bar and home page input

**LOCKED BEHAVIOR**:
- When input is empty: Shows voice note icon (sound waves)
- When typing: Immediately switches to black circle with white ArrowUp icon
- Voice note functionality for empty state
- Send functionality for filled state

**CODE PATTERN** (DO NOT CHANGE):
```jsx
{/* Dynamic send/voice button - LOCKED FUNCTIONALITY */}
{input.trim() ? (
  <Button type="submit" className="h-7 w-7 p-0 bg-black hover:bg-gray-800 text-white rounded-full">
    <ArrowUp size={13} />
  </Button>
) : (
  <Button type="button" className="voice-note-button">
    {/* Sound wave icon */}
  </Button>
)}
```

### MODIFICATION POLICY:
- ❌ **FORBIDDEN**: Changing button behavior, icons, or layout
- ❌ **FORBIDDEN**: Removing dropdown functionality
- ❌ **FORBIDDEN**: Modifying dynamic voice/send switching
- ⚠️ **REQUIRES OVERRIDE**: Any changes to these components
- ✅ **ALLOWED**: Bug fixes that maintain exact functionality

### OVERRIDE PROCESS:
If modifications are absolutely necessary:
1. User must explicitly request override with justification
2. Document exact changes and reasoning
3. Maintain core functionality patterns
4. Update this lock file with changes

**WARNING**: This functionality has been specifically designed to match ChatGPT's interface patterns. Changes will break user experience consistency.

### CRITICAL RULE: DUAL COMPONENT SYNC
**BOTH** homepage (`client/src/pages/home.tsx`) and chat page (`client/src/components/command-bar.tsx`) input components MUST remain identical at all times.

**REQUIREMENT**: Any changes to input functionality must be applied to BOTH components simultaneously:
1. Update homepage input in `client/src/pages/home.tsx`
2. Update chat page input in `client/src/components/command-bar.tsx`
3. Verify both components have identical behavior and styling

**COMPONENTS TO SYNC**:
- Plus button dropdown functionality
- Voice/send button behavior
- Input styling and placeholder text
- All interactive elements and their behavior