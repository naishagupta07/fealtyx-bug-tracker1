# 🐞 FealtyX Bug Tracker

A **Bug/Task Tracking Dashboard** built with **Next.js**, allowing Developers and Managers to efficiently create, track, and manage project tasks.  
This project was developed as part of the **FealtyX Assignment**.

---

## 🚀 Features

### 👨‍💻 Developer Dashboard
- Create, edit, and delete tasks/bugs.
- Add task details: **Title**, **Description**, **Priority**, **Status**, **Assignee**, and **Dates**.
- Track time spent on each task with the `+1 hr` button.
- Close a bug — automatically sends it to the manager for approval.
- View a trendline graph of tasks created over time.

### 👩‍💼 Manager Dashboard
- View all tasks from every developer.
- Approve or Reopen bugs that are marked “Pending Approval”.
- Monitor total time spent by developers on each task.

### 🧠 Additional Highlights
- Role-based login (Developer or Manager).
- Persistent task data using **localStorage**.
- Clean, responsive, and modern UI.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (React)
- **Styling:** CSS
- **State Management:** React Hooks + localStorage
- **Data Source:** Local JSON (mock authentication)

---

## 🔐 Roles and Credentials

You can log in using any of the following:

| Role      | Username | Password |
|------------|-----------|----------|
| Developer  | dev1      | dev123   |
| Developer  | dev2      | dev234   |
| Developer  | dev3      | dev345   |
| Developer  | dev4      | dev456   |
| Manager    | manager1  | manager123  |

---

## 📊 Dashboard Overview

- Developers can **add new tasks**, track hours, and close bugs.
- Closed bugs go to the **Manager Dashboard** for review.
- Managers can **approve** or **reopen** tasks.
- Trendline graph displays daily task creation data.

---

## 🧩 Project Structure

fbt/
├── app/
│ ├── login/ # Login page
│ ├── dashboard/
│ │ ├── tasks/ # Developer dashboard
│ │ └── manager/ # Manager dashboard
│ └── layout.tsx
│
├── public/
├── package.json
├── next.config.mjs
└── README.md


---

## 🧭 How to Run Locally

1. Clone this repository  
   ```bash
   git clone https://github.com/naishagupta07/fealtyx-bug-tracker1.git
2. Navigate to the folder

cd fealtyx-bug-tracker1


3. Install dependencies

npm install


4. Run the development server

npm run dev


5. Visit the app in your browser at

http://localhost:3000

Working Demo URL: [Deployed version if available or localhost link]

Demo Video: 
https://drive.google.com/file/d/1o24BzQX28_JYAggbIsITILIrlRgahzsa/view?usp=sharing


👩‍💻 Author

Naisha Gupta
📧 naisha190702@gmail.com
🌐 https://github.com/naishagupta07
