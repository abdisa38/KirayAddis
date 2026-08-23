# Addis Kiray — Search Results + Interactive Map

Continue the existing **Addis Kiray** product design.

Do NOT redesign the brand.

Preserve the approved Addis Kiray visual language:

* deep navy
* mint / teal accent
* warm white
* light blue-gray surfaces
* modern typography
* generous whitespace
* subtle borders
* soft shadows
* rounded professional cards
* property photography
* verification badges
* Match Score
* calm, trustworthy visual language

This screen is one of the most important product experiences in Addis Kiray.

The goal is to create a production-ready property discovery experience where users can search, filter, sort, explore a map, compare properties and understand location/commute information.

---

# PRODUCT PURPOSE

Addis Kiray helps people find rental properties in Addis Ababa based on:

* location
* price
* property type
* bedrooms
* bathrooms
* area
* amenities
* lifestyle
* commute
* work/study destination
* availability
* verification
* personalized preferences

The Search Results experience must feel significantly more useful than a basic property listing directory.

The interface should make the user feel:

**“I can quickly understand where these homes are, what they cost, and which ones fit my life.”**

---

# PRIMARY SEARCH SCENARIO

Design the primary search scenario:

User searched:

**Bole, Addis Ababa**

User preferences:

**Budget: up to 40,000 ETB**

**2+ bedrooms**

**Apartment**

The results should display matching properties.

Use realistic placeholder data only.

Clearly treat all numbers as demonstration data.

---

# PAGE ARCHITECTURE

Create the following desktop experience:

1. Global navigation
2. Search header
3. Search query
4. Quick filters
5. Advanced filter controls
6. Result summary
7. Sort controls
8. Property result list
9. Interactive map
10. Map controls
11. Property markers
12. Selected property state
13. Commute visualization
14. Saved search action
15. Empty state
16. Loading state
17. Error state

Also create the mobile experience.

---

# 1. GLOBAL NAVIGATION

Use the existing Addis Kiray navigation system.

Desktop:

* Addis Kiray logo
* Find a Home
* Explore Map
* Moving
* For Landlords
* How It Works
* language
* notifications if authenticated
* profile/sign in

Keep the navigation compact because the search interface itself needs substantial screen space.

---

# 2. SEARCH HEADER

Create a large search area immediately below navigation.

Primary search input:

**Where do you want to live?**

Current value:

**Bole, Addis Ababa**

Include location/search icon.

Search suggestions should support:

* neighborhood
* sub-city
* landmark
* address
* current location

Examples:

Bole

Bole Atlas

Bole Medhanealem

Kazanchis

CMC

Yeka

Sarbet

Saris

Lafto

Piassa

---

# 3. DESTINATION / COMMUTE SEARCH

Add an optional destination field:

**Where do you work or study?**

Example:

**Bole — Edna Mall area**

Allow the user to specify a destination.

Show an optional control:

**Maximum commute**

Options:

* 15 min
* 30 min
* 45 min
* 60 min

This is one of Addis Kiray's core differentiating features.

---

# 4. QUICK FILTER BAR

Immediately below the search header create horizontal filter controls:

### Price

Example:

**Up to 40,000 ETB**

### Property Type

Apartment

House

Studio

Condominium

Villa

Shared

### Bedrooms

Studio

1+

2+

3+

4+

### Bathrooms

1+

2+

3+

### More Filters

Open advanced filter panel.

Also include:

**Clear filters**

when filters are active.

---

# 5. ADVANCED FILTER PANEL

Create a comprehensive filter drawer/modal.

Sections:

## Price

Minimum:

ETB

Maximum:

ETB

Use a range slider plus numeric inputs.

---

## Property Type

* Apartment
* House
* Studio
* Condominium
* Villa
* Shared accommodation
* Other

---

## Bedrooms

* Studio
* 1+
* 2+
* 3+
* 4+
* 5+

---

## Bathrooms

* 1+
* 2+
* 3+

---

## Area

Minimum square meters

Maximum square meters

---

## Furnishing

* Furnished
* Partially furnished
* Unfurnished

---

## Amenities

* Parking
* Water
* Electricity
* Internet
* Security
* Elevator
* Balcony
* Kitchen
* Garden
* Generator
* CCTV
* Compound
* Furniture

---

## Rental Terms

* Monthly
* Long-term
* Short-term
* Family friendly
* Student friendly

---

## Verification

* Verified landlord
* Verified property
* Recently confirmed

---

## Availability

* Available now
* Available soon
* Select move-in date

---

## Commute

Destination

Maximum commute

Transportation preference:

* Walking
* Public transport
* Car
* Any

---

## Lifestyle

Optional preferences:

* Quiet area
* Family friendly
* Near shopping
* Near school
* Near hospital
* Near public transportation
* Near workplace

---

# 6. RESULT HEADER

Create a clear result summary.

Example:

**Homes in Bole**

**128 properties found**

Do not imply this number is real.

Use placeholder/demo data.

Add:

**Sort by**

Options:

