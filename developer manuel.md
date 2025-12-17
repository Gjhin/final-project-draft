### Developer Manual
## Installation
npm install

## Running Locally
npm run dev

## API Endpoints
POST /api/validate-email – validates and logs signup attempts  
GET /api/attempts – returns recent signup attempts  
GET /api/metrics – returns aggregated rejection reasons  

## Known Issues
- No auth on admin dashboard
- Rate limits not implemented

## Future Roadmap
- Admin authentication
- Multiple org domains
- Rate limiting & CAPTCHA