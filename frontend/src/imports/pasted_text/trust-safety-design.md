# Addis Kiray — Verification, Trust & Safety Experience

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
* messaging

Create the complete Verification, Trust and Safety experience for Addis Kiray.

The purpose is to help users:

* understand who they are dealing with
* understand what has been verified
* identify missing information
* report suspicious behavior
* make safer rental decisions
* understand verification status
* access safety guidance

The design must NOT imply that verification guarantees safety.

Avoid phrases like:

"100% safe"

"Guaranteed landlord"

"Guaranteed property"

"Fraud-free"

"AI verified as legitimate"

Instead use:

"Identity verified"

"Contact verified"

"Property information submitted"

"Under review"

"Verification pending"

"Reported"

"Information not verified"

"Review recommended"

---

# 1. TRUST SYSTEM OVERVIEW

Create a conceptual Trust & Safety system.

Trust signals should include:

Identity

Phone

Email

Landlord profile

Property information

Property verification

Listing history

Reports

Account activity

---

# 2. LANDLORD TRUST PROFILE

On landlord profile display:

Profile photo

Name

Member since

Listings

Response rate if real data exists

Response time if real data exists

Verification badges

---

# VERIFICATION BADGES

Possible badges:

Identity verified

Phone verified

Email verified

Property verified

Profile complete

---

# BADGE RULE

Never display a badge unless the corresponding verification actually happened.

---

# 3. IDENTITY VERIFIED

Create badge:

**Identity verified**

Supporting:

**This account completed the Addis Kiray identity verification process.**

Do not display sensitive identity documents publicly.

---

# 4. PHONE VERIFIED

Badge:

**Phone verified**

Supporting:

**A phone number associated with this account has been verified.**

Do not expose the full private phone number.

---

# 5. EMAIL VERIFIED

Badge:

**Email verified**

Supporting:

**The email address associated with this account has been verified.**

---

# 6. PROPERTY VERIFIED

Create property badge:

**Property verified**

Supporting:

**This listing completed the Addis Kiray property verification process.**

Do not claim ownership unless ownership was actually verified.

---

# 7. PROPERTY VERIFICATION DETAIL

When user clicks:

Open:

**Property verification**

Sections:

Information submitted

Verification status

Last reviewed

Verification type

---

# VERIFICATION TYPES

Design support for:

Identity verification

Contact verification

Property information review

Location confirmation

Document review where applicable

Admin review

Do not imply every property uses every verification method.

---

# 8. PROPERTY VERIFICATION STATUS

States:

Not verified

Verification pending

Partially verified

Verified

Needs review

Rejected

Expired

---

# 9. TRUST SUMMARY ON PROPERTY

On property details create:

**Trust & safety**

Display:

Identity verified

Phone verified

Property verification status

Listing information completeness

Report status if appropriate

---

# 10. TRUST DETAILS

Expandable section:

**What we know**

Identity:

Verified

Contact:

Verified

Property:

Under review

---

# 11. INFORMATION MISSING

Create:

**Information you may want to confirm**

Examples:

Deposit

Utility costs

Lease terms

Parking

Water availability

Internet

Exact availability

Use:

**Not specified in this listing**

Never invent information.

---

# 12. LANDLORD VERIFICATION FLOW

Create complete flow.

Step 1:

**Verify your identity**

Supporting:

**Verification helps renters understand who they're communicating with.**

---

# STEP 2

Collect basic information.

Name

Date of birth if required by actual verification provider

Country

Contact information

Do not unnecessarily request sensitive data.

---

# STEP 3

Verification method.

Design a conceptual secure verification process.

Possible:

Government ID

Supported identity provider

Other approved verification mechanism

Do not specify a provider unless actually implemented.

---

# STEP 4

Verification processing.

State:

**Verification in progress**

Supporting:

**This may take some time. We'll notify you when the review is complete.**

---

# STEP 5

Verification result.

Success:

**Identity verified**

Failure:

**We couldn't verify your identity**

Provide:

Reason category

Next steps

Retry where appropriate

Support

---

# 13. VERIFICATION PRIVACY

Create privacy explanation:

**Your verification information is protected.**

Explain:

Verification information is not displayed publicly.

Only authorized systems/admins should access sensitive verification information.

