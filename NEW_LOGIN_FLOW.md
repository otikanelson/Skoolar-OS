# New Multi-Tenant Login Flow

## Overview
The login system has been redesigned to emphasize the multi-tenant architecture with a two-step authentication process that clearly separates "connecting to a school portal" from "user authentication."

## Login Flow Options

### Option A: Portal-First Flow (Recommended)
**Best for**: Users who know their school's portal ID

1. **Portal Connection Page** (`/login`)
   - User enters school portal ID (e.g., "fieldgreen")
   - System validates portal exists
   - Feels like "connecting to a network" not "logging in"
   - Visual: Network icon, connection status

2. **User Login Page** (`/login/user?portal=fieldgreen`)
   - User enters email and password
   - Portal context is maintained from step 1
   - Shows "Connected to: fieldgreen.educore.ng" status
   - Traditional login aesthetic

### Option B: Direct Login (Bypass)
**Best for**: Users who want quick access

1. **Direct Login Page** (`/login/direct`)
   - User enters full institutional email (e.g., admin@fieldgreen.edu)
   - System auto-detects portal from email domain
   - Single-step login with automatic portal connection
   - Shows "Auto-Portal Detection" info

## File Structure

```
src/pages/
├── PortalConnect.jsx    # Step 1: Portal connection (network feel)
├── UserLogin.jsx        # Step 2: User authentication (login feel)
├── DirectLogin.jsx      # Bypass: Direct email login
└── Login.jsx            # OLD FILE (can be deleted)
```

## Routes

```javascript
/login              → PortalConnect (Portal connection page)
/login/user         → UserLogin (User authentication page)
/login/direct       → DirectLogin (Direct email login)
```

## Key Design Decisions

### 1. Portal Connection Page (PortalConnect.jsx)
**Why it looks different:**
- Network/globe icon instead of user icon
- "Connect to Portal" instead of "Sign In"
- Input shows: `[portalId].educore.ng`
- Emphasizes "connecting to network" not "user login"
- Info box explains what a Portal ID is

**UX Benefits:**
- Reinforces multi-tenant architecture
- Makes it clear each school has isolated network
- Professional, enterprise-grade feel
- Reduces confusion about "which login page am I on?"

### 2. User Login Page (UserLogin.jsx)
**Why it looks traditional:**
- Standard email/password form
- "Sign In" button (familiar UX)
- Shows connection status at top
- Maintains portal context from previous step

**UX Benefits:**
- Familiar login experience
- Clear indication of which portal you're connected to
- Can switch portals easily
- Traditional security feel

### 3. Direct Login Page (DirectLogin.jsx)
**Why it exists:**
- Convenience for returning users
- Auto-detects portal from email domain
- Single-step process
- Explains auto-detection feature

**UX Benefits:**
- Faster for users who know their email
- No need to remember portal ID
- Still maintains multi-tenant security
- Good for mobile users

## User Flows

### New User (First Time)
1. Lands on `/login` (Portal Connection)
2. Sees "What is a Portal ID?" info
3. Contacts school admin for portal ID
4. Enters portal ID → connects
5. Enters credentials → authenticated

### Returning User (Portal-First)
1. Lands on `/login`
2. Enters remembered portal ID
3. Enters credentials
4. Authenticated

### Returning User (Direct)
1. Lands on `/login`
2. Clicks "Sign In Directly with Email"
3. Enters full email + password
4. System auto-detects portal
5. Authenticated

### Request Access Flow
1. User clicks "Request School Access" on landing page
2. Bypasses portal connection
3. Fills request form
4. Admin creates portal + user account
5. User receives portal ID + credentials

## Technical Implementation

### Portal Context Management
```javascript
// Portal-first flow
navigate(`/login/user?portal=${portalId}`);

// Direct login flow
const portalId = email.split('@')[1].split('.')[0];
// Auto-detect and authenticate
```

### State Management
- Portal ID passed via URL params
- Maintained throughout user login
- Stored in localStorage after successful auth
- Used for "remember my portal" feature

## Security Considerations

### Two-Step Verification
1. **Portal Validation**: Ensures portal exists
2. **User Authentication**: Validates credentials

### Benefits:
- Prevents brute force on wrong portals
- Rate limiting per portal
- Audit trail shows portal + user
- Multi-tenant data isolation

## Backend Integration

### API Endpoints Needed

```javascript
// Portal validation
POST /api/portals/validate
Body: { portalId: "fieldgreen" }
Response: { exists: true, name: "Fieldgreen Secondary School" }

// User login (portal-first)
POST /api/auth/login
Body: { email: "admin@fieldgreen.edu", password: "xxx", portalId: "fieldgreen" }

// User login (direct)
POST /api/auth/login/direct
Body: { email: "admin@fieldgreen.edu", password: "xxx" }
// Backend extracts portal from email domain
```

## Migration from Old Login

### What Changed:
- ❌ Removed: Role selection buttons on login page
- ❌ Removed: Single-page login
- ✅ Added: Portal connection step
- ✅ Added: Direct login option
- ✅ Added: Auto-portal detection

### Why:
- Role is determined by user account, not selected at login
- Clearer multi-tenant architecture
- More professional, enterprise feel
- Better security (two-step validation)

## Visual Design

### Portal Connection Page
- **Color**: Dark blue (#1e3a8a)
- **Icon**: Network/globe
- **Feel**: Connecting to infrastructure
- **Language**: "Connect", "Portal", "Network"

### User Login Page
- **Color**: Dark blue (#1e3a8a)
- **Icon**: User avatar
- **Feel**: Personal authentication
- **Language**: "Sign In", "Account", "Credentials"

## Next Steps

1. ✅ Create three new login pages
2. ✅ Update routing in App.jsx
3. ⏳ Update backend to support portal validation
4. ⏳ Add "remember portal" feature
5. ⏳ Add recent portals dropdown
6. ⏳ Implement actual authentication logic
7. ⏳ Add loading states and error handling
8. ⏳ Update all "Login" links to point to `/login`

## Testing Checklist

- [ ] Portal connection with valid ID
- [ ] Portal connection with invalid ID
- [ ] User login after portal connection
- [ ] Direct login with full email
- [ ] Direct login with invalid email format
- [ ] Back navigation between steps
- [ ] Portal switching from user login page
- [ ] Remember me functionality
- [ ] Forgot password flow
- [ ] Mobile responsiveness
- [ ] Animation smoothness
- [ ] Error message display

## Conclusion

This new login flow is **excellent** because:
1. ✅ Reinforces multi-tenant architecture
2. ✅ Clearer user experience
3. ✅ More secure (two-step validation)
4. ✅ Professional, enterprise-grade feel
5. ✅ Flexible (portal-first OR direct)
6. ✅ Scalable (easy to add features)
7. ✅ Matches institutional aesthetic
