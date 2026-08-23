# Addis Kiray — Messaging + Notifications Experience

Continue the existing Addis Kiray design system.

Do NOT redesign:

* homepage
* search
* map
* property details
* authentication
* tenant dashboard
* landlord dashboard
* admin dashboard
* Addis AI

Create the complete communication experience for Addis Kiray.

The communication system connects:

Tenant ↔ Landlord

and integrates with:

Properties

Inquiries

Viewings

Notifications

AI assistance

Safety/reporting

The messaging experience should feel:

* simple
* trustworthy
* familiar
* responsive
* calm
* professional
* mobile-first
* contextual

Do not make it feel like a generic social media messenger.

The primary purpose is helping renters and landlords communicate about real rental properties.

---

# 1. MESSAGE ENTRY POINTS

Users can start communication from:

Property Details

Search Results

Saved Homes

Tenant Dashboard

Viewing Requests

Landlord Dashboard

Inquiries

Notifications

---

# 2. CONTACT LANDLORD

On property details create:

**Contact Landlord**

Primary CTA.

Secondary:

**Request a Viewing**

---

# CONTACT LANDLORD FLOW

When clicked:

Open message composer.

Show property context at top.

Example:

**Modern Two-Bedroom Apartment**

Bole, Addis Ababa

42,000 ETB / month

[View Property]

---

# 3. MESSAGE COMPOSER

Create:

Text input

Send button

Emoji option

Attachment option

AI assistance option

Do not overcrowd the composer.

Placeholder:

**Ask the landlord about this property...**

---

# QUICK QUESTIONS

Display useful predefined prompts:

**Is this still available?**

**Can I schedule a viewing?**

**Is parking available?**

**How much is the deposit?**

**When can I move in?**

**Are utilities included?**

These should create editable messages.

Do not automatically send them.

---

# 4. CONVERSATION SCREEN

Create desktop conversation screen.

Desktop:

1440px.

Structure:

Left:

Conversation list

Center:

Active conversation

Right:

Property context

---

# LEFT SIDEBAR

Title:

**Messages**

Search conversations.

Tabs:

All

Unread

Viewing

---

# CONVERSATION LIST ITEM

Display:

Profile image

Name

Property title

Last message

Time

Unread count

Status

Example:

**Abebe Tesfaye**

Modern 2 Bedroom Apartment

"Yes, Saturday works..."

10:42 AM

2

---

# CONVERSATION STATUS

Unread

Active

Awaiting reply

Viewing requested

Viewing confirmed

Closed

Reported

---

# 5. ACTIVE CONVERSATION

Header:

Profile image

Name

Online status if available

Property title

Actions:

View Property

More

---

# PROPERTY CONTEXT HEADER

Display:

Property image

Property title

Location

Price

Status

CTA:

**View Property**

Keep this compact.

---

# 6. MESSAGE BUBBLES

Create:

Sent message

Received message

Timestamp

Read status

Do not rely on color alone.

---

# MESSAGE STATES

Sending

Sent

Delivered

Read

Failed

---

# FAILED MESSAGE

Show:

**Message couldn't be sent**

Action:

**Retry**

Do not silently lose the message.

---

# 7. TYPING INDICATOR

Create:

**Abebe is typing...**

Use subtle animated dots.

Do not show typing indicators if technically unavailable.

---

# 8. ONLINE STATUS

Possible states:

Online

Active recently

Offline

Do not imply exact activity if the system does not support it.

---

# 9. PROPERTY CONTEXT PANEL

Right side desktop panel.

Show:

Property image

Title

Location

Price

Bedrooms

Bathrooms

Availability

Verification status

CTA:

View Property

Request Viewing

---

# 10. CONVERSATION PROPERTY STATES

If property becomes rented:

Display:

**This property is no longer available.**

Keep conversation history accessible.

---

# PROPERTY PAUSED

Display:

**This listing is currently paused.**

---

# PROPERTY DELETED

Display:

**This listing is no longer available.**

Do not remove the conversation automatically.

---

# 11. VIEWING REQUEST FROM CHAT

Inside conversation:

Button:

**Request a Viewing**