Use secure storage when implemented.

---

# 14. LANDLORD PROPERTY VERIFICATION

Create flow:

Start verification

Select property

Confirm property details

Provide required evidence

Submit

Under review

Result

---

# 15. PROPERTY VERIFICATION FORM

Fields conceptually:

Property address

Property type

Unit details

Availability

Rental terms

Supporting evidence if required

---

# 16. PROPERTY VERIFICATION RESULT

Success:

**Property verification completed**

Supporting:

**The listing passed the current Addis Kiray verification checks.**

Do not say:

"Property is guaranteed legitimate."

---

# 17. VERIFICATION EXPIRATION

Create state:

**Verification needs renewal**

Supporting:

**Some verification information may need to be updated.**

CTA:

**Update verification**

---

# 18. TENANT TRUST EXPERIENCE

Create:

**Safety Center**

Main entry point from:

Tenant dashboard

Property details

Messaging

Viewing

Profile

---

# 19. SAFETY CENTER

Header:

**Stay safe while renting**

Sections:

Before contacting

Before viewing

Before paying

During the rental process

Report a problem

---

# 20. BEFORE CONTACTING

Safety tips:

Review landlord profile

Check listing details

Look for verification signals

Be cautious of unrealistic offers

Keep communication on Addis Kiray when possible

---

# 21. BEFORE VIEWING

Checklist:

Confirm property address

Confirm viewing time

Tell someone where you're going

Review property details

Ask questions before traveling

---

# 22. DURING VIEWING

Checklist:

Confirm the property matches the listing

Check utilities

Check water access

Check electricity

Check security

Check parking if relevant

Ask about lease terms

Ask about deposit

---

# 23. BEFORE PAYING

Important screen:

**Before you send money**

Show:

Confirm who you're paying

Confirm property availability

Review rental agreement

Understand deposit terms

Ask for documentation where appropriate

Avoid pressure to pay immediately

---

# 24. PAYMENT WARNING

Create warning:

**Be careful with payment requests**

Supporting:

**Don't send money simply because someone asks for it. Confirm the property, rental terms and recipient first.**

CTA:

**Safety checklist**

---

# 25. URGENCY WARNING

Create warning concept:

**Take your time**

Supporting:

**Be cautious if someone pressures you to pay immediately or refuses reasonable questions.**

---

# 26. OFF-PLATFORM WARNING

If user tries to move communication outside Addis Kiray:

Display:

**Stay cautious**

Supporting:

**Keeping important rental communication on Addis Kiray can make it easier to keep track of the conversation and report problems.**

Do not prohibit external communication unless the platform policy actually requires it.

---

# 27. REPORT PROPERTY

Property page action:

**Report this listing**

Reasons:

Fake listing

Incorrect information

Suspicious price

Wrong location

Property unavailable

Duplicate listing

Scam concern

Inappropriate content

Other

---

# 28. REPORT USER

User profile action:

**Report user**

Reasons:

Suspicious behavior

Harassment

Scam concern

Misleading information

Inappropriate behavior

Other

---

# 29. REPORT FLOW

Step 1:

Select reason.

Step 2:

Provide optional details.

Step 3:

Attach evidence if supported.

Step 4:

Review.

Step 5:

Submit.

---

# 30. REPORT CONFIRMATION

Success:

**Report submitted**

Supporting:

**Thanks for helping keep Addis Kiray safe.**

Show:

Report ID

Status:

Received

---

# 31. REPORT STATUS

Users can view:

Submitted

Under review

Need more information

Resolved

Closed

---

# 32. REPORT DETAIL

Display:

Report ID

Submitted date

Category

Status

Summary

Updates

Do not expose confidential moderation information.

---

# 33. EVIDENCE UPLOAD

Allow:

Images

Screenshots

Documents where appropriate

Create:

Upload

Preview

Remove

Submit

---

# 34. EVIDENCE PRIVACY

Display:

**Only share information relevant to your report.**

Do not encourage users to upload unnecessary sensitive personal information.

---

# 35. SUSPICIOUS LISTING SIGNALS

Create subtle UI indicators.

Examples:

**Information incomplete**

**Recently created**

**Multiple details need confirmation**

**Listing under review**