* Recommended
* Newest
* Price: Low to High
* Price: High to Low
* Closest
* Best Match

---

# 7. RECOMMENDED SORT

The default should be:

**Recommended**

Explain subtly that recommendations consider:

* search preferences
* price
* location
* commute
* property type
* availability

Do not expose complicated algorithmic details.

---

# 8. SAVED SEARCH

Create a prominent but secondary action:

**Save this search**

When clicked, the user can receive notifications when matching properties are added.

Create saved-search states:

Default:

**Save search**

Saved:

**Search saved**

Authenticated:

Allow notification preferences.

Unauthenticated:

Ask the user to sign in.

---

# 9. PROPERTY RESULT CARDS

Use the existing Addis Kiray property card system.

Create several variants.

## Standard result card

Include:

* property image
* favorite
* verification badge
* property title
* location
* price
* bedrooms
* bathrooms
* area
* property type
* match score
* availability

Example:

**Modern two-bedroom apartment**

**Bole, Addis Ababa**

**42,000 ETB / month**

**2 beds • 2 baths • 92 m²**

**94% Match**

---

# 10. RESULT CARD COMMUTE

When a destination has been entered, property cards should optionally show:

**18 min to your destination**

Use a small location/route icon.

Do not imply that commute estimates are exact.

Use:

**Estimated 18 min**

when appropriate.

---

# 11. RESULT CARD VERIFICATION

Show verification information without overpromising.

Example:

**✓ Property verified**

or:

**✓ Landlord verified**

Add a subtle tooltip/info action explaining what the verification means.

Do not use:

“100% safe”

or similar claims.

---

# 12. FAVORITE INTERACTION

Create favorite states:

* Not saved
* Saved

The heart icon should be clear.

Saved properties should later appear in the tenant's Saved Homes section.

---

# 13. PROPERTY CARD HOVER

Desktop hover state should:

* slightly elevate the card
* reveal subtle map interaction
* preserve readability
* avoid excessive animation

When hovering a result card, visually highlight the corresponding map marker.

When hovering a map marker, visually highlight the corresponding result card.

This creates a strong list/map relationship.

---

# 14. MAP AREA

The map occupies approximately:

**50–60% of the desktop viewport**

The property list occupies:

**40–50%**

Create a sophisticated Addis Ababa map visualization.

Do not use a real map screenshot.

Use a simplified map style consistent with Addis Kiray.

Show neighborhoods such as:

* Bole
* Kazanchis
* Piassa
* CMC
* Yeka
* Sarbet
* Saris
* Lafto

Use simplified streets and geographic shapes.

---

# 15. PROPERTY MAP MARKERS

Create reusable property markers.

Standard marker:

**35K**

or:

**42K**

Selected marker:

Larger and visually emphasized.

Marker should use the Addis Kiray mint/teal accent.

Do not use generic Google Maps red pins.

---

# 16. MARKER CLUSTERS

When multiple properties are close together, show a cluster.

Example:

**12 homes**

Clicking the cluster should conceptually zoom into the area.

Create:

* cluster default
* cluster hover
* cluster selected

Do not create real map functionality; this is the UI/prototype representation.

---

# 17. SELECTED PROPERTY MARKER

When a user selects a property:

The marker becomes prominent.

Display a small floating preview:

**94% Match**

**Modern 2-bedroom apartment**

**42,000 ETB**

**Bole**

CTA:

**View property**

---

# 18. MAP CONTROLS

Create:

* zoom in
* zoom out
* locate me
* map/layers
* fullscreen
* commute toggle

Use consistent iconography.

---

# 19. CURRENT LOCATION

Create a current-location state.

Display:

**Your location**

Use a subtle location indicator.

Never expose a user's precise location unless the user has granted location permission.

---

# 20. COMMUTE VISUALIZATION

When a destination is selected:

Show a subtle route between:

**Property → Destination**

Example:

Property

↓

18 min

↓

Work destination

Provide a control:

**Show commute**

Options:

* Walking
* Public transport
* Driving

Use a subtle route visualization.

Do not imply that the prototype contains real-time traffic data.

---

# 21. NEIGHBORHOOD CONTEXT

Create an optional map information panel.

When a user selects an area:

**Bole**

Show:

* nearby transport
* shopping
* schools
* hospitals
* workplaces
* general neighborhood context

Use approximate/demo information only.

This information will eventually come from APIs/data sources.

---

# 22. MAP + LIST SYNCHRONIZATION

This is critical.

Design the interaction relationship:

### Hover property card

→ highlight map marker.

### Click property card

→ select map marker.

### Hover marker

→ highlight property card.

### Click marker

→ open property preview.

### View property

→ navigate to property details.

The UI must clearly communicate this connection.

---

# 23. LIST VIEW / MAP VIEW

Create a desktop toggle:

**List**

**Map**

**Split**

Default:

**Split**

This gives the user control over how they explore properties.

---

# 24. MOBILE SEARCH EXPERIENCE

Create a complete 390px mobile design.

Do not shrink the desktop layout.

Mobile should prioritize:

1. Search
2. Filters
3. Results
4. Map

