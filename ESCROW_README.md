# Nepal Tourism Escrow Booking System

## Overview
A secure escrow system for booking tourism services in Nepal. The system holds payments in escrow until both the tourist (buyer) and service provider confirm service completion.

## Features

### 🎯 Core Functionality
- **Create Bookings**: Create escrow bookings for various tourism services
- **Manage Bookings**: View, search, and filter all bookings
- **Secure Payments**: Funds held in escrow until service completion
- **Dual Confirmation**: Both parties must confirm before payment release

### 📋 Service Types Supported
1. Trekking Packages
2. Cultural Tours
3. Wildlife Safari
4. Wellness & Meditation Retreats
5. Adventure Sports
6. Custom Packages

### 🔄 Booking Workflow

```
1. Create Booking → 2. Fund Escrow → 3. Deliver Service → 4. Confirm Completion → 5. Release Payment
```

#### Detailed Steps:
1. **Create Booking**: Buyer and provider agree on service details, amount, and terms
2. **Fund Escrow**: Buyer deposits payment which is held securely
3. **Service Delivery**: Provider delivers the agreed tourism service
4. **Confirm Completion**: Both parties confirm service delivery and satisfaction
5. **Release Payment**: System automatically releases payment to provider

### 📊 Booking Status

| Status | Description |
|--------|-------------|
| **Pending** | Booking created, awaiting buyer funding |
| **Funded** | Payment deposited, service can begin |
| **Completed** | Service delivered, payment released |
| **Disputed** | Issue raised, under mediation |
| **Cancelled** | Booking cancelled, refund processed if applicable |

## Usage

### Creating a Booking

1. Navigate to **Escrow Booking** page
2. Select **Create Booking** tab
3. Fill in the form:
   - Service Type
   - Your name and email
   - Provider name and email
   - Booking amount (NPR)
   - Service start date
   - Service description
   - Terms & conditions
4. Agree to escrow terms
5. Click **Create Escrow Booking**

### Managing Bookings

1. Go to **Manage Bookings** tab
2. View all your bookings
3. Use search to find specific bookings
4. Filter by status
5. Click **View Details** for complete information
6. Take actions based on booking status:
   - **Pending**: Fund Escrow or Cancel
   - **Funded**: Confirm (Buyer/Provider) or Raise Dispute
   - **Completed**: View only (payment released)

### Understanding the Process

Click the **How It Works** tab to see:
- Step-by-step escrow process
- Benefits of using escrow
- Booking status guide

## Technical Details

### Architecture
- **Frontend Only**: Pure client-side application
- **Storage**: Browser localStorage for data persistence
- **No Backend**: All operations happen in the browser

### Data Structure

Each booking contains:
- Unique ID (ESC-XXXXXX format)
- Service type and description
- Buyer and provider information
- Amount and payment status
- Start date
- Custom terms and conditions
- Timeline of all actions
- Confirmation status from both parties

### Files

- `escrow.html` - Main interface with tabbed navigation
- `escrow.css` - Styling and responsive design
- `escrow.js` - Business logic and state management

## Security

### Data Privacy
- All data stored locally in browser
- No data transmitted to servers
- Users control their own data

### Escrow Protection
- Funds cannot be accessed by either party until completion
- Both parties must confirm before release
- Dispute mechanism for conflict resolution

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires localStorage support

## Future Enhancements

Potential improvements for production deployment:
1. Backend API integration for real data persistence
2. Payment gateway integration
3. Email notifications
4. Admin mediation panel for disputes
5. Multi-currency support
6. Export booking data
7. Rating and review system

## Support

For questions or issues, contact Nepal Tourism Board.

---

© 2025 Nepal Tourism Board. All Rights Reserved.
