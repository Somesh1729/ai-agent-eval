# Test Credentials & API Examples

## Test Account Credentials

### Account 1
- **Email**: test@example.com
- **Password**: TestPassword123!
- **Purpose**: General testing

### Account 2
- **Email**: demo@example.com
- **Password**: DemoPassword456!
- **Purpose**: Dashboard testing

## API Testing Examples

### 1. Sign Up
**Endpoint**: POST /auth/sign-up (via Supabase)
**Method**: Client-side (use signup form)

### 2. Login
**Endpoint**: POST /auth/login (via Supabase)
**Method**: Client-side (use login form)

### 3. Ingest Evaluation
**Endpoint**: POST /api/evals/ingest
**Headers**:
\`\`\`
Content-Type: application/json
\`\`\`

**Body**:
\`\`\`json
{
  "interaction_id": "eval-001",
  "prompt": "What is the capital of France?",
  "response": "The capital of France is Paris.",
  "score": 0.95,
  "latency_ms": 125,
  "flags": ["correct", "concise"],
  "pii_tokens_redacted": 0
}
\`\`\`

**Response** (201 Created):
\`\`\`json
{
  "success": true,
  "message": "Evaluation recorded",
  "data": {
    "id": "uuid-here",
    "user_id": "user-uuid",
    "interaction_id": "eval-001",
    "created_at": "2025-01-19T10:30:00Z"
  }
}
\`\`\`

### 4. Get Dashboard Data
**Endpoint**: GET /dashboard
**Method**: Browser (authenticated)
**Response**: Dashboard page with KPIs and charts

### 5. Get Settings
**Endpoint**: GET /settings
**Method**: Browser (authenticated)
**Response**: Settings page with current configuration

## cURL Examples

### Sign Up (via Supabase)
\`\`\`bash
curl -X POST "https://your-project.supabase.co/auth/v1/signup" \
  -H "apikey: your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
\`\`\`

### Login (via Supabase)
\`\`\`bash
curl -X POST "https://your-project.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
\`\`\`

### Ingest Evaluation
\`\`\`bash
curl -X POST "http://localhost:3000/api/evals/ingest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "interaction_id": "eval-001",
    "prompt": "What is 2+2?",
    "response": "4",
    "score": 1.0,
    "latency_ms": 50,
    "flags": ["correct"],
    "pii_tokens_redacted": 0
  }'
\`\`\`

## JavaScript/Fetch Examples

### Sign Up
\`\`\`javascript
const signUp = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

signUp('test@example.com', 'TestPassword123!');
\`\`\`

### Login
\`\`\`javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

login('test@example.com', 'TestPassword123!');
\`\`\`

### Ingest Evaluation
\`\`\`javascript
const ingestEval = async (evalData, token) => {
  const response = await fetch('http://localhost:3000/api/evals/ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(evalData)
  });
  return response.json();
};

const evalData = {
  interaction_id: 'eval-001',
  prompt: 'What is the capital of France?',
  response: 'Paris',
  score: 0.95,
  latency_ms: 125,
  flags: ['correct'],
  pii_tokens_redacted: 0
};

ingestEval(evalData, 'your-token');
\`\`\`

## Python Examples

### Sign Up
\`\`\`python
import requests

url = 'http://localhost:3000/auth/sign-up'
data = {
    'email': 'test@example.com',
    'password': 'TestPassword123!'
}
response = requests.post(url, json=data)
print(response.json())
\`\`\`

### Ingest Evaluation
\`\`\`python
import requests

url = 'http://localhost:3000/api/evals/ingest'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
}
data = {
    'interaction_id': 'eval-001',
    'prompt': 'What is 2+2?',
    'response': '4',
    'score': 1.0,
    'latency_ms': 50,
    'flags': ['correct'],
    'pii_tokens_redacted': 0
}
response = requests.post(url, json=data, headers=headers)
print(response.json())
\`\`\`

## Test Scenarios

### Scenario 1: Complete User Journey
1. Sign up with test@example.com
2. Confirm email
3. Login
4. View dashboard
5. Configure settings
6. Ingest evaluation
7. View updated dashboard
8. Logout

### Scenario 2: API Testing
1. Get authentication token
2. Ingest multiple evaluations
3. Verify data in dashboard
4. Check database directly

### Scenario 3: Error Handling
1. Try login with wrong password
2. Try signup with existing email
3. Try ingest without authentication
4. Try ingest with invalid data

## Expected Results

### Successful Signup
- Status: 200
- User created in Supabase
- Email confirmation sent
- Redirect to success page

### Successful Login
- Status: 200
- Session created
- Redirect to dashboard
- User data loaded

### Successful Ingest
- Status: 201
- Evaluation saved
- Appears in dashboard
- Data persists in database

### Error Cases
- Invalid email: 400 Bad Request
- Wrong password: 401 Unauthorized
- Missing auth: 401 Unauthorized
- Invalid data: 400 Bad Request
