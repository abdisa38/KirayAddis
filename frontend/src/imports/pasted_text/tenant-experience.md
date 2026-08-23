# Addis Kiray — Tenant Experience

Continue the existing Addis Kiray design system exactly.

Do NOT redesign:

* brand
* homepage
* search
* property details
* authentication

Extend the established visual language into the authenticated tenant experience.

The design must feel like a premium but practical rental marketplace designed specifically for people searching for homes in Addis Ababa.

---

# PRODUCT CONTEXT

Addis Kiray helps people find rental homes in Addis Ababa.

The tenant has already:

* created an account
* verified their account where required
* selected "Find a Home"
* optionally completed onboarding preferences

The tenant can now:

* discover homes
* receive personalized matches
* search
* explore the map
* save properties
* compare properties
* manage saved searches
* contact landlords
* request property viewings
* track inquiries
* manage their moving preferences
* manage their profile

The tenant workspace must prioritize the home-search journey.

---

# PRIMARY TENANT NAVIGATION

Create an authenticated desktop navigation.

Navigation:

**Addis Kiray**

* Home
* Find a Home
* Map
* Saved
* Compare
* My Activity

Additional:

* Notifications
* Profile

Primary CTA:

**Find a Home**

The active navigation item should be visually clear.

Do not overcrowd the navigation.

---

# MOBILE NAVIGATION

Create a mobile bottom navigation.

Five primary destinations:

**Home**

**Search**

**Saved**

**Activity**

**Profile**

Use recognizable icons with labels.

Do not put every feature in the bottom navigation.

Secondary features should live inside menus or screens.

---

# 1. TENANT HOME DASHBOARD

Create the main authenticated tenant home.

Desktop width:

1440px.

Mobile:

390px.

---

# TENANT HOME HERO

Display:

**Good morning, [First Name] 👋**

Supporting:

**Let's find a place that feels like home.**

Primary CTA:

**Find a Home**

Secondary:

**Explore Map**

---

# PERSONALIZED MATCH SUMMARY

Create a prominent personalized section.

Example:

**Homes picked for you**

**18 homes match your current preferences**

Show:

* location match
* budget match
* bedroom match
* commute match

CTA:

**View all matches**

---

# MATCH SCORE

Use the existing Addis Kiray Match Score.

Property cards should show:

**94% Match**

**89% Match**

**86% Match**

Use Match Score as a recommendation signal, not a guarantee.

Supporting text:

**Based on your preferences**

---

# 2. CONTINUE YOUR SEARCH

Create a section:

**Continue your search**

If the tenant recently searched:

**2-bedroom apartments in Bole**

Display:

* search location
* budget
* bedrooms
* property type
* date

CTA:

**Continue search**

---

# EMPTY CONTINUE SEARCH

If there is no previous search:

**Start your home search**

Supporting:

**Tell us where you want to live and what you're looking for.**

CTA:

**Find a Home**

---

# 3. RECOMMENDED HOMES

Create a horizontal or grid property recommendation section.

Title:

**Recommended for you**

Each card should use the established Addis Kiray property card.

Display:

* image
* verified status
* save button
* property type
* title
* location
* bedrooms
* bathrooms
* area
* price
* match score
* availability

Example:

**Sunlit Two-Bedroom Apartment**

**Bole, Addis Ababa**

**42,000 ETB / month**

**94% Match**

---

# 4. NEW MATCHES

Create a section:

**New matches**

Example:

**3 new homes match your preferences**

Cards should visually indicate:

**New**

Do not use excessive badges.

---

# 5. PRICE DROP ALERT

Create a section for saved properties.

Example:

**Price changed**

**A home you saved is now 3,000 ETB less per month.**

CTA:

**View property**

Only show this component when a real price change exists.

---

# 6. AVAILABILITY UPDATE

Create:

**Availability update**

Example:

**A saved home was recently marked available.**

CTA:

**View home**

---

# 7. COMMUTE-BASED RECOMMENDATIONS

If the tenant has a work/study destination:

Create:

**Homes that fit your commute**

Example:

**Within 30 minutes of your destination**

Property cards show:

**Estimated 24 min**

Use "estimated".

Do not imply real-time traffic unless actual data is available.

CTA:

**Explore commute-friendly homes**

---

# 8. NEIGHBORHOOD DISCOVERY

Create:

**Explore neighborhoods**

Display visual cards for:

* Bole
* Kazanchis
* CMC
* Yeka
* Sarbet
* Piassa
* Lafto
* other relevant Addis neighborhoods

Each card:

Neighborhood name

Number of matching homes

Example:

**Bole**

**24 matching homes**

CTA:

