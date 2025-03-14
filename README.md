## Running locally in development mode

1️⃣ Cookie & IP Tracking – Uses HTTP-only cookies and IP logging to track users and prevent multiple claims from the same device.
2️⃣ Rate Limiting – Enforces a cooldown period (e.g., 1 hour) before a user can claim again.
3️⃣ Database Constraints – Ensures uniqueness of claims per user and prevents duplicate redemptions via foreign key and unique constraints.
4️⃣ Server-side Validation – Claims are verified on the server, preventing client-side tampering or bypassing.
5️⃣ Round Robin Distribution – Coupons are assigned in sequential order to distribute them fairly among users.

To get started, just clone the repository and run `npm install && npm run dev`:

    https://github.com/gyanendra19/claim-coupon.git
    cd project-name
    npm install
    npm run dev

