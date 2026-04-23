# Security Specification: EpiMind AI

## 1. Data Invariants
- A `Case` must have a `userId` matching the authenticated user.
- A `Case` timestamp must be the server time.
- `User` roles cannot be self-assigned or modified by the user.
- `Alerts` are read-only for standard users.

## 2. The Dirty Dozen Payloads

| # | Attack Vector | Payload/Action | Expected Result |
|---|---|---|---|
| 1 | Identity Spoofing | Create Case with `userId: "other_user"` | PERMISSION_DENIED |
| 2 | Privilege Escalation | Update User with `role: "admin"` | PERMISSION_DENIED |
| 3 | Orphaned Record | Create Case with ID `../../secrets` | PERMISSION_DENIED |
| 4 | Resource Exhaustion | Create Case with 10MB `description` | PERMISSION_DENIED |
| 5 | System Tampering | Create `Alert` as standard user | PERMISSION_DENIED |
| 6 | PII Leak | List `/users/` as standard user | PERMISSION_DENIED |
| 7 | Data Poaching | Get Case where `userId != auth.uid` | PERMISSION_DENIED |
| 8 | Timestamp Fraud | Create Case with `timestamp: "1990-01-01"` | PERMISSION_DENIED |
| 9 | Field Injection | Create User with extra `isPro: true` field | PERMISSION_DENIED |
| 10| Update Gap | Update User profile but change `email` | PERMISSION_DENIED |
| 11| Unauthorized Delete | Delete Case as standard user | PERMISSION_DENIED |
| 12| Spoofing Verification| Write to Case as unverified user | PERMISSION_DENIED |

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` will verify these scenarios using the Firebase Emulators.
