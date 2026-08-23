# Addis Kiray — Authentication, Account Setup & Onboarding

Continue the existing Addis Kiray design system.

Do NOT redesign the brand.

Preserve:

* Deep navy
* Mint / teal
* Warm white
* Light blue-gray
* Existing typography
* Existing buttons
* Existing inputs
* Existing cards
* Existing verification treatment
* Existing Match Score treatment
* Existing iconography
* Existing spacing
* Existing radius system
* Existing responsive behavior

The authentication experience should feel like a natural extension of the Addis Kiray product.

Do not make authentication feel like a generic SaaS login template.

The experience should be:

* simple
* trustworthy
* fast
* accessible
* mobile-friendly
* clear
* reassuring

---

# PRODUCT CONTEXT

Addis Kiray is a rental-property platform for Addis Ababa.

Users can:

* find homes
* save homes
* compare homes
* contact landlords
* schedule viewings
* receive recommendations
* use AI search
* manage their rental journey

Landlords can:

* create property listings
* manage listings
* receive inquiries
* schedule viewings
* communicate with tenants
* manage availability

The authentication system must support both major roles:

1. Tenant
2. Landlord

Administrators exist separately and must NOT be selectable from normal public registration.

---

# AUTHENTICATION ARCHITECTURE

Create screens for:

1. Sign In
2. Create Account
3. Choose Account Purpose
4. Email Verification
5. Phone Verification
6. Forgot Password
7. Reset Password
8. Password Success
9. Session / Loading
10. Authentication Error
11. Account Locked / Temporarily Restricted
12. Logout confirmation where appropriate
13. Tenant onboarding
14. Landlord onboarding
15. Profile completion
16. Location permission
17. Notification permission
18. Onboarding completion

---

# 1. AUTHENTICATION ENTRY

Create a reusable authentication layout.

Desktop:

Left side:

Brand / contextual visual.

Right side:

Authentication form.

Use a subtle Addis Ababa / home / map visual.

Do not use excessive decoration.

Mobile:

Logo at top.

Form below.

No unnecessary split-screen visual.

---

# 2. SIGN IN

Create the main login screen.

Title:

**Welcome back**

Supporting text:

**Sign in to continue your Addis Kiray journey.**

Fields:

Email or phone

Password

Actions:

**Sign In**

**Forgot password?**

Alternative:

**Continue with Google**

Create a divider:

**OR**

Also include:

**Don't have an account? Create one**

---

# PASSWORD FIELD

Password input should support:

* hidden
* visible

Include:

Show password icon.

Create states:

* default
* focus
* error
* valid
* disabled

---

# LOGIN ERROR

Create clear errors.

Incorrect credentials:

**The email, phone number or password is incorrect.**

Do not reveal which credential is wrong.

Network:

**We couldn't connect to Addis Kiray. Check your connection and try again.**

Account restricted:

**This account is temporarily restricted. Please contact support if you need help.**

---

# 3. CREATE ACCOUNT

Title:

**Create your Addis Kiray account**

Supporting:

**Find your next home or start listing properties in Addis Ababa.**

Fields:

Full name

Email

Phone number

Password

Confirm password

Checkbox:

**I agree to the Terms and Privacy Policy.**

CTA:

**Create Account**

Alternative:

**Continue with Google**

Existing account:

**Already have an account? Sign in**

---

# PASSWORD REQUIREMENTS

Create a password-strength component.

Show requirements:

* minimum length
* uppercase
* lowercase
* number
* special character

Use progressive feedback.

Do not expose passwords.

Create:

Weak

Fair

Strong

Very strong

Do not make strength depend solely on color.

---

# 4. ACCOUNT PURPOSE

After registration, ask:

**What brings you to Addis Kiray?**

Two primary options:

## Find a Home

**I'm looking for a rental home**

Icon:

Home / Search

## List a Property

**I have a property to rent**

Icon:

Home / Plus

Explain that the user can change their account capabilities later where permitted.

Do not expose:

**Admin**

as a public option.

---

# ROLE CONFIRMATION

When selecting Tenant:

Show:

**You're setting up a home-search account.**

CTA:

**Continue**

When selecting Landlord:

Show:

**You're setting up a property-listing account.**

CTA:

**Continue**

---

# 5. EMAIL VERIFICATION

Create email verification screen.

Title:

**Check your email**

Supporting:

**We've sent a verification link to your email address.**

Display masked email:

**a••••@example.com**

