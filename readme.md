# 🆘 Offline Survival AI

An offline-first survival assistant designed to work without internet, built for extreme situations such as disasters, infrastructure collapse, or long-term isolation.

This project combines:
- **Local AI (LLM)** for intelligent responses
- **Curated survival knowledge** (medical, food, hygiene, etc.)
- **Offline navigation** using OpenStreetMap + GraphHopper

**The goal is not to replace professionals**, but to help ordinary people survive longer and avoid fatal mistakes when help is unavailable.

---

## ⚠️ Important Disclaimer (Read First)

> **This project provides educational and first-aid guidance only.**
>
> - It does **NOT** replace doctors, hospitals, or professional medical care.
> - It does **NOT** provide diagnoses, prescriptions, or medicine dosages.
> - **Incorrect use of medical information can cause serious harm or death.**
> - Use this system responsibly.

---

## 🧠 What This Project Does

### 1. Offline AI Assistant
- Runs locally using **Ollama**
- Answers questions using **retrieval-augmented generation (RAG)**
- Works fully offline once set up

### 2. Survival Medical Knowledge (WHO-based)
Covers essential topics including:
- First aid
- Wound care (short & long term)
- Fever, pain, dehydration, diarrhea
- Burns, fractures, snake bites
- Child emergency care
- Infection prevention

**All medical content is:**
- Based on WHO guidelines
- Written for complete beginners
- Conservative and safety-focused

### 3. Offline Navigation (Google-Maps-like, but offline)
- Uses **GraphHopper**
- Uses **OpenStreetMap** (.osm.pbf) data
- Supports routing between locations
- Works fully offline once maps are imported

---

## 📁 Project Structure

```
Offline_AI/
├── ai/
│   ├── llm.py              # Connects to local LLM (Ollama)
│   ├── rag.py              # Retrieval logic
│   └── prompts.py          # System prompt & guardrails
│
├── data/
│   └── knowledge/
│       └── medical/        # WHO-based medical files
│
├── graphhopper/
│   ├── graphhopper-web.jar
│   ├── config.yml
│   └── maps/
│       └── *.osm.pbf       # Offline map data
│
├── server/
│   └── main.py             # FastAPI server
│
├── venv/                   # Python virtual environment
├── requirements.txt
└── README.md
```

---

## 🏥 Medical Knowledge Pack (Current Coverage)

The medical knowledge is stored as plain text markdown files, optimized for RAG.

**Covered topics include:**
- Bleeding control
- Wound cleaning & dressing
- Long-term wound care
- Burns
- Fever & pain
- Dehydration
- Diarrhea & food poisoning
- Infection prevention
- Fractures & sprains
- Snake bites
- Heat stroke & hypothermia
- Insect bites
- Child emergency care

**What is intentionally NOT included:**
- Medicine dosages
- Antibiotics
- Prescriptions
- Surgery
- Diagnosis

**If the AI does not have safe information, it will say so.**

---

## 🗺️ Offline Maps & Navigation

This project uses **GraphHopper** with **OpenStreetMap** data.

### Supported Features
- Offline routing
- Distance & time estimates
- Step-by-step navigation logic (expandable)
- Large-area maps (entire countries)

### Example Map Sources
- **India**: `india.osm.pbf`
- **Nepal**: `nepal.osm.pbf`

You can merge maps using `osmium`:
```bash
osmium merge india.osm.pbf nepal.osm.pbf -o india_nepal.osm.pbf --overwrite
```

---

## ⚡ Quick Start (TL;DR)

**If everything is already installed:**

### 1️⃣ Start the local LLM
```bash
ollama serve
```

Make sure this works:
```bash
curl http://localhost:11434/api/tags
```

### 2️⃣ Start GraphHopper (Offline Maps)
```bash
cd graphhopper
java -Xmx8g -jar graphhopper-web-11.0.jar server config.yml
```

Wait until you see:
```
Started Server@... {STARTED}
```

GraphHopper runs at: `http://localhost:8989`

### 3️⃣ Start the Survival API
```bash
uvicorn server.main:app --host 127.0.0.1 --port 8000
```

API runs at: `http://127.0.0.1:8000`

### 4️⃣ Test the System

Ask a survival question:
```bash
curl -X POST "http://127.0.0.1:8000/ask?q=How do I stop heavy bleeding?"
```