**Explore**

Do not fabricate market statistics.

Use demonstration values only.

---

# 9. SAVED HOMES PREVIEW

Create:

**Your saved homes**

Show 3–4 saved property cards.

Header:

**Saved**

Count:

**8 homes**

CTA:

**View all saved homes**

If empty:

**No saved homes yet**

Supporting:

**Save homes you like so you can compare them later.**

CTA:

**Explore homes**

---

# 10. SAVED HOMES PAGE

Create a complete Saved Homes page.

Title:

**Saved homes**

Supporting:

**Keep track of homes you're considering.**

Controls:

* Grid
* List
* Sort
* Filter

Sort options:

* Recently saved
* Price low to high
* Price high to low
* Match score
* Recently updated

Filter:

* Location
* Price
* Bedrooms
* Property type
* Availability
* Verification

---

# SAVED HOME COLLECTIONS

Allow organization into collections.

Example:

**Favorites**

**Bole options**

**Under 40K**

**Move soon**

CTA:

**Create collection**

Collection card should show property thumbnails.

---

# CREATE COLLECTION

Modal:

**Create a collection**

Field:

Collection name

Example:

**Bole shortlist**

CTA:

**Create**

Secondary:

**Cancel**

---

# MOVE PROPERTY TO COLLECTION

Action:

**Add to collection**

Show collection list.

Allow multiple collections where appropriate.

---

# 11. COMPARE HOMES

Create the tenant comparison experience.

Title:

**Compare homes**

Supporting:

**See your shortlisted homes side by side.**

Comparison categories:

Property

Rent

Location

Bedrooms

Bathrooms

Area

Property type

Match score

Availability

Verification

Amenities

Estimated commute

Landlord response

---

# COMPARISON UI

Desktop:

Table-style comparison.

Each property gets a column.

Rows compare important attributes.

Highlight the best match carefully.

Do not claim one property is objectively "best."

Use:

**Matches your preferences**

instead.

---

# MOBILE COMPARISON

Use horizontal scrolling or stacked comparison cards.

Ensure important values remain readable.

Sticky property names at the top.

---

# EMPTY COMPARISON

Title:

**Compare homes side by side**

Supporting:

**Add at least two homes to compare them.**

CTA:

**Explore homes**

---

# 12. SAVED SEARCHES

Create:

**Saved searches**

Supporting:

**Get notified when homes matching your search appear.**

Example:

**2-bedroom homes in Bole**

Filters:

2 bedrooms

30,000–50,000 ETB

Apartment

Bole

Actions:

Edit

Pause

Delete

---

# CREATE SAVED SEARCH

Allow tenant to save current search.

Button:

**Save this search**

Modal:

**Save your search**

Name:

**Bole 2-bedroom**

Notification frequency:

Instant

Daily

Weekly

None

CTA:

**Save Search**

---

# SAVED SEARCH EMPTY STATE

**No saved searches yet**

Supporting:

**Save a search and we'll help you keep track of new matching homes.**

CTA:

**Search homes**

---

# 13. SEARCH ACTIVITY

Create:

**Recent searches**

Example:

Bole · 2 bedrooms

CMC · 1 bedroom

Kazanchis · Apartment

Actions:

Search again

Delete

Clear all

---

# 14. MY ACTIVITY

Create a dedicated tenant activity page.

Title:

**My activity**

Tabs:

All

Saved

Inquiries

Viewings

Updates

---

# ACTIVITY TIMELINE

Create timeline entries.

Examples:

**You saved Sunlit Two-Bedroom Apartment**

2 hours ago

**Viewing request sent**

Yesterday

**Landlord responded**

Yesterday

**Price updated**

3 days ago

Use clear timestamps.

---

# 15. VIEWING REQUESTS

Create a dedicated viewing section.

Title:

**Viewings**

Tabs:

Upcoming

Pending

Past

Cancelled

---

# UPCOMING VIEWING CARD

Display:

Property image

Property name

Location

Date

Time

Landlord

Status:

**Confirmed**

Actions:

View property

Message landlord

Change time

Cancel

---

# PENDING VIEWING

Status:

**Waiting for landlord confirmation**

Actions:

View request

Change request

Cancel

---

# VIEWING CANCELLED

Status:

**Cancelled**

Explain:

**This viewing was cancelled.**

CTA:

**Request another time**

---

# VIEWING COMPLETED

Status:

**Completed**

Actions:

View property

Save notes

Report issue

---

# 16. VIEWING NOTES

After a completed viewing, optionally allow:

**Add private notes**

Example:

* Good location
* Kitchen needs work
* Check water availability
* Ask about deposit

Important:

