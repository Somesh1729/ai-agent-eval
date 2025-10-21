# Complete Testing Guide

## Pre-Testing Checklist
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Supabase account created
- [ ] Environment variables set in `.env.local`
- [ ] Database tables created
- [ ] Dev server running (`npm run dev`)

## Test 1: Homepage
**URL**: http://localhost:3000
**Expected**:
- Landing page loads
- Navigation bar visible
- "Sign Up" and "Login" buttons visible
- Features grid displays
- Stats section shows

**Pass/Fail**: ___

## Test 2: Sign Up Flow
**Steps**:
1. Click "Sign Up" button
2. Enter email: test@example.com
3. Enter password: TestPassword123!
4. Repeat password: TestPassword123!
5. Click "Sign up"

**Expected**:
- Form validates
- Account created
- Redirected to success page
- Email confirmation message shown

**Pass/Fail**: ___

## Test 3: Email Confirmation
**Steps**:
1. Check email inbox for confirmation link
2. Click confirmation link
3. Return to app

**Expected**:
- Email confirmed
- Ready to login

**Pass/Fail**: ___

## Test 4: Login Flow
**Steps**:
1. Go to http://localhost:3000/auth/login
2. Enter email: test@example.com
3. Enter password: TestPassword123!
4. Click "Login"

**Expected**:
- Login successful
- Redirected to dashboard
- User data loaded

**Pass/Fail**: ___

## Test 5: Dashboard
**URL**: http://localhost:3000/dashboard
**Expected**:
- KPI cards display (Average Score, Latency, etc.)
- Charts render
- Evaluation table shows
- Search functionality works
- Pagination works

**Pass/Fail**: ___

## Test 6: Settings Page
**URL**: http://localhost:3000/settings
**Steps**:
1. Change run policy
2. Adjust sample rate
3. Set max evaluations
4. Toggle PII obfuscation
5. Click "Save Settings"

**Expected**:
- Settings saved
- Success message shown
- Values persist on reload

**Pass/Fail**: ___

## Test 7: API Endpoint
**URL**: POST http://localhost:3000/api/evals/ingest
**Headers**: 
\`\`\`
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
\`\`\`

**Body**:
\`\`\`json
{
  "interaction_id": "test-123",
  "prompt": "What is 2+2?",
  "response": "4",
  "score": 0.95,
  "latency_ms": 150,
  "flags": ["correct"],
  "pii_tokens_redacted": 0
}
\`\`\`

**Expected**:
- Status 201 (Created)
- Evaluation saved
- Appears in dashboard

**Pass/Fail**: ___

## Test 8: Logout
**Steps**:
1. Click logout button
2. Verify redirected to homepage

**Expected**:
- Session cleared
- Cannot access dashboard without login

**Pass/Fail**: ___

## Test 9: Error Handling
**Steps**:
1. Try login with wrong password
2. Try signup with existing email
3. Try accessing dashboard without login

**Expected**:
- Error messages display
- Redirects work correctly
- No crashes

**Pass/Fail**: ___

## Test 10: Responsive Design
**Steps**:
1. Open on desktop (1920px)
2. Open on tablet (768px)
3. Open on mobile (375px)

**Expected**:
- Layout adapts
- Navigation works
- Forms are usable
- Charts are readable

**Pass/Fail**: ___

## Performance Tests

### Page Load Time
- Homepage: < 2s
- Dashboard: < 3s
- Login: < 1s

### API Response Time
- Login: < 500ms
- Ingest: < 200ms
- Dashboard data: < 1s

## Final Checklist
- [ ] All tests passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Database working
- [ ] Authentication working
- [ ] API working
- [ ] UI responsive
- [ ] Performance acceptable

## Sign Off
**Tested By**: _______________
**Date**: _______________
**Status**: ✅ READY FOR PRODUCTION / ❌ NEEDS FIXES