Test navigation:
```bash
curl -X POST "http://127.0.0.1:8000/navigate?start_lat=28.6139&start_lon=77.2090&end_lat=27.7172&end_lon=85.3240"
```

---

## 🚀 Getting Started

### 1. Install Requirements

#### Python
- **Python 3.10+** required

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Install Ollama (Local LLM)

1. Install Ollama from [official site](https://ollama.ai/)
2. Pull a model (example):
   ```bash
   ollama pull llama3
   ```
3. Start Ollama server:
   ```bash
   ollama serve
   ```

Ollama runs on: `http://localhost:11434`

### 3. Start GraphHopper

1. Place `.osm.pbf` map file inside: `graphhopper/maps/`
2. Start GraphHopper:
   ```bash
   java -Xmx8g -jar graphhopper-web-11.0.jar server config.yml
   ```

GraphHopper runs on: `http://localhost:8989`

**Note:** Large maps require 8–12 GB RAM.

### 4. Start the API Server

```bash
uvicorn server.main:app --host 127.0.0.1 --port 8000
```

API runs at: `http://127.0.0.1:8000`

---

## 🧠 Important Notes

### 🧮 Memory Requirements

- **Small regions**: 4–6 GB RAM
- **Large countries** (India, Nepal): 8–12 GB RAM
- If you see `OutOfMemoryError`, increase Java memory:
  ```bash
  java -Xmx12g -jar graphhopper-web-11.0.jar server config.yml
  ```

### 🛠️ Common Problems & Fixes

#### ❌ `/ask` returns connection error
**Cause:** Ollama not running  
**Fix:**
```bash
ollama serve
```

#### ❌ `/navigate` returns empty steps
**Cause:** Instructions disabled or map still importing  
**Fix:** Wait for GraphHopper import to finish (first run can take minutes).

#### ❌ Server crashes during map import
**Cause:** Not enough RAM  
**Fix:** Increase Java heap (`-Xmx`):
```bash
java -Xmx12g -jar graphhopper-web-11.0.jar server config.yml
```

#### ❌ GraphHopper won't start
**Cause:** Port 8989 already in use  
**Fix:** Kill the existing process or change the port in `config.yml`

#### ❌ Python dependencies won't install
**Cause:** Wrong Python version or missing build tools  
**Fix:** Ensure Python 3.10+ is installed and update pip:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🔌 API Usage

### Ask a Survival Question
```http
POST /ask?q=How do I clean and dress a deep wound?
```

### Get Navigation Route
```http
POST /navigate?start_lat=28.6139&start_lon=77.2090&end_lat=27.7172&end_lon=85.3240
```

---

## 🔒 Safety Design Principles

- ✅ Conservative answers only
- ✅ No hallucinated medical advice
- ✅ Clear "do not" warnings
- ✅ Honest failure statements
- ✅ Offline-first by design

---

## 🧭 Future Roadmap

Planned expansions:
- [ ] Farming & food growing
- [ ] Butchering & meat preservation
- [ ] Water purification
- [ ] Shelter building
- [ ] Dental emergencies
- [ ] Mental trauma & shock management
- [ ] Offline map tiles (visual UI)
- [ ] GPS integration (no internet)

---

## 🤝 Philosophy

This project is built on one rule:

> **In a world without help, bad advice is worse than no advice.**

Everything here is designed to:
- Reduce preventable deaths
- Avoid dangerous confidence
- Help people survive longer

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)**.

### What this means:

✅ **Individuals can use this project for free** for personal, educational, and non-commercial purposes.

❌ **Commercial use requires a paid license.** Companies, organizations, or individuals using this project for commercial purposes must contact the project maintainer for a commercial license.

### You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

### Under the following terms:
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes without a paid license.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license.

### Commercial License:
For commercial use inquiries, please contact: [Add your contact email/method here]

**Full License Text:** https://creativecommons.org/licenses/by-nc-sa/4.0/

---

**Note:** The medical knowledge content based on WHO guidelines may have separate terms. WHO content is used for educational purposes under fair use principles.

## 🙏 Acknowledgments

- Medical content based on **WHO guidelines**
- Navigation powered by **GraphHopper** and **OpenStreetMap**
- AI powered by **Ollama**

---

## ⚠️ Final Warning

**This is an emergency tool, not a replacement for professional help.**

When professional medical care is available, **always seek it first.**