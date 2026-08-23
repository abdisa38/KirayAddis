# Addis Kiray — Interactive Prototype

Continue using the existing Addis Kiray Figma design.

IMPORTANT:

Do NOT redesign screens.

Do NOT create a new visual identity.

Do NOT change the existing components.

Use the existing screens, components and design system.

The goal is to connect the existing screens into realistic interactive prototypes representing the actual Addis Kiray product.

---

# PROTOTYPE STRUCTURE

Create a dedicated Figma page:

**23 — Interactive Prototype**

Organize prototype flows into:

01 — Tenant Search Journey

02 — AI Rental Discovery Journey

03 — Tenant Viewing Journey

04 — Landlord Listing Journey

05 — Admin Review Journey

06 — Trust & Safety Journey

07 — Authentication Journey

08 — Messaging Journey

---

# FLOW 01 — TENANT SEARCH JOURNEY

Starting screen:

Public/Home

Interaction:

User selects:

**Find a Home**

Navigate to:

Search

---

# SEARCH

User can interact with:

Search location

Price

Property type

Bedrooms

Amenities

Availability

---

# SEARCH RESULT

Click:

**Search**

Navigate to:

Search Results

---

# MAP

User clicks:

**Map View**

Navigate/display:

Interactive Map

Show:

Property markers

Selected marker

Property preview

---

# PROPERTY

User clicks property marker or card.

Navigate to:

Property Detail

---

# PROPERTY DETAIL

Interactions:

Save

Contact landlord

Request viewing

Share

Report

AI review

---

# SAVE

Click:

Save

Show:

Saved state

Toast:

**Property saved**

---

# CONTACT

Click:

Contact landlord

Navigate to:

Conversation

Pre-fill contextual property information.

---

# MESSAGE

User types:

"Is this property still available?"

Click:

Send

Show:

Message bubble

Show:

Sent state

---

# REQUEST VIEWING

From property:

Click:

Request viewing

Navigate:

Viewing Request

---

# VIEWING REQUEST

Select:

Date

Time

Message

Click:

Send request

Show:

Success state

**Viewing request sent**

---

# FLOW 02 — AI RENTAL DISCOVERY

Starting:

Home

Click:

**Ask Addis AI**

Navigate:

AI Assistant

---

# AI INPUT

Example:

"I need a 2 bedroom apartment near Bole. My budget is 30,000 ETB and I want to be close to my workplace."

Show:

User message

---

# AI PROCESSING

Show:

AI thinking state

Then:

AI response.

---

# AI RESPONSE

Display:

Understanding:

Location

Budget

Bedrooms

Commute preference

---

# AI RESULTS

Click:

**Show matching homes**

Navigate:

AI Search Results

---

# AI MATCH

Each result displays:

Property

Price

Location

Match percentage

Why it matches

---

# MATCH DETAILS

Click:

**Why this matches**

Open:

AI Match Explanation

---

# COMPARE

User selects:

Compare

Navigate:

Property Comparison

Compare:

Price

Location

Bedrooms

Amenities

Distance

AI match

Trust signals

---

# OPEN PROPERTY

Click:

View property

Navigate:

Property Detail

---

# FLOW 03 — LANDLORD LISTING JOURNEY

Starting:

Login

Select:

Landlord

Navigate:

Landlord Dashboard

---

# DASHBOARD

Click:

**Add property**

Navigate:

Create Listing — Step 1

---

# CREATE LISTING

Step 1:

Property type

Step 2:

Location

Step 3:

Property details

Step 4:

Amenities

Step 5:

Photos

Step 6:

Rental terms

Step 7:

Description

Step 8:

Review

Step 9:

Verification

---

# LISTING PROGRESS

Display:

Step indicator

1

2

3

4

5

6

7

8

9

---

# LOCATION

User selects:

Addis Ababa

Sub-city

Neighborhood

Map location

Continue.

---

# PROPERTY DETAILS

Input:

Bedrooms

Bathrooms

Property size

Floor

Furnished

Property type

---

# AMENITIES

Select:

Water

Electricity

Parking

Internet

Kitchen

Security

Balcony

Other

---

# PHOTOS

Upload property images.

Show:

Image previews

Reorder

Delete

Primary image

---

# RENTAL TERMS

Input:

Monthly rent

Deposit

Availability date

Lease duration

Utilities

Other fees

---

# REVIEW

Show complete listing preview.

Actions:

Edit

Submit

---

# VERIFICATION

Navigate:

Property Verification

Show:

Verification status

Required information

Submit verification

---

# SUBMIT

Click:

Submit listing

Navigate:

Listing submitted

Show:

**Your listing has been submitted for review.**

CTA:

**View listing status**

---

# LANDLORD STATUS

Display:

Pending review

---

# FLOW 04 — ADMIN REVIEW

Starting:

Admin Dashboard

Click:

Listings

Navigate:

Admin Listings

---

# PENDING FILTER

Click:

Pending Review

Show pending listings.

---

# LISTING REVIEW

Click:

Property

Navigate:

Admin Listing Review

Display:

Property

Landlord

Photos

Location

Rental terms

Verification

History

---

# ADMIN ACTIONS

Actions:

Approve

Request information

Reject

Restrict

---

# APPROVE

Click:

Approve

Show confirmation modal.

Text:

**Approve this listing?**

Buttons:

Cancel

Approve

---

# APPROVED

Navigate:

Listing Approved

Show:

**Listing approved**

Status:

Active

---

# FLOW 05 — TRUST & SAFETY

Starting:

Property Detail

Click:

Report

Navigate:

Report Listing

---

# REPORT

Select:

Fake listing

Incorrect information

Suspicious behavior

Scam concern

Wrong location

Duplicate

Other

---

# DETAILS

Enter:

Additional information

---

# EVIDENCE

Upload:

Screenshot

Image

Document if supported

---

# REVIEW

Show:

Reason

Description

Evidence

---

# SUBMIT

Click:

Submit report

Navigate:

Report confirmation

---

# CONFIRMATION

Show:

**Report submitted**

Report ID

Status:

Received

---

# FLOW 06 — AUTHENTICATION

Starting:

Home

Click:

Sign in

Navigate:

Login

---

# LOGIN

Enter:

Email / phone

Password

Click:

Sign in

---

# SUCCESS

Navigate based on role:

Tenant → Tenant Dashboard

Landlord → Landlord Dashboard

Admin → Admin Dashboard

---

# REGISTER

Home → Sign up

Choose:

Tenant

Landlord

Navigate:

Registration

---

# REGISTRATION

Fields:

Name

Email

Phone

Password

Confirm password

---

# VERIFY

Navigate:

Verification

Show:

Email/phone verification concept.

---

# ONBOARDING

Tenant:

Location

Budget

Property preferences

Commute preferences

Amenities

Landlord:

Profile

Verification

Listing readiness

---

# FLOW 07 — MESSAGING

Starting:

Property Detail

Click:

Contact landlord

Navigate:

Conversation

---

# CONVERSATION

Display:

Property context

Messages

Input

Send

---

# VIEWING

Click:

Request viewing

Navigate:

Viewing request

---

# VIEWING ACCEPTED

Show:

**Viewing confirmed**

Date

Time

Property

Location

---

# VIEWING DECLINED

Show:

**Viewing request declined**

Allow:

Choose another time

---

# FLOW 08 — SAVED PROPERTIES

Starting:

Search

Click:

Save

Navigate:

Saved

---

# SAVED

Display:

Saved property cards.

Click property:

Property Detail

---

# REMOVE SAVED

Click:

Saved icon

Show:

**Removed from saved homes**

---

# GLOBAL INTERACTION RULES

Use realistic Figma interactions.

Preferred transitions:

Smart Animate

Dissolve

Move in

Move out

Instant where appropriate.

Do not over-animate.

---

# BUTTON INTERACTIONS

All primary CTAs should work.

Examples:

Find a Home

Search

Ask Addis AI

Save

Contact

Request Viewing

Submit

Approve

Report

---

# FORM INTERACTIONS

Show realistic states:

Empty

Filled

Focus

Error

Success

Loading

Disabled

---

# NAVIGATION

Prototype:

Logo → Home

Search → Search

Saved → Saved

Messages → Messages

Profile → Profile

Dashboard → Dashboard

---

# MOBILE PROTOTYPE

Create mobile prototype flows for:

Tenant Search

Property Detail

AI

Messaging

Request Viewing

Safety

---

# MOBILE NAVIGATION

Ensure:

Home

Search

Saved

Messages

Profile

are connected.

---

# DESKTOP PROTOTYPE

Use desktop prototype for:

Tenant

Landlord

Admin

AI

---

# ADMIN PROTOTYPE

Connect:

Dashboard

Users

Listings

Verification

Reports

Analytics

Audit Logs

---

# ERROR FLOWS

Create prototype examples for:

Invalid login

Empty search

No properties

Network error

Failed message

Failed listing submission

Verification failed

Report submission failed

---

# SUCCESS FLOWS

Create:

Login success

Property saved

Message sent

Viewing requested

Viewing confirmed

Listing submitted

Listing approved

Verification approved

Report submitted

---

# PROTOTYPE VARIABLES / STATES

Where Figma supports variables, use them for:

Saved state

Message state

Viewing state

Listing state

Verification state

Report state

---

# PROTOTYPE GOAL

The prototype should feel like a real rental marketplace.

A tester should be able to understand:

How a tenant finds a home

How AI helps

How a tenant contacts a landlord

How a viewing is requested

How a landlord publishes a property

How verification works

How admin reviews listings

How users report problems

How messaging works

---

# DO NOT IMPLEMENT BACKEND LOGIC

This is a Figma prototype only.

Use simulated interactions.

Do not create fake claims of real verification.

Do not create real payment flows.

Do not create real authentication.

Do not imply that the prototype is connected to production APIs.

---

# FINAL PROTOTYPE STRUCTURE

Create these prototype flows:

Tenant Search

AI Discovery

Property Viewing

Landlord Listing

Admin Review

Trust & Safety

Authentication

Messaging

Saved Properties

Mobile Search

Mobile Property

Mobile AI

Mobile Messaging

Mobile Safety

The prototype must use the existing Addis Kiray design system.