Top:

Search bar.

Below:

Horizontal quick filters.

Then:

Result count and sort.

Property cards.

Floating:

**Map**

button.

When Map is opened:

Full-screen map.

Bottom sheet:

Selected property preview.

---

# 25. MOBILE FILTER DRAWER

Create a full-screen or bottom-sheet filter interface.

Sections:

Price

Bedrooms

Property type

Amenities

Location

Commute

Availability

Verification

Lifestyle

Bottom sticky controls:

**Clear**

**Show 128 homes**

Use placeholder count.

---

# 26. MOBILE MAP

Full-screen map.

Top:

Back button

Search area

Filter button

Map controls

Markers

Bottom sheet:

Selected property.

The bottom sheet should be draggable conceptually.

Include:

Image

Property title

Price

Match score

Location

CTA:

**View property**

---

# 27. EMPTY SEARCH STATE

Create an excellent empty state.

Example:

**No homes match your current filters.**

Suggestions:

* Increase your budget
* Expand the search area
* Reduce bedroom requirements
* Remove some amenities

Actions:

**Adjust filters**

**Explore nearby areas**

Do not simply show:

“No results.”

---

# 28. LOCATION EMPTY STATE

If a neighborhood has no listings:

**We couldn't find available homes here right now.**

Offer:

**Explore nearby neighborhoods**

---

# 29. LOADING STATE

Create skeletons for:

* search results
* property cards
* map
* filters

Use the Addis Kiray skeleton treatment.

---

# 30. ERROR STATE

Create:

**We couldn't load these homes.**

Supporting text:

**Check your connection and try again.**

CTA:

**Try again**

---

# 31. LOCATION PERMISSION

Create a permission experience.

When the user chooses:

**Use my location**

Show a friendly explanation:

**Use your location to find homes nearby and estimate distance to places that matter to you.**

Actions:

**Allow location**

**Not now**

Do not make the experience coercive.

---

# 32. AI SEARCH ENTRY POINT

The search page must contain an AI entry point.

Example:

**Ask Addis AI**

Input:

**“Find a quiet 2-bedroom near Bole under 35,000 ETB.”**

AI converts the request into visible filters.

Display:

**AI understood**

Location: Bole

Budget: ≤35,000 ETB

Bedrooms: 2+

Preference: Quiet

Then:

**Show matching homes**

This should feel integrated with normal search.

---

# 33. AI SEARCH ERROR / UNCERTAINTY

Create an AI clarification state.

Example:

User:

**“I need a cheap place near my work.”**

AI:

**Where do you work or study?**

Provide:

**Enter a destination**

Do not invent missing information.

---

# 34. FILTER CHIPS

When filters are active, display chips:

**Bole ×**

**≤40,000 ETB ×**

**2+ beds ×**

**Apartment ×**

Allow individual removal.

Include:

**Clear all**

---

# 35. ACCESSIBILITY

Maintain WCAG AA-oriented contrast.

All map markers must have accessible labels.

Do not depend only on color.

Keyboard users should be able to navigate:

* search
* filters
* results
* map preview
* sorting

Touch controls must be large enough for mobile.

---

# 36. RESPONSIVE BREAKPOINTS

Create:

Desktop:

1440px

Laptop:

1280px

Tablet:

768px

Mobile:

390px

Do not simply scale down the desktop layout.

Recompose it.

Desktop:

List + map split.

Mobile:

List-first + full-screen map mode.

---

# 37. DESIGN COMPONENTS

Use reusable components from the existing design system.

Create variants for:

PropertyCard

PropertyMarker

FilterChip

FilterDropdown

SearchInput

LocationSuggestion

MatchScore

VerificationBadge

PriceMarker

MapCluster

SortDropdown

FilterDrawer

MapPreview

CommuteIndicator

SavedSearchButton

EmptyState

LoadingState

ErrorState

AIQueryBox

---

# 38. VISUAL HIERARCHY

The user should immediately understand:

1. Where am I searching?
2. What filters are active?
3. How many homes match?
4. Which properties are recommended?
5. Where are those properties located?
6. How much do they cost?
7. How far are they from my destination?

Do not allow decorative elements to compete with these pieces of information.

---

# 39. CONTENT RULES

Use realistic Addis Ababa context.

Use ETB for currency.

Use Addis Ababa neighborhoods.

Do not invent actual market statistics.

Use placeholder/demo property counts where necessary.

Clearly structure content so it can later be replaced by real API data.

---

# 40. FINAL OUTPUT

Create:

### Desktop Search Experience

1440px

### Mobile Search Experience

390px

### Search states

* default
* filtered
* AI search
* saved search
* no results
* loading
* error

### Map states

* default
* marker selected
* cluster
* commute enabled
* location enabled
* property preview

### Filter states

* closed
* open
* active
* mobile drawer

Use the existing Addis Kiray brand and design system.

Do not redesign the homepage.

Do not create the property details page yet.

Do not create tenant, landlord or admin dashboards yet.

This step is exclusively the **Search Results + Interactive Map experience**.
