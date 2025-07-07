# Pulse Ping – Microservices-Based Uptime Monitoring System

 Pulse Ping is an uptime monitoring application designed to track the availability and response time of web services. It allows users to create custom monitors for URLs, receive real‑time alerts when a service goes down, and view historical performance trends in interactive dashboards.

- **Tech Stack**: React.js, Express.js, Prisma, PostgreSQL, Redis, Docker, AWS EC2,Websockets
- **Key Features**:
    - **Custom Monitor Creation**: Define checks at intervals from 60 seconds to 1 hour.
    - **Alert Notifications**: Email alerts via Nodemailer when a monitor fails.
    - **Real‑time Dashboard**: Live status updates using WebSocket and Clerk authentication.
    - **Historical Graphs**: Uptime percentage and response time trends over 24h
 ![image](https://github.com/user-attachments/assets/4663bebb-304e-47c4-9899-93b19c78ecd6)
  
### 2. ⚙️High Level Architecture Diagram

![image.png](attachment:18cf0697-b2e7-49eb-b9c5-3af5e44df8f3:image.png)

---

**1. Frontend (FE):**

- Built using **React.js**, deployed on **Vercel**
- Handles monitor creation, dashboard views, and displays real-time updates via **WebSocket**

![image.png](attachment:7269d86e-b9f0-4446-8cc4-1d61d3fc7d1d:image.png)

- Added Clerk Web hooks for authentication
