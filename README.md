### Abuse Prevention Strategies

- **Cookie & IP Tracking**  
  Uses HTTP-only cookies and IP logging to track users and prevent multiple claims from the same device.  

- **Rate Limiting**  
  Enforces a cooldown period (e.g., 1 hour) before a user can claim again.  

- **Database Constraints**  
  Ensures uniqueness of claims per user and prevents duplicate redemptions via foreign key and unique constraints.  

- **Server-side Validation**  
  Claims are verified on the server, preventing client-side tampering or bypassing.  

- **Round Robin Distribution**  
  Coupons are assigned in sequential order to distribute them fairly among users.  

## Running locally in development mode

To get started, just clone the repository and run `npm install && npm run dev`:

    https://github.com/gyanendra19/claim-coupon.git
    cd project-name
    npm install
    npm run dev