Do not call a listing fraudulent solely because of these signals.

---

# 36. REVIEW RECOMMENDED

Create neutral warning:

**Review recommended**

Supporting:

**Some information may need additional confirmation.**

CTA:

**See details**

---

# 37. REPORTED LISTING

If appropriate:

**This listing has been reported and is currently under review.**

Do not expose who reported it.

---

# 38. LISTING RESTRICTION

If admin restricts listing:

**This listing is temporarily unavailable while we review it.**

Do not expose internal investigation details.

---

# 39. LANDLORD ACCOUNT RESTRICTION

If account restricted:

**Some account features are temporarily unavailable.**

CTA:

**View account status**

Do not expose sensitive moderation information.

---

# 40. ADMIN TRUST CENTER

Create:

**Trust & Safety Dashboard**

Sections:

Verification

Reports

Risk signals

Restricted listings

Restricted users

Cases

---

# 41. ADMIN VERIFICATION QUEUE

Columns:

Applicant

Type

Submitted

Status

Priority

Assigned admin

Actions

---

# 42. ADMIN REPORT QUEUE

Columns:

Report

Entity

Reporter

Category

Priority

Status

Assigned admin

Created

---

# 43. ADMIN REPORT DETAIL

Display:

Report reason

Reported entity

Evidence

Timeline

Previous reports

Internal notes

Actions

---

# 44. ADMIN TRUST ACTIONS

Actions:

Investigate

Request information

Restrict listing

Restrict account

Suspend

Reject verification

Approve verification

Escalate

Resolve

---

# 45. ADMIN INTERNAL NOTES

Create private notes.

Label:

**Internal note**

Important:

These notes must never be visible to normal users.

---

# 46. ADMIN CASE TIMELINE

Display:

Report created

Assigned

Information requested

Evidence received

Action taken

Resolved

---

# 47. TRUST SCORE

Do NOT create a simplistic public numeric trust score such as:

**87/100 SAFE**

Avoid this.

Instead use understandable trust signals.

---

# 48. VERIFICATION LEVEL

If useful, create:

Basic profile

Contact verified

Identity verified

Property verified

Multiple verification signals

Explain what each level means.

---

# 49. TRUST PROFILE

Create:

**About this landlord**

Sections:

Member since

Listings

Verification

Response information if sufficient data exists

Reported/restricted status should not be publicly exposed unless policy requires it.

---

# 50. PROFILE COMPLETENESS

Create:

**Profile completeness**

Examples:

Photo

Bio

Contact verification

Listing information

Do not equate profile completeness with trustworthiness.

---

# 51. SAFETY EDUCATION

Create educational cards:

How to identify suspicious listings

Safe viewing checklist

Before sending money

How to report a problem

Questions to ask a landlord

---

# 52. SAFETY CHECKLIST

Interactive checklist:

Before contacting

Before viewing

Before paying

Before signing

---

# 53. AI SAFETY ASSISTANT

Integrate Addis AI.

Entry:

**Ask Addis AI about rental safety**

Examples:

**What should I check before paying a deposit?**

**What questions should I ask during a viewing?**

**Does this listing have missing information?**

AI responses must clearly be:

**General guidance**

and not legal or financial guarantees.

---

# 54. AI LISTING SAFETY REVIEW

On property details:

Button:

**Review this listing with Addis AI**

AI can summarize:

Available information

Missing information

Questions to ask

Potential inconsistencies if detectable from available data

Never say:

"Scam"

unless based on confirmed platform evidence and handled through proper moderation.

---

# 55. AI TRANSPARENCY

Show:

**AI guidance**

Supporting:

**AI suggestions are based on information available in Addis Kiray and may not detect every risk.**

---

# 56. VERIFICATION NOTIFICATION

Examples:

**Identity verification approved**

**Property verification needs more information**

**Your report has been received**

**Your report has been resolved**

---

# 57. LANDLORD NOTIFICATIONS

Examples:

**Complete your profile**

**Property verification required**

**Verification approved**

**Additional information requested**

---

# 58. SECURITY NOTIFICATIONS

Examples:

New login

Password changed

Email changed

Phone changed

Security settings changed

---

# 59. ACCOUNT SECURITY CENTER

Create:

**Security**

