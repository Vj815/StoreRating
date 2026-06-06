# StoreScore — Multi-Role Store Rating & Analytics Platform

StoreScore is a secure, role-based web application designed to manage business directories, process consumer ratings, and deliver targeted analytics across three specialized user tiers. This repository houses the complete full-stack implementation, featuring an Express.js & MySQL backend alongside an interactive React.js client interface.

## 🚀 Key Features

A core highlight of the platform is its **Unified Entry Pipeline**, which routes users through a single login screen and dynamically provisions their experience based on granular authorization profiles:

* **👑 System Administrator Dashboard:** Has overarching management control. Can register new storefront entities and manually provision system users (Admins, Owners, Users). Features a system-wide KPI monitor tracking platform-wide counts of total users, stores, and evaluation mappings. Includes complex dynamic filtering/sorting for master registers.
* **💼 Store Owner Workspace:** Grants business owners exclusive operational insights. Automatically pulls the specific storefront owned by the user, dynamically computes its real-time average rating, and yields a chronological feedback record detailing customer names, emails, and ratings.
* **👤 Normal Consumer Catalog:** Allows consumers to browse the marketplace directory. Supports multi-column live search parameters (Filter by Name or Address) and updates individual star grids showing overall store benchmarks side-by-side with the consumer's custom personal rating. Users can seamlessly create or modify their existing evaluation entries.

## 🛠️ Technology Stack

* **Frontend Ecosystem:** React.js, React Router DOM v6, Context API (Global Auth State Engine), Axios (HTTP Client with Interceptor Token injection).
* **Backend Infrastructure:** Node.js, Express.js (ES Modules architecture), JSON Web Tokens (JWT Access Security), `bcryptjs` (Cryptographic password hashing), `express-validator` (Robust form guardrail middleware).
* **Persistence Layer:** MySQL Relational Database (utilizing connection pools via `mysql2/promise` for transactional stability).

## 📊 Database Schema Architecture

The database engine runs on a relational schema featuring strict check constraints and self-cleaning cascading lookups to mirror enterprise standards:

* `users`: Houses global platform data (`admin`, `user`, `store_owner`). Protects string inputs and enforces a strict `CHECK` rule requiring names to span at least 20 characters to comply with specification definitions.
* `stores`: Captures localized business units. Uses a conditional `ON DELETE SET NULL` mapping to its unique manager (`owner_id`), preserving storefront entries even if owner records shift.
* `ratings`: A strategic junction table forming a transactional Many-to-Many relationship between Users and Stores. Employs a strict `CHECK (rating >= 1 AND rating <= 5)` range block and anchors a `UNIQUE KEY` constraint preventing multi-post evaluation flooding, seamlessly pivoting users to modification states instead.

## 🏁 Installation & Quick Start

Follow these steps to run the complete environment locally:

### 1. Database Setup
Ensure you have a local instance of MySQL running, then run the database script to provision the schema and create tables:
```bash
mysql -u root -p < store_rating_db.sql