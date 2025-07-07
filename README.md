# Pulse Ping – Microservices-Based Uptime Monitoring System

 Pulse Ping is an uptime monitoring application designed to track the availability and response time of web services. It allows users to create custom monitors for URLs, receive real‑time alerts when a service goes down, and view historical performance trends in interactive dashboards.

- **Tech Stack**: React.js, Express.js, Prisma, PostgreSQL, Redis, Docker, AWS EC2,Websockets
- **Key Features**:
    - **Custom Monitor Creation**: Define checks at intervals from 60 seconds to 1 hour.
    - **Alert Notifications**: Email alerts via Nodemailer when a monitor fails.
    - **Real‑time Dashboard**: Live status updates using WebSocket and Clerk authentication.
    - **Historical Graphs**: Uptime percentage and response time trends over 24h

Live-Link:https://pulseping.shashankpandey.dev/

GitHub link:https://github.com/Shashankpandey09/PulsePing

![image.png](attachment:9a27966e-937f-462d-a3ab-4e9b2329bda5:image.png)

### 2. ⚙️High Level Architecture Diagram

![image.png](attachment:18cf0697-b2e7-49eb-b9c5-3af5e44df8f3:image.png)

---

**1. Frontend (FE):**

- Built using **React.js**, deployed on **Vercel**
- Handles monitor creation, dashboard views, and displays real-time updates via **WebSocket**

![image.png](attachment:7269d86e-b9f0-4446-8cc4-1d61d3fc7d1d:image.png)

- Added Clerk Web hooks for authentication

![image.png](attachment:2031271b-cbb1-4412-a3b1-c909953d7838:image.png)

**2. Subscriber API & WebSocket Server:**

- Runs on **port 3000**
- Subscribes to status changes from Redis
- Authenticates users via **Clerk JWT**
- Broadcasts updates to FE using WebSockets

![code.png](attachment:186f8704-ba1e-4010-a9c6-e3a128dcaf53:code.png)

**3. Database (PostgreSQL):**

- Stores monitor definitions, check logs, and user data
- Queried by both the scheduler and WebSocket subscriber

### **4.EC2 Machine (Dockerized Microservices on Same Network)**

All backend components are containerized using **Docker** and run on a single **EC2 instance** under the same **Docker network**. currently optimizes **cost-efficiency** by avoiding distributed infrastructure.

### **Scheduler (Cron Jobs Container)**

- Executes every 60 seconds.
- Pulls all monitors from PostgreSQL whose `nextPing` is due.
- Groups them by their interval buckets (e.g.,  1min, 10min,59 min).
- Pushes monitor metadata (ID, URL, etc.) into the **Job Queue** for processing in a batch of workers max each with a 2 second gap .
- Created an async generator function that yields monitor one at a time

![code2.png](attachment:6022599c-b8f1-4039-88ff-428a9114f9de:code2.png)

### **Job Queue (Redis List)**

- Acts as a **buffer between the scheduler and check workers**.
- Stores serialized jobs (usually as JSON) to be consumed by check workers.
- Enables asynchronous, decoupled processing of monitor checks.

### **Check Worker (Publisher - Containerized)**

- Dequeues jobs from **Job Queue**.
- Uses `axios` to perform HTTP checks on monitor targets.
- Logs response status, latency, and timestamps.
- If the monitor’s status changes (UP → DOWN or vice versa), it:
    - Updates monitor status in **PostgreSQL**.
    - Pushes an alert job to the **Email Queue**.
    - Publishes the new status over **Redis Pub/Sub**, which is consumed by the WebSocket server for real-time frontend updates.
- This worker essentially **acts as the publisher** in the pub-sub model.

### 📧 **Email Queue (Redis List)**

- Queues status-change alerts.
- Contains recipient info, monitor name, error details, and timestamp.
- Ensures reliable and retryable delivery via dedicated worker.

### 📤 **Email Worker (Nodemailer - Containerized)**

![code3.png](attachment:b38d8cad-995a-419e-9794-24f6e495b6bf:code3.png)

- Listens to the **Email Queue**.
- Sends real-time alert emails to users (using a  SMTP via Nodemailer).
