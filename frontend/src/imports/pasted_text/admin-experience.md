# Addis Kiray — Admin Experience

Continue the existing Addis Kiray design system.

Do NOT redesign:

* public homepage
* tenant experience
* landlord experience
* property details
* authentication
* search experience

Create a professional internal administration and operations platform for Addis Kiray.

The admin interface is NOT public.

It should feel:

* professional
* operational
* trustworthy
* information-dense but readable
* efficient
* secure
* modern SaaS
* easy to scan

Avoid unnecessary decorative elements.

The admin interface should prioritize:

1. Actions requiring attention
2. Marketplace health
3. Property moderation
4. User management
5. Verification
6. Reports and safety
7. Analytics
8. Auditability

---

# ADMIN NAVIGATION

Create desktop admin navigation.

Brand:

Addis Kiray

Navigation:

Dashboard

Users

Properties

Verification

Reports

Messages

Analytics

Content

System

Audit Logs

---

# ADMIN TOP BAR

Top bar:

Global search

Notifications

Help

Admin profile

Role badge

Example:

**Super Admin**

---

# ADMIN ROLE TYPES

Design support for:

Super Admin

Operations Admin

Verification Admin

Support Admin

Content Admin

Do not give every admin role access to everything.

Use permission-aware navigation.

---

# 1. ADMIN DASHBOARD

Create desktop dashboard at 1440px.

Primary heading:

**Good morning, Admin**

Supporting:

**Here's what's happening across Addis Kiray.**

---

# ATTENTION CENTER

Place this near the top.

Title:

**Needs attention**

Examples:

12 listings waiting for review

7 verification requests

4 reported listings

9 unresolved support cases

3 suspicious activity alerts

Each item should be clickable.

Use severity levels:

Normal

Important

Urgent

Do not use red everywhere.

---

# MARKETPLACE OVERVIEW

Create summary cards:

Active properties

Available homes

Registered tenants

Registered landlords

Pending listings

Pending verification

Open reports

Upcoming viewings

Use concise numbers.

Demo values are placeholders only.

---

# MARKETPLACE HEALTH

Create visual overview:

Listings

Users

Inquiries

Viewings

Reports

Use simple charts.

Do not make this look like a financial trading dashboard.

---

# 2. USERS

Create:

**User Management**

Tabs:

All

Tenants

Landlords

Admins

Suspended

Pending verification

---

# USER SEARCH

Search:

Name

Email

Phone

User ID

Property ID

Allow filters.

---

# USER TABLE

Columns:

User

Role

Verification

Status

Listings

Joined

Last active

Actions

---

# USER STATUS

States:

Active

Pending

Suspended

Restricted

Deactivated

Banned

Use status + icon/text.

---

# USER DETAIL

Create detailed user profile.

Header:

Profile photo

Name

Role

Verification status

Account status

Actions

---

# USER INFORMATION

Sections:

Personal information

Contact

Verification

Properties

Inquiries

Reports

Activity

---

# USER ADMIN ACTIONS

Actions:

View

Edit limited information

Restrict

Suspend

Reactivate

Deactivate

Ban

Do not allow destructive actions without confirmation.

---

# SUSPEND USER

Modal:

**Suspend this account?**

Reason:

Required.

Options:

Policy violation

Suspicious activity

Fraud concern

User request

Other

Field:

Additional notes

CTA:

**Suspend account**

---

# BAN USER

Stronger confirmation.

Display:

User

Reason

Consequences

Require confirmation.

Do not create a one-click ban.

---

# 3. PROPERTY MODERATION

Create:

**Property Management**

Tabs:

All

Pending Review

Active

Paused

Reserved

Rented

Rejected

Reported

---

# PROPERTY MODERATION TABLE

Columns:

Property

Landlord

Location

Price

Status

Verification

Submitted

Reports

Actions

---

# PROPERTY REVIEW QUEUE

Create prioritized queue.

Example:

**Pending review**

12 properties

Sort:

Newest

Oldest

Priority

Reported

---

# PROPERTY REVIEW DETAIL

Create a dedicated moderation page.

Header:

Property title

Property ID

Landlord

Status

---

# REVIEW PROPERTY

Display:

Photo gallery

Property information

Location

Rental price

Amenities

Description

Availability

Landlord information

Verification information

---

# MODERATION SIDEBAR

Create:

Review status

Verification

Reports

Previous actions

Admin notes

---