Open viewing request interface.

---

# REQUEST VIEWING

Fields:

Date

Preferred time

Alternative time

Message

CTA:

**Send Request**

---

# 12. VIEWING REQUEST CARD

Inside conversation show:

**Viewing request**

Property

Date

Time

Status

Actions

---

# VIEWING STATUS

Pending

Confirmed

Alternative suggested

Declined

Cancelled

Completed

---

# 13. LANDLORD VIEWING RESPONSE

Create actions:

Confirm

Suggest another time

Decline

---

# SUGGEST TIME

Fields:

Date

Time

Message

CTA:

**Suggest New Time**

---

# 14. TENANT VIEWING RESPONSE

When landlord suggests a new time:

Actions:

Accept

Suggest another

Decline

---

# 15. CONFIRMED VIEWING

Create special conversation card:

**Viewing confirmed**

Saturday

10:00 AM

Property:

Modern Two-Bedroom Apartment

Actions:

View property

Add reminder

Message landlord

Cancel viewing

---

# 16. UPCOMING VIEWING

Create tenant and landlord versions.

Show:

Property

Other participant

Date

Time

Status

---

# 17. VIEWING REMINDER

Notification:

**Viewing tomorrow**

Your viewing for the Bole apartment is tomorrow at 10:00 AM.

CTA:

View details

---

# 18. CANCEL VIEWING

Confirmation:

**Cancel this viewing?**

Actions:

Cancel viewing

Keep viewing

Optional reason:

Plans changed

Property unavailable

Cannot attend

Other

---

# 19. RESCHEDULE

Create:

**Reschedule viewing**

Select:

Date

Time

Message

---

# 20. COMPLETE VIEWING

After viewing:

Tenant:

**How did the viewing go?**

Options:

Interested

Maybe

Not interested

Landlord:

**Viewing completed**

Action:

Mark completed

Do not force users to provide feedback.

---

# 21. MESSAGE SEARCH

Create message search.

Search:

Person

Property

Message content

---

# 22. MESSAGE FILTERS

Filters:

Unread

Viewing requests

Active

Archived

Reported

---

# 23. ARCHIVE CONVERSATION

Action:

**Archive**

Supporting:

**This conversation will move out of your active inbox.**

Do not delete the conversation.

---

# 24. RESTORE CONVERSATION

Archived conversation:

**Move to inbox**

---

# 25. DELETE MESSAGE

Create message action menu.

Options:

Copy

Reply

Report

Delete for me

Only provide "delete for everyone" if the backend actually supports it.

---

# 26. REPORT MESSAGE

Create:

**Report message**

Reasons:

Scam

Harassment

Inappropriate content

Suspicious request

Other

Allow optional explanation.

CTA:

**Submit report**

---

# 27. BLOCK USER

Create:

**Block this user?**

Supporting:

**You won't receive new messages from this user.**

Actions:

Block

Cancel

---

# 28. BLOCKED USER STATE

Conversation:

**You blocked this user.**

Action:

**Unblock**

Do not allow sending messages while blocked.

---

# 29. SAFETY WARNING

If conversation contains suspicious behavior or platform safety triggers:

Show subtle warning:

**Stay safe**

Supporting:

**Never send money before confirming the property and rental terms.**

CTA:

**Safety tips**

Do not make automated accusations.

---

# 30. PHONE NUMBER SHARING

Do not automatically expose private contact information.

If users choose to share a phone number:

Display:

**You're about to share your phone number.**

Supporting:

**Only share contact information when you're comfortable doing so.**

Actions:

Share

Cancel

---

# 31. EXTERNAL PAYMENT WARNING

If a message contains a suspicious payment request:

Create safety concept:

**Be careful with payment requests**

Supporting:

**Verify the property and rental terms before sending money.**

CTA:

**Learn about rental safety**

Do not claim the message is definitely fraudulent unless confirmed.

---

# 32. ATTACHMENTS

Create attachment support.

Possible types:

Images

PDF documents

Other allowed files

Composer:

Attach

Preview

Remove

Send

---

# ATTACHMENT STATES

Uploading

Uploaded

Failed

Retry