Actions:

**Open email**

**Resend email**

**Change email**

Show countdown before resend:

**Resend in 45s**

After countdown:

**Resend verification email**

Success:

**Email verified**

CTA:

**Continue**

---

# EMAIL VERIFICATION EXPIRED

Create state:

**This verification link has expired.**

CTA:

**Send a new link**

---

# 6. PHONE VERIFICATION

Create phone verification screen.

Title:

**Verify your phone number**

Supporting:

**Enter the code we sent to your phone.**

Input:

6-digit OTP.

Actions:

**Verify**

**Resend code**

**Change number**

Timer:

**Resend in 45s**

---

# OTP STATES

Create:

* empty
* typing
* complete
* incorrect
* expired
* locked temporarily
* success

Incorrect:

**That code isn't correct. Try again.**

Expired:

**This code has expired. Request a new one.**

Do not display sensitive information.

---

# 7. FORGOT PASSWORD

Title:

**Forgot your password?**

Supporting:

**Enter your email or phone number and we'll help you reset your password.**

Input:

Email or phone

CTA:

**Continue**

Back:

**Back to sign in**

---

# PASSWORD RESET SENT

Title:

**Check your inbox**

Supporting:

**If an account matches the information provided, we'll send instructions to reset your password.**

Important:

Do not reveal whether a specific account exists.

CTA:

**Back to sign in**

---

# 8. RESET PASSWORD

Title:

**Create a new password**

Fields:

New password

Confirm new password

Password strength indicator.

CTA:

**Reset Password**

---

# RESET SUCCESS

Title:

**Password updated**

Supporting:

**Your password has been successfully updated.**

CTA:

**Sign in**

---

# 9. GOOGLE AUTHENTICATION

Create Google sign-in states.

Default:

**Continue with Google**

Loading:

**Connecting…**

Error:

**We couldn't complete Google sign-in. Try again.**

If Google authentication creates a new account, continue into:

**Account Purpose**

rather than automatically assuming a role.

---

# 10. AUTHENTICATION LOADING

Create a full-page or centered loading state.

Example:

Addis Kiray logo

Loading indicator

**Signing you in…**

Keep it minimal.

---

# 11. SESSION EXPIRED

Create a session-expiration state.

Title:

**Your session has expired**

Supporting:

**Please sign in again to continue.**

CTA:

**Sign in**

Do not lose user context unnecessarily.

---

# 12. ACCOUNT RESTRICTION

Create a neutral restricted-account state.

Title:

**Your account is temporarily restricted**

Supporting:

**Some account features are currently unavailable.**

Actions:

**Contact Support**

**Sign out**

Do not expose internal moderation details.

---

# 13. TENANT ONBOARDING

After tenant authentication, create a short onboarding experience.

Title:

**Let's find a home that fits you.**

Supporting:

**Tell us a little about what you're looking for.**

Do NOT require every preference.

Users should be able to skip optional steps.

---

# TENANT ONBOARDING STEP 1

Question:

**Where are you looking?**

Allow:

Neighborhood selection.

Examples:

Bole

Kazanchis

CMC

Yeka

Piassa

Sarbet

Saris

Lafto

Also:

**I'm not sure yet**

CTA:

**Continue**

Secondary:

**Skip**

---

# TENANT ONBOARDING STEP 2

Question:

**What's your monthly budget?**

Minimum:

ETB

Maximum:

ETB

Quick options:

Under 15K

15–25K

25–40K

40–60K

60K+

Allow custom range.

Do not treat these values as market statistics.

---

# TENANT ONBOARDING STEP 3

Question:

**What type of home are you looking for?**

Options:

Apartment

House

Studio

Condominium

Villa

Shared

Other

Allow multiple selections where appropriate.

---

# TENANT ONBOARDING STEP 4

Question:

**How many bedrooms do you need?**

Options:

Studio

1+

2+

3+

4+

5+

---

# TENANT ONBOARDING STEP 5

Question:

**What matters most to you?**

Allow multiple selections:

* Short commute
* Quiet area
* Affordable rent
* Public transportation
* Parking
* Security
* Internet
* Water availability
* Electricity reliability
* Nearby shopping
* Nearby schools
* Nearby healthcare
* Furnished

Use icons consistently.

---

# TENANT ONBOARDING STEP 6

Question:

**Where do you work or study?**

Options:

Search destination.

Use:

**Add a destination**

Allow:

* workplace
* university
* school
* custom destination

Include:

**Skip for now**

---

# TENANT ONBOARDING STEP 7

Question:

**How long are you willing to commute?**

Options:

15 min

30 min

45 min

60 min

No preference

Explain:

**We'll use this to improve recommendations.**

---

# TENANT ONBOARDING STEP 8

Question:

**When do you need to move?**

Options:

Now

Within 2 weeks

Within 1 month

1–3 months

Just exploring

This helps recommendations.

---

# TENANT ONBOARDING COMPLETION

Title:

**You're ready to explore.**

Supporting:

**We've set up your preferences. You can change them anytime.**

Primary:

**Explore My Matches**

Secondary:

**Go to Home**

Display a small summary:

Preferred areas

Budget

Bedrooms

Move timing

---

# 14. LANDLORD ONBOARDING

After choosing:

**List a Property**

Create landlord onboarding.

Title:

**Let's get your property ready to rent.**

Supporting:

**We'll guide you through the listing process.**

---

# LANDLORD ONBOARDING STEP 1

Question:

**What's your name?**

Use profile information from registration.

Allow editing.

---

# LANDLORD ONBOARDING STEP 2

Question:

**How should tenants contact you?**

Options:

* Addis Kiray messages
* Phone
* Both

Explain privacy considerations.

---

# LANDLORD ONBOARDING STEP 3

Question:

**Where is the property located?**

Fields:

Neighborhood

Sub-city

Approximate location

Map selection

Important:

Public listings should support approximate location where exact address privacy is appropriate.

---

# LANDLORD ONBOARDING STEP 4

Question:

**What type of property are you listing?**

Options:

Apartment

House

Studio

Condominium

Villa

Shared accommodation

Other

---

# LANDLORD ONBOARDING STEP 5

Question:

**What are you renting?**

Fields:

Bedrooms

Bathrooms

Area

Furnished status

Availability

---

# LANDLORD ONBOARDING STEP 6

Question:

**What is the monthly rent?**

Input:

ETB

Optional:

Deposit

Payment terms

Do not make deposit mandatory if unknown.

---

# LANDLORD ONBOARDING STEP 7

Question:

**Add property photos**

Create a high-quality upload interface.

Requirements:

* drag and drop desktop
* camera/upload mobile
* image previews
* reorder images
* delete image
* set cover image
* upload progress
* error state

Explain:

**Clear, accurate photos help renters understand the property.**

---

# LANDLORD ONBOARDING STEP 8

Question:

**Tell renters about the property**

Textarea:

**Describe the home, nearby services and anything renters should know.**

Include optional:

**Generate with Addis AI**

This AI feature should only assist the landlord.

The landlord must review the generated content before publishing.

---

# LANDLORD ONBOARDING STEP 9

Question:

**What amenities are available?**

Options:

* Parking
* Water
* Electricity
* Internet
* Security
* Elevator
* Balcony
* Garden
* Generator
* CCTV
* Kitchen
* Furniture
* Compound

---

# LANDLORD ONBOARDING STEP 10

Question:

**Review your listing**

Create a complete listing preview.

Show:

* cover image
* property title
* location
* rent
* facts
* amenities
* description
* availability

Actions:

**Edit**

**Save Draft**

**Continue**

---

# LANDLORD VERIFICATION INTRODUCTION

After basic listing setup:

Title:

**Build trust with verification**

Supporting:

**Verification helps renters understand which information has been checked.**

Display:

Phone verification

Identity verification

Property verification

Clearly distinguish between:

**Required**

**Optional**

**Not available yet**

Do not imply that verification guarantees safety.

CTA:

**Continue**

---

# 15. LOCATION PERMISSION

Create a location permission experience.

Title:

**Make your search more relevant**

Supporting:

**Use your location to discover nearby homes and improve distance estimates.**

Actions:

**Allow location**

**Not now**

Explain that location can be changed later.

---

# 16. NOTIFICATION PERMISSION

Create notification preferences.

Title:

**Stay updated**

Options:

Property matches

New messages

Viewing requests

Price changes

Saved-search alerts

Listing updates

Allow:

Email

Push

In-app

Users can change preferences later.

Primary:

**Continue**

Secondary:

**Skip for now**

---

# 17. PROFILE COMPLETION

Create a profile completion screen.

Tenant profile:

* profile photo
* full name
* phone
* email
* preferred areas
* budget
* move date

Landlord profile:

* profile photo
* name
* phone
* email
* verification status
* listing information

Use:

**Profile 80% complete**

only as an optional visual indicator.

Do not pressure users unnecessarily.

---

# 18. ONBOARDING PROGRESS

Create a consistent progress indicator.

Example:

**Step 2 of 6**

or:

small progress bar.

The user must understand:

* current step
* remaining progress
* ability to go back

Do not make onboarding feel endless.

---

# 19. SKIP / LATER

Optional onboarding questions should have:

**Skip for now**

This is important.

Users should be able to start using Addis Kiray without completing every preference.

Later recommendations can improve progressively.

---

# 20. ONBOARDING SAVED STATE

If the user exits onboarding halfway:

Create:

**Continue setting up your profile**

Supporting:

**You're almost there.**

CTA:

**Continue**

Secondary:

**Skip for now**

---

# 21. MOBILE AUTHENTICATION

Create complete 390px mobile versions for:

* sign in
* registration
* OTP
* password reset
* tenant onboarding
* landlord onboarding

Mobile rules:

* single-column
* large touch targets
* keyboard-safe layout
* sticky bottom CTA where appropriate
* no unnecessary side illustrations
* readable forms
* minimal scrolling

---

# 22. DESKTOP AUTHENTICATION

Reference:

1440px.

Use a centered or split layout depending on the screen.

Keep forms around a comfortable reading width.

Do not stretch forms across the entire screen.

---

# 23. FORM VALIDATION

Create visual states for:

Required field

Invalid email

Invalid phone

Password mismatch

Weak password

Missing consent

Invalid OTP

Server error

Success

Example:

**Passwords don't match.**

Do not only use red borders.

Use clear helper text.

---

# 24. TERMS & PRIVACY

Create consent checkbox:

**I agree to the Terms of Service and Privacy Policy.**

Links should be visually distinct.

Do not pre-check the consent box.

---

# 25. SECURITY UX

The design should communicate security without exaggerated claims.

Use subtle:

* shield icon
* lock icon
* verification indicators

Do NOT use:

“100% secure”

“Hack-proof”

“Guaranteed protection”

---

# 26. ACCESSIBILITY

All authentication screens must support:

* keyboard navigation
* visible focus
* accessible labels
* sufficient contrast
* screen-reader-friendly form structure
* clear validation messages
* touch-friendly controls
* logical tab order

Do not rely only on placeholder text as labels.

---

# 27. COMPONENTS

Reuse the existing Addis Kiray component system.

Create reusable:

AuthLayout

AuthHeader

SocialAuthButton

TextInput

PasswordInput

PhoneInput

OTPInput

PasswordStrength

FormError

FormSuccess

ProgressIndicator

RoleCard

PreferenceCard

LocationSelector

BudgetSelector

AmenitySelector

UploadArea

ImageUploader

OnboardingCard

ConsentCheckbox

PermissionCard

---

# 28. AUTHENTICATION STATES

Create:

Default

Loading

Success

Error

Disabled

Expired

Restricted

Session expired

Email verified

Phone verified

Password reset

Onboarding incomplete

Onboarding complete

---

# 29. DESIGN PRINCIPLES

Authentication must feel like part of Addis Kiray.

It should not feel like an unrelated identity provider page.

Use:

* calm layouts
* strong typography
* clear instructions
* helpful microcopy
* minimal distractions
* trust signals

Avoid:

* excessive illustrations
* huge gradients
* neon effects
* unnecessary animation
* complicated forms

---

# 30. FINAL OUTPUT

Create all required desktop and mobile screens.

Organize them into:

## Authentication

Sign In

Create Account

Google Sign In

Forgot Password

Reset Password

Email Verification

Phone Verification

Session Expired

Account Restricted

Authentication Error

---

## Account Setup

Role Selection

Profile Completion

Location Permission

Notification Permission

---

## Tenant Onboarding

Location

Budget

Property Type

Bedrooms

Preferences

Destination

Commute

Move Date

Completion

---

## Landlord Onboarding

Contact

Location

Property Type

Property Details

Rent

Photos

Description

Amenities

Review

Verification Introduction

Completion

---

## States

Loading

Success

Error

Empty

Disabled

Expired

Use the existing Addis Kiray design system.

Do not redesign the homepage.

Do not redesign search.

Do not redesign property details.

Do not create dashboards yet.

This step is exclusively **Authentication + Account Setup + Tenant/Landlord Onboarding**.
