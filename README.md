Car Auction App - Next.js with MySQL
This is a car auction application built with [Next.js](https://nextjs.org/), allowing users to browse listings, participate in auctions, and experience the thrill of online car bidding.

## Features:
- User Authentication: Secure login system using JSON Web Tokens (JWT).
- Car Listings: Browse a variety of car listings with detailed information.
- Bidding System: Place bids on cars and compete with other users.
- Notifications: Receive informative messages using React-Toasty.
- Responsive Design: Built with Bootstrap for optimal viewing on any device.

## Technologies:
- Front-End: [Next.js](https://nextjs.org/), [React](https://react.dev/), [Bootstrap](https://getbootstrap.com/)
- Back-End: [Sequelize](https://sequelize.org/docs/v6/) (MySQL)
- Authentication: [JSON Web Tokens (JWT)](https://www.npmjs.com/package/jsonwebtoken)
- Notifications: [React-Toasty](https://www.npmjs.com/package/react-toastify)

## Installation:
1. Clone this repository or download .
2. Install dependencies:
```
npm install
```
3. Create a `.env` file based on `.env.example` file in the project root and add your database credentials:
4. Run database migrations:
```
npm run migrate
```
5. Start the development server:
```
npm run dev
```

Usage
1. Access the application in your browser at http://localhost:8090.
2. Create an account or log in if you already have one.
3. Users can then browse listings, place bids, and manage their accounts.

**Note**: Authentication and authorization are required to perform most actions.