Removed

---

# 33. IMAGE ATTACHMENT

Preview image before sending.

Allow:

Remove

Send

---

# 34. FILE LIMIT ERROR

Display:

**This file can't be uploaded.**

Explain the reason clearly.

Example:

**File type isn't supported.**

or

**File is too large.**

---

# 35. MESSAGE EMPTY STATE

When there are no conversations:

**No messages yet**

Supporting:

**When you contact a landlord or receive an inquiry, your conversations will appear here.**

Tenant CTA:

**Find a home**

Landlord CTA:

**View inquiries**

---

# 36. NEW MESSAGE INDICATOR

Navigation should show:

Messages

with unread count.

Example:

Messages · 3

Do not overuse notification badges.

---

# 37. NOTIFICATION SYSTEM

Create centralized notification center.

Header:

**Notifications**

Tabs:

All

Unread

---

# NOTIFICATION TYPES

Messages

Viewing requests

Viewing confirmations

Property updates

Listing status

Saved property updates

Verification

Security

System

---

# 38. NOTIFICATION CARD

Display:

Icon

Title

Description

Time

Unread indicator

Action

Example:

**New message**

Abebe replied about your Bole apartment.

**10 minutes ago**

---

# 39. NOTIFICATION PRIORITY

Normal

Important

Security

Do not make every notification urgent.

---

# 40. NOTIFICATION ACTIONS

Mark as read

Mark all as read

Delete notification

Open related item

---

# 41. MARK ALL READ

Action:

**Mark all as read**

Confirmation should not be necessary.

---

# 42. NOTIFICATION DEEP LINKS

Notifications should open the correct destination.

Examples:

New message → conversation

Viewing request → viewing

Listing approved → property

Listing rejected → listing editor

Verification → verification center

Property update → property

---

# 43. NOTIFICATION PREFERENCES

Create settings:

In-app notifications

Email notifications

Push notifications

SMS notifications if later supported

---

# PREFERENCE CATEGORIES

Messages

Viewings

Listings

Saved homes

Verification

Security

Marketing

---

# 44. NOTIFICATION FREQUENCY

Options where appropriate:

Instant

Daily summary

Off

Security notifications should not be disabled if required for account safety.

---

# 45. EMAIL NOTIFICATION PREVIEW

Create conceptual email templates.

Examples:

New message

Viewing confirmed

Listing approved

Listing needs changes

Verification update

---

# 46. EMAIL TEMPLATE

Header:

Addis Kiray

Title

Message

Primary CTA

Footer:

Notification preferences

Safety information

---

# 47. MOBILE MESSAGES

Create complete mobile messaging experience.

Width:

390px.

Structure:

Header

Conversation

Property context

Messages

Composer

---

# MOBILE MESSAGE HEADER

Back

Profile

Property title

More

---

# MOBILE PROPERTY CONTEXT

Use expandable property card.

Collapsed:

Property title

Price

View

Expanded:

Image

Location

Facts

Availability

---

# MOBILE COMPOSER

Bottom sticky:

Attachment

Text field

Send

Optional AI assistant

---

# MOBILE VIEWING REQUEST

Use bottom sheet.

Fields:

Date

Time

Message

Send Request

---

# MOBILE NOTIFICATIONS

Create:

Notification list

Unread indicators

Filter

---

# 48. AI MESSAGE ASSISTANT

Integrate Addis AI.

Button:

**Help me reply**

Example:

Incoming:

**Can I visit Saturday morning?**

AI suggestions:

**Yes, Saturday morning works. What time would you prefer?**

**Saturday works. Would 10:00 AM be convenient?**

Actions:

Use

Edit

Regenerate

Never send automatically.

---

# 49. AI SAFETY ASSISTANT

If user asks:

**Is this payment request safe?**

AI should provide cautious guidance.

UI label:

**AI guidance**

Never present AI as a fraud authority.

---

# 50. LANDLORD QUICK REPLIES

Create optional templates:

**Yes, it's available.**

**Would you like to schedule a viewing?**

**What day works for you?**

**The property is currently unavailable.**

Templates should be editable.

---

# 51. TENANT QUICK REPLIES