# MODERATION ACTIONS

Buttons:

Approve

Request changes

Reject

Pause listing

Remove listing

---

# APPROVE

Confirmation:

**Approve this listing?**

Supporting:

**The listing will become eligible for public visibility.**

CTA:

Approve

---

# REQUEST CHANGES

Modal:

**Request changes**

Select issues:

Missing photos

Incorrect information

Incomplete location

Pricing issue

Description issue

Rental terms missing

Other

Add notes.

CTA:

**Send request**

---

# REJECT LISTING

Require reason.

Do not make rejection irreversible.

Allow landlord to correct and resubmit where appropriate.

---

# 4. REPORTED LISTINGS

Create:

**Reports**

Tabs:

All

Listings

Users

Messages

Safety

Resolved

---

# REPORT CARD

Display:

Report type

Reported entity

Reporter

Date

Priority

Status

Assigned admin

---

# REPORT TYPES

Examples:

Fraud suspicion

Incorrect information

Fake listing

Scam attempt

Inappropriate content

Harassment

Duplicate listing

Wrong location

Unavailable property

Other

---

# REPORT DETAIL

Display:

Report reason

Reporter

Reported user

Reported property

Evidence

Timeline

Previous reports

Admin notes

---

# REPORT ACTIONS

Investigate

Contact user

Restrict listing

Suspend user

Resolve

Escalate

---

# REPORT STATUS

New

Investigating

Waiting for information

Escalated

Resolved

Dismissed

---

# 5. VERIFICATION CENTER

Create:

**Verification**

Tabs:

Landlords

Properties

Identity

Pending

Approved

Rejected

---

# VERIFICATION QUEUE

Display:

Applicant

Type

Submitted

Status

Assigned admin

Priority

Actions

---

# VERIFICATION DETAIL

Display:

Information submitted

Documents if applicable

Property information

Verification history

Risk indicators

Admin notes

---

# IMPORTANT PRIVACY RULE

Do not display sensitive verification documents unnecessarily.

Only authorized roles should access sensitive information.

Use a secure document viewer concept.

Show:

**Restricted information**

when access is unavailable.

---

# VERIFICATION ACTIONS

Approve

Reject

Request more information

Escalate

---

# REJECTION

Require:

Reason

Notes

---

# 6. SUSPICIOUS ACTIVITY

Create:

**Safety Center**

Potential signals:

Repeated duplicate listings

Unusual account behavior

Multiple reports

Rapid listing changes

Suspicious contact behavior

Unusual login activity

Do not label users as criminals based only on automated signals.

Use:

**Review recommended**

instead of:

**Fraud confirmed**

---

# RISK REVIEW

Create:

**Activity requires review**

Display:

Reason

Signal

Affected account

Related properties

Related reports

History

Actions:

Review

Dismiss signal

Escalate

---

# 7. DUPLICATE LISTINGS

Create duplicate detection concept.

Example:

**Possible duplicate listings**

Property A

Property B

Similarity indicators:

Location

Photos

Description

Price

Landlord

Admin actions:

Compare

Confirm duplicate

Not duplicate

---

# 8. CONTENT MODERATION

Create:

**Content**

Tabs:

Property descriptions

Photos

Neighborhood information

Help content

Reported content

---

# CONTENT REVIEW

Actions:

Approve

Edit

Request changes

Remove

---

# 9. NEIGHBORHOOD MANAGEMENT

Create:

**Neighborhoods**

Manage Addis Ababa areas.

Fields:

Name

Sub-city

Description

Map boundary

Visibility

Property count

---

# NEIGHBORHOOD DETAIL

Display:

Neighborhood name

Description

Map

Properties

Listings

Status

Actions:

Edit

Hide

Show

---

# IMPORTANT DATA RULE

Do not invent neighborhood statistics.

Only display real data once connected to the backend.

Use placeholder/demo data in the Figma design.

---

# 10. PROPERTY CATEGORIES

Create:

**Property categories**

Examples:

Apartment

House

Studio

Villa

Shared accommodation

Other

Actions:

Create

Edit

Deactivate

---

# 11. AMENITY MANAGEMENT

Create:

**Amenities**

Groups:

Essential

Building

Security

Lifestyle

Other

Allow admins to:

Add

Edit

Deactivate

Reorder

---

# 12. ADMIN ANALYTICS

Create:

**Analytics**

Sections:

Marketplace

Users

Listings

