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

![image3](https://github.com/user-attachments/assets/4d710d0b-5316-42bc-b0b2-9a9c8841a12c)

**1. Frontend (FE):**

- Built using **React.js**, deployed on **Vercel**
- Handles monitor creation, dashboard views, and displays real-time updates via **WebSocket**

![image2](https://github.com/user-attachments/assets/6afeac46-ba56-4da1-8ea6-f10118b1ceab)


- Added Clerk Web hooks for authentication
![image4](https://github.com/user-attachments/assets/63d4785c-71af-43f2-a6eb-0855f21cdfca)

**2. Subscriber API & WebSocket Server + Pubsubs With Singleton Pattern:**

- Runs on **port 3000**
- Subscribes to status changes from Redis
- Authenticates users via **Clerk JWT**
- Broadcasts updates to FE using WebSockets

<img width="768" height="741" alt="image" src="https://github.com/user-attachments/assets/8de00d1a-a55e-4f0d-afc2-55bb4179801a" />



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

![code2](https://github.com/user-attachments/assets/738dc5c2-b22a-47f2-941b-9804fff0c070)


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

![code3](https://github.com/user-attachments/assets/44db2827-6d00-4ca1-b75e-8553a9213dc4)



- Listens to the **Email Queue**.
- Sends real-time alert emails to users (using a  SMTP via Nodemailer).
