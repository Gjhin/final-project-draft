### Developer Manual
## Installation
npm install

## Running Locally
npm run dev

## API Endpoints
POST /api/validate-email
- mode: "check" → validate email
- mode: "recent" → return recent attempts
- mode: "metrics" → return aggregated rejection reasons

## Known Issues
- No auth on admin dashboard
- Rate limits not implemented

## Future Roadmap
- Admin authentication
- Multiple org domains
- Rate limiting & CAPTCHA