Engagement

Search

Conversion

Safety

---

# MARKETPLACE ANALYTICS

Metrics:

New users

Active users

New listings

Active listings

Inquiries

Viewings

Rented properties

---

# USER ANALYTICS

Show:

Tenant registrations

Landlord registrations

Verified users

Active users

Retention

---

# LISTING ANALYTICS

Show:

New listings

Approved

Rejected

Active

Paused

Rented

Average time to approval

---

# SEARCH ANALYTICS

Display:

Most searched neighborhoods

Most requested property types

Popular price ranges

Common bedroom requirements

Search-to-property-view rate

Only show real metrics once available.

---

# CONVERSION FUNNEL

Create:

Search

Property view

Save

Inquiry

Viewing

Rental outcome

Use a simple funnel visualization.

---

# SAFETY ANALYTICS

Display:

Reports

Resolved reports

Average resolution time

Suspended users

Rejected listings

Verification outcomes

---

# 13. ADMIN MESSAGES

Create an admin communication center.

Categories:

Support

Reports

Moderation

System

Do not build the complete tenant-landlord messaging interface here.

Admin can access a conversation when required for support or moderation.

---

# SUPPORT CASE

Create:

Case ID

User

Category

Priority

Assigned admin

Status

Created

Last updated

---

# SUPPORT STATUS

Open

In progress

Waiting for user

Resolved

Closed

---

# 14. CONTENT / CMS

Create:

**Content Management**

Manage:

Homepage sections

Featured neighborhoods

Help articles

FAQ

Announcements

Educational content

---

# HOMEPAGE CONTENT

Allow authorized admin to manage:

Featured properties

Featured neighborhoods

Promotional sections

Do not allow unapproved admins to publish arbitrary content.

---

# ANNOUNCEMENTS

Create:

Title

Message

Audience

Start date

End date

Status

Draft

Scheduled

Published

Expired

---

# 15. AUDIT LOGS

Create:

**Audit Logs**

This is an important enterprise feature.

Every important administrative action should be traceable.

Columns:

Timestamp

Admin

Action

Entity

Entity ID

Previous state

New state

IP/device concept

---

# AUDIT LOG DETAIL

Example:

**Property approved**

Admin:

Operations Admin

Property:

AK-10293

Previous:

Pending Review

New:

Active

Time:

21 Aug 2026 · 14:32

---

# AUDIT FILTERS

Filter by:

Admin

Action

Entity

Date

Role

Status

---

# 16. ADMIN ROLES & PERMISSIONS

Create:

**Roles & Permissions**

Roles:

Super Admin

Operations Admin

Verification Admin

Support Admin

Content Admin

---

# PERMISSION MATRIX

Permissions:

View users

Manage users

Review listings

Approve listings

Verification

Reports

Content

Analytics

System settings

Audit logs

---

# PERMISSION UI

Use checkboxes or toggles.

Make dangerous permissions visually distinct.

Show:

**This permission gives access to sensitive user information.**

---

# 17. SYSTEM SETTINGS

Create:

**System Settings**

Categories:

General

Marketplace

Verification

Notifications

Security

Privacy

Search

Maps

AI

---

# MARKETPLACE SETTINGS

Examples:

Listing expiration

Availability reminders

Moderation mode

Verification requirements

Search visibility

---

# NOTIFICATION SETTINGS

Configure:

Email

Push

In-app

SMS if later supported

---

# SECURITY SETTINGS

Create:

Admin session timeout

2FA requirement

Login protection

Admin access logs

---

# 18. ADMIN PROFILE

Create:

Profile

Name

Email

Role

Last login

Security status

---

# ADMIN SECURITY

Show:

Two-factor authentication

Active sessions

Recent login activity

Password/security settings

---

# 19. ADMIN NOTIFICATIONS

Create:

Pending listing

Urgent report

Verification request

System issue

Security alert

Use priority labels.

---

# 20. GLOBAL SEARCH

Create a powerful admin search.

Search across:

Users

Properties

Reports

Listings

Cases

Property IDs

User IDs

---

# SEARCH RESULT

Example:

**Search results for "AK-10293"**

Property

Landlord

Reports

Activity

Clicking should open the relevant entity.

---

# 21. ADMIN COMMAND CENTER

Create an optional quick-action area.

Actions:

Review listings

Review reports

Verify users

Search users

Create announcement

Open analytics

---

# 22. BULK ACTIONS