Examples:

**Is this still available?**

**Can I schedule a viewing?**

**What is the deposit?**

**When can I move in?**

---

# 52. CONVERSATION DETAILS

Create details panel:

Participant

Property

Viewing history

Shared media

Report

Block

Archive

---

# 53. SHARED MEDIA

Show:

Images

Documents

Links

Only if the platform stores these safely.

---

# 54. CONVERSATION ACTIVITY

Timeline:

Conversation started

Viewing requested

Viewing confirmed

Property status changed

Viewing completed

Keep important events visually distinct from normal messages.

---

# 55. REAL-TIME STATES

Design:

Connecting

Connected

Reconnecting

Offline

Message queued

---

# OFFLINE

Display:

**You're offline**

Messages may be queued.

Do not falsely show a message as delivered when it has not reached the server.

---

# 56. RECONNECTING

Display subtle:

**Reconnecting…**

Messages should retry safely.

---

# 57. MESSAGE DELIVERY STATES

Design icons for:

Sending

Sent

Delivered

Read

Failed

Use tooltips/accessibility labels.

---

# 58. RATE LIMIT / SPAM UX

If a user sends too many messages:

Show:

**Please wait before sending another message.**

Do not expose technical rate-limit details.

---

# 59. CONVERSATION CLOSED

Example:

Property rented.

Display:

**This conversation is closed because the property is no longer available.**

Still allow:

View history

Safety report

---

# 60. ADMIN MODERATION ACCESS

Admin can access reported conversations where policy allows.

Create:

Conversation

Report context

Moderation actions

Do not expose private conversations to admins without appropriate authorization.

---

# 61. ADMIN MODERATION

Actions:

Review

Restrict

Report resolution

Suspend user

Escalate

---

# 62. PRIVACY

Create clear UI around:

Message privacy

Blocking

Reporting

Contact sharing

Data controls

Do not claim end-to-end encryption unless implemented.

---

# 63. ACCESSIBILITY

Support:

Keyboard navigation

Focus states

Screen readers

Accessible timestamps

Accessible message status

Accessible notifications

Large touch targets

---

# 64. COMPONENTS

Create reusable:

MessagingLayout

ConversationList

ConversationItem

ConversationHeader

MessageBubble

MessageComposer

MessageStatus

TypingIndicator

OnlineStatus

PropertyContextCard

ViewingRequestCard

ViewingStatus

QuickReply

AttachmentUploader

AttachmentPreview

SafetyBanner

ReportMessageModal

BlockUserModal

NotificationCenter

NotificationItem

NotificationBadge

NotificationPreferences

AIReplyAssistant

ConversationDetails

ActivityTimeline

EmptyState

ErrorState

OfflineState

---

# 65. DESIGN STATES

Create:

Default

Hover

Focus

Selected

Unread

Read

Sending

Sent

Delivered

Read

Failed

Typing

Offline

Reconnecting

Blocked

Reported

Archived

Closed

---

# 66. FINAL OUTPUT

Create complete desktop and mobile screens for:

## Messaging

Inbox

Conversation List

Conversation

Conversation Details

Search

Filters

Archive

---

## Property Communication

Property Context

Contact Landlord

Quick Questions

Property Status

---

## Viewing

Request Viewing

Viewing Request

Confirm

Suggest New Time

Accept

Decline

Reschedule

Cancel

Completed

---

## Notifications

Notification Center

Notification Detail

Unread

Read

Preferences

---

## Safety

Report

Block

Safety Warning

Payment Warning

---

## Attachments

Image

File

Uploading

Failed

Retry

---

## AI

Help Me Reply

AI Reply Suggestions

AI Safety Guidance

---

## Real-Time

Connecting

Connected

Reconnecting

Offline

Sending

Delivered

Read

Failed

---

# FINAL DESIGN PRINCIPLE

Messaging should always remain connected to the rental journey.

The user should never lose context about:

Who they're talking to

Which property they're discussing

Whether the property is available

Whether a viewing is scheduled

What the next action is

The communication experience should move users toward:

**Question → Conversation → Viewing → Decision**

not simply create endless chat.
