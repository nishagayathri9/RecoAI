# **RecoAI : Hybrid Cascade-Based Personalized Recommendation System**  

![Python Version](https://img.shields.io/badge/python-3.8%2B-blue?style=flat-square)  
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square)  
![Google Colab](https://img.shields.io/badge/Google%20Colab-%23F9A825.svg?style=for-the-badge&logo=googlecolab&logoColor=white)
![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
---

## **📌 Overview**  
RecoAI is an open-source hybrid recommendation system that leverages both **collaborative filtering** and **content-based filtering** to provide highly accurate and scalable product recommendations for e-commerce businesses. Designed for flexibility, it can be deployed locally or on the cloud, integrated with existing AI pipelines, and fine-tuned with proprietary data.

---

## **🚀 Features**  
**Hybrid Cascade Model** – Combines collaborative and content-based filtering for optimal recommendations.  
**Cold-Start Solution** – Handles new users and products effectively using metadata-driven analysis.  
**Open-Source & Customizable** – Fully extendable and adaptable to any business need.  
**Lightweight & Scalable** – Runs efficiently on CPU/GPU and integrates seamlessly with cloud services.  
**Plug-and-Play Integration** – Deploy via Python library or expose as a REST API.  
**Data Privacy Focused** – Ensures anonymized and secure data handling.  

---

## **📂 Repository Structure**  
```plaintext
📦 recoai
 ┣ 📂 backend
 ┣ 📂 vite-project         # website code         
 ┣ 📂 notebooks            # Jupyter notebooks for experiments
 ┣ 📂 src                  # Core recommendation engine
 ┃ ┣ 📜 collaborative.py   # Collaborative filtering implementation
 ┃ ┣ 📜 content_based.py   # Content-based filtering implementation
 ┃ ┣ 📜 hybrid.py          # Hybrid cascade-based recommendation logic
 ┃ ┣ 📜 api.py             # REST API for model deployment
 ┣ 📜 requirements.txt     # Required dependencies
 ┣ 📜 README.md            # Project documentation
 ┗ 📜 LICENSE              # Open-source license
```

---

## **🛠 Installation**  
### **Prerequisites**  
- Python 3.8+  
- Pip / Conda  
- GPU (optional for faster performance)  

### **Step 1: Clone the Repository**  
```bash
git clone https://github.com/nishagayathri9/recoai.git
cd recoai
```

### **Step 2: Install Dependencies**  
```bash
pip install -r requirements.txt
```

### **Step 3: Run the Model**  
To generate recommendations using sample data:  
```bash
python src/hybrid.py --data data/sample.csv
```

### **Step 4: Run API Server (Optional)**  
Expose the model as a RESTful API:  
```bash
python src/api.py
```
Access it at `http://localhost:5000/recommend?user_id=123`

---

## **🖥️ Usage**  
### **1. Import as a Python Library**  
```python
from recoai.hybrid import RecoAI

model = RecoAI()
recommendations = model.recommend(user_id=123)
print(recommendations)
```

### **2. Use API for Integration**  
```bash
curl -X GET "http://localhost:5000/recommend?user_id=123"
```

---

## **📊 Benchmarks (Simulated Data)**
| Metric                | Improvement |
|-----------------------|------------|
| Click-Through Rate   | +25%       |
| Conversion Rate      | +15%       |
| Cart Abandonment     | -30%       |
| Repeat Customers    | +20%       |

