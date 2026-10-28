# Programming Learning & Practice Repository

Welcome to my personal programming repository! This workspace serves as a centralized hub for my ongoing journey of learning software development, mastering various programming languages, and sharpening my problem-solving skills through algorithms and practical coding exercises.

## About the Repository

As a dedicated developer and lifelong learner, I created this repository to document my growth, test new concepts, and build a solid foundation in computer science and software engineering. Whether I am exploring core programming paradigms, implementing classic data structures, or experimenting with different coding techniques, this is where my practical work lives.

The codebase reflects a multi-language approach to learning. While it features **Python** (alongside a robust development environment equipped with various utility libraries), it also heavily emphasizes systems and lower-level programming with **C++** and **C**. This diversity allows me to understand memory management, performance optimization, and different programming styles from the ground up.

## What You Will Find Inside

- **Algorithmic Challenges & Logic**: Solutions and implementations designed to improve problem-solving capabilities and deepen my understanding of computer science fundamentals across different languages.
- **Multi-Language Practice**: Scripts, snippets, and small programs written in Python, C++, and C to explore their unique syntax, features, and paradigms.
- **Interactive Notebooks & Projects**: Selected files demonstrating practical applications of programming concepts and experimentation.
- **General Programming Practice**: Utility scripts, automation tasks, and small-scale applications built to solve everyday problems and test new technical ideas.

## Web Projects

[Portfolio](Web_projects/Portfolio/) is a personal website built with HTML, CSS and JavaScript, with a FastAPI backend using SQLAlchemy and SQLite. It includes a theme switcher, calendar, weather widget, user registration and login, and a private link collection.

- `frontend/` contains the website and additional lecture examples (`NaWyklad*`).
- `backend/` contains the REST API, dependencies and [backend setup instructions](Web_projects/Portfolio/backend/README.md).
- Lab specifications, HTTP traffic captures, Python caches and the local database are omitted. The backend creates a new database on startup; existing accounts and saved links are not included.

### Run the portfolio locally

From the repository root, set up and start the backend:

```bash
cd Web_projects/Portfolio/backend
python -m venv .venv
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python run.py
```

In a second terminal, from the repository root, serve the frontend:

```bash
python -m http.server 5500 --bind 127.0.0.1 --directory Web_projects/Portfolio/frontend
```

Open <http://127.0.0.1:5500>. The frontend connects to the API at `http://127.0.0.1:8000/api`; API documentation is available at <http://127.0.0.1:8000/docs>.

## Purpose and Goals

The primary objective of this repository is twofold: to serve as a practical sandbox for daily coding experimentation and to act as a historical archive of my progress. Every script, function, and file represents a step forward in understanding how software works under the hood and how to write better, more efficient code.

Thank you for stopping by and exploring my codebase! Feel free to look around, check out the implementations, or draw inspiration for your own learning journey.