Sections:

Password

Two-factor authentication

Active sessions

Login history

Connected devices

---

# 60. ACTIVE SESSIONS

Display:

Device

Location approximation if actually available

Last active

Current session

Action:

Sign out

Do not show precise location unless legitimately available and necessary.

---

# 61. LOGIN HISTORY

Display:

Date

Device

Approximate location

Success/failure

---

# 62. TWO-FACTOR AUTHENTICATION

Create:

Enable 2FA

Verification

Backup codes concept

Recovery

Do not claim implementation yet.

---

# 63. ACCOUNT COMPROMISE

Create:

**Something doesn't look right?**

Actions:

Secure account

Change password

Review sessions

Contact support

---

# 64. SUPPORT ESCALATION

Safety center CTA:

**Contact Addis Kiray Support**

Form:

Category

Description

Evidence

Contact preference

---

# 65. EMERGENCY DISCLAIMER

Do not position Addis Kiray as an emergency response service.

If a user faces immediate physical danger, show appropriate generic guidance to contact local emergency services without pretending Addis Kiray can respond directly.

---

# 66. TRUST STATES

Design:

Verified

Partially verified

Pending

Needs review

Reported

Restricted

Suspended

Expired

Not verified

---

# 67. SECURITY STATES

Design:

Secure

Warning

Action required

Session expired

Account locked

Verification required

---

# 68. COMPONENTS

Create reusable:

VerificationBadge

TrustSignal

TrustSummary

VerificationCard

VerificationStatus

VerificationStepper

VerificationResult

SafetyCenter

SafetyCard

SafetyChecklist

SafetyWarning

PaymentWarning

ReportButton

ReportModal

ReportForm

ReportStatus

EvidenceUploader

EvidencePreview

TrustProfile

SecurityCenter

SessionCard

SecurityAlert

AITrustAssistant

AIListingReview

---

# 69. MOBILE EXPERIENCE

Create mobile screens at 390px.

Prioritize:

Trust summary

Verification

Safety Center

Report

Security

Verification status

---

# 70. MOBILE PROPERTY TRUST

Property details should show:

Trust & Safety

Verification badges

Missing information

Report listing

Safety guidance

Use expandable sections.

---

# 71. MOBILE REPORT FLOW

Use:

Bottom sheet

Step-by-step form

Reason

Details

Evidence

Review

Submit

---

# 72. MOBILE SAFETY CENTER

Create cards:

Before contacting

Before viewing

Before paying

Before signing

Report a problem

---

# 73. ACCESSIBILITY

Support:

Keyboard navigation

Screen readers

Clear status text

Non-color indicators

Large touch targets

Accessible warnings

Readable typography

---

# 74. TRUST DESIGN PRINCIPLES

Never equate:

Verification = guaranteed safety

Profile completeness = trustworthy

Old account = trustworthy

AI score = truth

Report = guilt

Risk signal = fraud

Instead communicate evidence and uncertainty clearly.

---

# 75. FINAL OUTPUT

Create complete desktop and mobile screens for:

## Verification

Identity

Phone

Email

Property

Verification Status

Verification Detail

Verification Flow

Verification Result

---

## Trust

Landlord Trust Profile

Property Trust Summary

Trust Details

Verification Badges

Missing Information

---

## Safety

Safety Center

Safety Checklist

Before Contacting

Before Viewing

Before Paying

Before Signing

---

## Reporting

Report Property

Report User

Report Message

Report Form

Evidence Upload

Report Confirmation

Report Status

---

## Security

Security Center

Active Sessions

Login History

2FA

Security Alerts

Account Recovery

---

## Admin

Trust Dashboard

Verification Queue

Report Queue

Report Detail

Case Timeline

Internal Notes

Trust Actions

---

## AI

AI Safety Assistant

AI Listing Review

AI Guidance

---

## States

Verified

Pending

Needs Review

Reported

Restricted

Suspended

Expired

Not Verified

Security Warning

Action Required

Error

Success

---

# FINAL PRINCIPLE

Addis Kiray should not tell users:

**"Trust us."**

It should show users:

**"Here is what we know, here is what has been verified, here is what is missing, and here is how you can protect yourself."**

Trust should be transparent, explainable and evidence-based.