These notes are private to the tenant.

CTA:

**Save notes**

---

# 17. INQUIRIES

Create:

**My inquiries**

Display conversations/inquiries related to properties.

Each card:

Property

Landlord

Last message preview

Timestamp

Status

Examples:

**Waiting for response**

**Responded**

**Viewing requested**

**Closed**

Do not build the complete messaging UI here.

Use a clear entry point:

**Open conversation**

The full messaging system will be designed later in Step 10.

---

# 18. TENANT NOTIFICATION PREVIEW

Create notification dropdown/panel.

Categories:

New match

Price change

Availability

Viewing

Message

Saved search

System

Example:

**New match**

A 2-bedroom home in Bole matches your preferences.

**12 min ago**

CTA:

**View home**

Include:

**Mark all as read**

---

# 19. TENANT PREFERENCES

Create:

**My preferences**

Sections:

Location

Budget

Bedrooms

Property type

Amenities

Commute

Move date

Furnishing

---

# EDIT PREFERENCES

Example:

Preferred areas:

Bole

CMC

Yeka

Budget:

30,000–50,000 ETB

Bedrooms:

2+

Move date:

Within 1 month

Commute:

Within 30 minutes

CTA:

**Save preferences**

---

# 20. PROFILE

Create tenant profile page.

Display:

Profile photo

Full name

Email

Phone

Verification status

Member since

---

# PROFILE SECTIONS

Account

Personal information

Contact information

Preferences

Saved homes

Saved searches

Notifications

Privacy

Security

Support

---

# 21. PROFILE COMPLETION

Optional card:

**Complete your profile**

**80% complete**

Missing:

Profile photo

Preferred destination

Move date

CTA:

**Complete profile**

Do not aggressively pressure users.

---

# 22. PRIVACY SETTINGS

Create:

**Privacy**

Options:

Profile visibility

Location permissions

Personalized recommendations

Data preferences

Communication preferences

Keep controls understandable.

---

# 23. NOTIFICATION PREFERENCES

Create:

**Notifications**

Categories:

New matching homes

Price changes

Availability updates

Saved search alerts

Viewing updates

Messages

Platform updates

Channels:

Push

Email

In-app

---

# 24. LOCATION PREFERENCES

Create:

**Location**

Current location permission:

Enabled / Disabled

Primary destination:

Work

University

Custom

CTA:

**Change destination**

---

# 25. MOVE JOURNEY

Create a unique Addis Kiray feature:

**My move**

This should help the tenant organize their rental journey.

Stages:

### 1. Explore

Find homes.

### 2. Shortlist

Save and compare.

### 3. View

Schedule property visits.

### 4. Decide

Choose a property.

### 5. Move

Prepare for moving.

---

# MOVE JOURNEY DASHBOARD

Display progress.

Example:

**You're in the shortlist stage**

Supporting:

**You've saved 6 homes and have 2 upcoming viewings.**

CTA:

**Continue**

---

# MOVE CHECKLIST

Create optional checklist:

* Set budget
* Choose neighborhoods
* Shortlist homes
* Schedule viewings
* Compare homes
* Confirm rental terms
* Prepare documents
* Plan moving date

Allow:

checkbox completion.

---

# 26. DOCUMENT READINESS

Do NOT request sensitive documents unnecessarily.

Create a conceptual section:

**Rental readiness**

Possible items:

* Contact information
* Preferred move date
* Employment/student information if required later
* Required rental documents

Clearly state:

**Only provide documents when a verified rental process requires them.**

---

# 27. PERSONALIZED HOME FEED

Create a richer home feed.

Sections:

**Best matches**

**New in your areas**

**Closer to your destination**

**Within your budget**

**Recently updated**

**Similar to homes you saved**

Every section should have:

**View all**

---

# 28. DISCOVERY EXPLANATIONS

When recommendations appear, provide lightweight explanations.

Example:

**Why you're seeing this**

✓ In your preferred area

✓ Within your budget

✓ 2 bedrooms

✓ Near your destination

Do not overwhelm users with AI terminology.

---

# 29. AI ENTRY POINT

Create a subtle entry point:

**Ask Addis AI**

Supporting:

**Describe the home you're looking for.**

Example:

**"I need a quiet 2-bedroom apartment near Bole, under 45,000 ETB."**

CTA:

**Ask Addis AI**

Important:

Do NOT design the complete AI experience yet.

This is only an entry point.

The full AI experience comes in **Step 9**.

---

# 30. HOME SEARCH SHORTCUT

Create:

**What are you looking for?**

Search input:

**e.g. 2 bedroom near Bole under 40K**

Controls:

Location

Budget

Bedrooms

