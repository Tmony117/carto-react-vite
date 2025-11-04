# Ghana Mining Analytics - Deployment Checklist

## Pre-Deployment Setup

### 1. CARTO Account Setup
- [ ] Create CARTO account or verify access
- [ ] Generate API access token
- [ ] Note your CARTO region (US East, EU West, etc.)
- [ ] Verify `carto_dw` connection exists

### 2. Data Preparation
- [ ] Export Goldbod data for Ghana
  - [ ] Mining concessions
  - [ ] Mining sites/mines
  - [ ] Transactions data
- [ ] Transform data to match schema (see GOLDBOD_DATA_IMPORT.md)
- [ ] Validate geometry is in WGS84 (EPSG:4326)
- [ ] Verify data is within Ghana boundaries (4.5-11.5°N, -3.5-1.5°E)

### 3. CARTO Data Import
- [ ] Upload concessions data → `mining_concessions_ghana`
- [ ] Upload mines data → `mining_sites_ghana`
- [ ] Upload transactions data → `mining_transactions_ghana`
- [ ] Create heatmap aggregation → `mining_activity_aggregated`
- [ ] Run data quality checks (SQL queries in import guide)
- [ ] Verify all tables have geometry column named `geom`

### 4. Application Configuration
- [ ] Update CARTO credentials in `src/App.tsx`
  ```typescript
  accessToken: "YOUR_TOKEN_HERE"
  apiBaseUrl: "YOUR_REGION_URL"
  ```
- [ ] Update table names in `src/config/miningDataConfig.ts`
  ```typescript
  data: "your-project.your-dataset.table_name"
  ```
- [ ] Verify Ghana center coordinates are correct
- [ ] Test layer styling colors match requirements

### 5. Local Testing
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to start development server
- [ ] Verify map loads centered on Ghana
- [ ] Check all 4 layers display correctly:
  - [ ] Heatmap layer shows activity density
  - [ ] Concessions layer shows polygons
  - [ ] Mines layer shows points (green/grey)
  - [ ] Transactions layer toggles on/off
- [ ] Test widgets display correct statistics
- [ ] Verify no console errors
- [ ] Test map interactions (pan, zoom, click)

## Production Deployment

### 6. Build Optimization
- [ ] Run `npm run build` successfully
- [ ] Verify build output in `dist/` folder
- [ ] Test production build with `npm run preview`
- [ ] Check bundle size is acceptable
- [ ] Ensure no development credentials in code

### 7. Environment Configuration
- [ ] Create `.env.production` file
- [ ] Set production CARTO credentials
- [ ] Configure production API endpoints
- [ ] Set appropriate CORS settings in CARTO

### 8. Deployment Platform
Choose your deployment platform:

#### Option A: Netlify
- [ ] Connect GitHub repository to Netlify
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Add environment variables in Netlify dashboard
- [ ] Deploy and verify

#### Option B: Vercel
- [ ] Import project to Vercel
- [ ] Configure build settings (auto-detected for Vite)
- [ ] Add environment variables
- [ ] Deploy and verify

#### Option C: Custom Server
- [ ] Upload `dist/` folder to web server
- [ ] Configure web server (nginx/Apache)
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure domain name

### 9. Post-Deployment Verification
- [ ] Access production URL
- [ ] Verify map loads correctly
- [ ] Test all layers display data
- [ ] Check widgets show correct statistics
- [ ] Test on multiple browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test on mobile devices
- [ ] Verify performance (load time < 5 seconds)
- [ ] Check browser console for errors

## Security & Access

### 10. Security Configuration
- [ ] Verify CARTO access token has appropriate permissions
- [ ] Set up token rotation schedule
- [ ] Configure CARTO IP allowlist (if needed)
- [ ] Review data access permissions
- [ ] Enable HTTPS on production domain
- [ ] Set up Content Security Policy headers

### 11. User Access Management
- [ ] Define user roles (viewer, editor, admin)
- [ ] Set up authentication (if required)
- [ ] Configure user permissions in CARTO
- [ ] Document access procedures
- [ ] Create user guide/training materials

## Monitoring & Maintenance

### 12. Monitoring Setup
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure analytics (e.g., Google Analytics)
- [ ] Monitor CARTO API usage/quotas
- [ ] Set up uptime monitoring
- [ ] Configure alert notifications

### 13. Data Refresh Schedule
- [ ] Define data update frequency (daily/weekly/monthly)
- [ ] Set up automated Goldbod export
- [ ] Configure CARTO scheduled queries
- [ ] Document manual update procedures
- [ ] Create data refresh checklist

### 14. Backup & Recovery
- [ ] Back up CARTO data tables
- [ ] Export configuration files
- [ ] Document recovery procedures
- [ ] Test data restoration process
- [ ] Set up automated backups

## Documentation

### 15. Documentation Updates
- [ ] Update README with production URLs
- [ ] Document any custom configurations
- [ ] Create user guide with screenshots
- [ ] Write troubleshooting guide
- [ ] Document data update procedures
- [ ] Create admin guide for maintenance

### 16. Training & Handoff
- [ ] Train key users on the application
- [ ] Demonstrate all features and layers
- [ ] Review data update procedures
- [ ] Share access to documentation
- [ ] Schedule follow-up support sessions

## Future Enhancements

### 17. Planned Features (Optional)
- [ ] Add more West African countries
  - [ ] Nigeria
  - [ ] Sierra Leone
  - [ ] Ivory Coast
- [ ] Implement country selector dropdown
- [ ] Add time-series analysis
- [ ] Create export functionality (PDF/Excel)
- [ ] Add advanced filtering options
- [ ] Implement user customizable dashboards
- [ ] Add real-time data updates
- [ ] Create mobile app version

### 18. Performance Optimization
- [ ] Implement data caching
- [ ] Optimize SQL queries
- [ ] Add lazy loading for large datasets
- [ ] Compress map tiles
- [ ] Optimize bundle size
- [ ] Set up CDN for assets

## Sign-Off

### Final Checklist
- [ ] All stakeholders have reviewed the application
- [ ] Production deployment is successful
- [ ] All documentation is complete
- [ ] Users are trained
- [ ] Support procedures are in place
- [ ] Backup and monitoring are active

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Production URL**: _______________  
**Sign-off**: _______________

---

## Quick Links

- 📘 [Setup Guide](MINING_SETUP.md)
- 📗 [Data Import Guide](GOLDBOD_DATA_IMPORT.md)
- 📙 [Quick Reference](QUICK_REFERENCE.md)
- 📕 [README](README.md)

## Support Contacts

- **Technical Support**: _______________
- **Data Management**: _______________
- **CARTO Account Admin**: _______________
- **Goldbod Support**: _______________