Create safe bulk-management controls.

Examples:

Select listings

Approve selected

Reject selected

Pause selected

Assign selected

Important:

Bulk destructive actions require confirmation.

---

# 23. ADMIN FILTERS

All tables should support:

Search

Filter

Sort

Pagination

Column visibility where appropriate

Export where appropriate

---

# 24. ADMIN TABLE STATES

Create:

Loading

Empty

No results

Error

Permission denied

Offline

---

# 25. PERMISSION DENIED

Screen:

**You don't have permission to access this area.**

Supporting:

**Contact a system administrator if you believe this is incorrect.**

CTA:

**Return to dashboard**

---

# 26. EMPTY ADMIN DASHBOARD

If there are no urgent tasks:

**Everything looks good.**

Supporting:

**There are no outstanding moderation tasks right now.**

Do not create fake activity.

---

# 27. RESPONSIVE DESIGN

Create:

Desktop:

1440px

Tablet:

768px

Mobile:

390px

Admin dashboards may use horizontal tables on mobile where necessary, but optimize the most important actions.

---

# MOBILE ADMIN

Prioritize:

Needs attention

Reports

Pending listings

Verification

Users

Notifications

Do not attempt to fit large desktop tables into a tiny screen.

Use:

Cards

Expandable rows

Horizontal scrolling where appropriate

---

# 28. ACCESSIBILITY

Support:

Keyboard navigation

Focus states

Screen readers

Accessible forms

Accessible tables

Clear labels

High contrast

Non-color status indicators

Confirmation dialogs

Error recovery

---

# 29. SECURITY UX

Admin actions should communicate risk.

For sensitive actions:

Require confirmation.

For destructive actions:

Require reason.

For highly privileged actions:

Require additional confirmation where appropriate.

Never create hidden administrative behavior.

---

# 30. REUSABLE COMPONENTS

Create:

AdminLayout

AdminSidebar

AdminTopbar

AdminSearch

AttentionCenter

MetricCard

DataTable

FilterBar

Pagination

StatusBadge

UserCard

PropertyModerationCard

VerificationCard

ReportCard

CaseCard

ReviewPanel

AuditLogTable

PermissionMatrix

AnalyticsCard

Chart

ConfirmationModal

DangerModal

EmptyState

ErrorState

PermissionDenied

SkeletonLoader

---

# 31. DESIGN STATES

Create:

Default

Hover

Focus

Selected

Loading

Empty

Error

Success

Warning

Urgent

Disabled

Permission denied

Pending

Approved

Rejected

Suspended

Resolved

---

# 32. ADMIN INFORMATION HIERARCHY

Priority:

1. Needs attention
2. Moderation
3. Verification
4. Reports
5. Users
6. Listings
7. Marketplace analytics
8. Content
9. System
10. Audit logs

Do not make analytics more important than operational work.

---

# 33. TRUST PRINCIPLES

Never present automated risk signals as confirmed fraud.

Use:

Potential issue

Review recommended

Reported

Under investigation

Confirmed violation

Only authorized staff should confirm violations.

---

# 34. FINAL OUTPUT

Create complete desktop and mobile screens for:

## Dashboard

Admin Home

Attention Center

Marketplace Overview

---

## Users

User List

User Detail

Suspend

Ban

Verification

---

## Properties

Property List

Moderation Queue

Property Review

Approve

Reject

Request Changes

---

## Reports

Report List

Report Detail

Investigation

Resolution

---

## Verification

Verification Queue

Verification Detail

Approval

Rejection

Request Information

---

## Safety

Suspicious Activity

Duplicate Listings

Safety Review

---

## Content

CMS

Neighborhoods

Categories

Amenities

Announcements

---

## Analytics

Marketplace

Users

Listings

Search

Conversion

Safety

---

## Support

Cases

Case Detail

Admin Communication

---

## Administration

Roles

Permissions

System Settings

Admin Profile

Audit Logs

---

## States

Loading

Empty

Error

Permission Denied

Success

Warning

Urgent

Pending

Approved

Rejected

Suspended

Resolved

Use the existing Addis Kiray visual language.

Do NOT redesign:

* public website
* tenant experience
* landlord experience
* property details
* authentication
* search

Do not build:

* backend
* real AI
* real payment processing
* complete real-time messaging
* database

Those will come later.

This step is exclusively the **Addis Kiray Admin & Operations Experience**.