Property type

Button:

**Search**

This should connect conceptually to the existing search experience.

---

# 31. EMPTY DASHBOARD

For a brand-new tenant:

Title:

**Let's find your first home.**

Supporting:

**Start with your preferred location, budget or commute.**

Primary:

**Find a Home**

Secondary:

**Explore Map**

---

# 32. NO MATCHES

Create:

**We couldn't find an exact match**

Supporting:

**Try widening your budget, location or property preferences.**

Suggestions:

Increase budget

Expand location

Reduce bedroom requirement

Remove an amenity filter

CTA:

**Adjust preferences**

---

# 33. OFFLINE STATE

Create:

**You're offline**

Supporting:

**Some Addis Kiray features may not be available right now.**

CTA:

**Try again**

Previously loaded saved items should remain visually distinguishable if cached.

---

# 34. LOADING STATES

Create skeletons for:

* tenant home
* property cards
* saved homes
* comparison
* activity
* viewing
* preferences

Use the existing Addis Kiray skeleton style.

---

# 35. RESPONSIVE DESIGN

Create desktop:

1440px

Tablet:

768px

Mobile:

390px

Do not simply scale desktop down.

Mobile should be deliberately redesigned.

---

# MOBILE TENANT HOME

Order:

Greeting

Search

New matches

Recommended homes

Continue search

Saved homes

Commute recommendations

Neighborhoods

Move journey

---

# MOBILE PROPERTY CARD

Use compact card.

Show:

Image

Save

Match

Title

Location

Price

Bedrooms

Availability

Keep cards easy to scan.

---

# MOBILE SAVED HOMES

Use:

Filter

Sort

Grid/list toggle

Property cards

Sticky controls only where useful.

---

# MOBILE ACTIVITY

Use tabs:

All

Viewings

Inquiries

Updates

Use timeline cards.

---

# MOBILE PROFILE

Use grouped settings.

Account

Preferences

Notifications

Privacy

Support

Logout

---

# 36. ACCESSIBILITY

All tenant screens must support:

* keyboard navigation
* visible focus
* accessible labels
* readable typography
* sufficient contrast
* screen reader-friendly controls
* touch targets
* non-color status indicators

Do not communicate status using color alone.

---

# 37. COMPONENTS

Create reusable components:

TenantLayout

TenantNavigation

MobileBottomNavigation

TenantGreeting

SearchShortcut

MatchSummary

MatchScore

PropertyCard

PropertyCarousel

NeighborhoodCard

SavedPropertyCard

CollectionCard

SavedSearchCard

ComparisonTable

ActivityTimeline

ViewingCard

InquiryCard

NotificationPanel

PreferenceSection

MoveJourney

MoveChecklist

RecommendationSection

EmptyState

NoResultsState

OfflineState

SkeletonLoader

---

# 38. DESIGN STATES

Create components for:

Default

Hover

Focus

Active

Selected

Saved

Compared

New

Loading

Error

Empty

Disabled

Unavailable

---

# 39. TRUST & SAFETY

Do not create fake trust statistics.

Do not claim:

"100% safe"

"Guaranteed home"

"Guaranteed landlord"

Instead use:

Verified

Information reviewed

Availability confirmed

Estimated

Not specified

---

# 40. TENANT DASHBOARD INFORMATION HIERARCHY

The most important information should appear first.

Priority:

1. Find a home
2. Personalized matches
3. New matching properties
4. Saved homes
5. Viewings / inquiries
6. Search history
7. Move journey
8. Preferences
9. Account settings

Do not turn the tenant dashboard into an analytics dashboard.

---

# 41. FINAL OUTPUT

Create all required desktop and mobile screens.

Organize into:

## Tenant Home

Tenant Dashboard

New Matches

Recommended Homes

Continue Search

Neighborhood Discovery

Commute Recommendations

---

## Saved

Saved Homes

Collections

Create Collection

Saved Searches

---

## Compare

Comparison

Empty Comparison

Mobile Comparison

---

## Activity

Activity

Viewings

Viewing Details

Viewing Statuses

Inquiries

Activity Empty State

---

## Profile

Profile

Preferences

Notifications

Privacy

Location

Security

---

## My Move

Move Journey

Move Checklist

Rental Readiness

---

## States

Loading

Empty

No Results

Offline

Error

Unavailable

Saved

Compared

Use the existing Addis Kiray design system.

Do not redesign:

* homepage
* search
* property details
* authentication

Do not create:

* landlord dashboard
* admin dashboard
* complete messaging system
* complete AI interface
* backend screens

Those will be handled in later roadmap steps.

This step is exclusively the complete **Tenant Experience**.
