# 🩺 DermAgent — Deteksi Penyakit Kulit Berbasis AI

> **Healthcare & Wellbeing — Hackathon Hacktiv8 x IBM**

**DermAgent (Dermatology Agent)** adalah prototype website berbasis Artificial Intelligence yang membantu pengguna memahami **hasil deteksi kondisi kulit dari gambar** menggunakan Computer Vision dan AI Assistant.

Project ini menggabungkan **YOLOv11 Nano** yang di-deploy melalui **Roboflow** untuk melakukan deteksi visual dengan **IBM Langflow** sebagai workflow AI untuk DermAgent. Pengguna dapat mengunggah gambar atau menggunakan kamera secara real-time, melihat label dan confidence hasil model, kemudian berdiskusi dengan DermAgent untuk memahami hasil tersebut menggunakan bahasa yang lebih sederhana.

> ⚠️ **Disclaimer:** DermAgent hanya memberikan informasi dan indikasi berbasis model AI. Confidence score bukan probabilitas diagnosis dan hasil sistem tidak menggantikan pemeriksaan atau diagnosis tenaga medis.

---

## ✨ Fitur Utama

### 🔍 1. AI Skin Detection

Mendeteksi kondisi kulit dari gambar menggunakan **YOLOv11 Nano** melalui Roboflow Inference API.

Model saat ini memiliki 7 kelas:

- Panu
- Kurap
- Bisul
- Herpes
- Varicella / Cacar Air
- Biduran
- Kutil

### 📷 2. Real-Time Camera Detection

Pengguna dapat menggunakan kamera untuk melakukan deteksi secara real-time.

Output utama:

- Bounding box
- Label kondisi kulit
- Confidence score

### 🖼️ 3. Image Upload Detection

Pengguna dapat mengunggah gambar kulit untuk dianalisis oleh model AI dan melihat hasil deteksinya secara visual.

### 🤖 4. DermAgent AI Assistant

Floating chatbot yang tersedia pada halaman utama, upload, dan camera.

DermAgent dapat membantu:

- Menjelaskan hasil deteksi.
- Menjelaskan arti confidence score.
- Menjawab pertanyaan mengenai kondisi kulit.
- Memberikan informasi umum berdasarkan knowledge base.
- Menjelaskan keterbatasan hasil AI.

### 🧠 5. Detection Context

DermAgent dapat menerima konteks hasil deteksi dari website.

Contoh:

```text
Penyakit: Panu
Confidence: 85%
```

Pengguna kemudian dapat bertanya:

> "Hasil deteksi saya menunjukkan Panu dengan confidence 85%. Apakah saya benar-benar terkena panu?"

DermAgent dapat memahami konteks tersebut tanpa pengguna harus memasukkan ulang hasil deteksi.

---

## 🏗️ Arsitektur Sistem

```text
                         USER
                           │
                  Upload Image / Camera
                           │
                           ▼
                  ┌─────────────────┐
                  │   YOLOv11 Nano  │
                  │    Roboflow     │
                  └────────┬────────┘
                           │
                    Label + Confidence
                           │
                           ▼
                  ┌─────────────────┐
                  │   DermAgent UI  │
                  │    Chatbot      │
                  └────────┬────────┘
                           │
                      User Question
                           │
                           ▼
                  ┌─────────────────┐
                  │  IBM Langflow   │
                  │ RAG + Prompt +  │
                  │ Language Model  │
                  └────────┬────────┘
                           │
                           ▼
                    AI Explanation
                           │
                           ▼
                          USER
```

### Peran Teknologi

| Komponen       | Fungsi                                             |
| -------------- | -------------------------------------------------- |
| HTML5          | Struktur halaman website                           |
| CSS3           | Styling, responsive UI, animasi                    |
| JavaScript     | Interaksi website dan integrasi API                |
| YOLOv11 Nano   | Model Computer Vision                              |
| Roboflow       | Deployment/inference model                         |
| IBM Langflow   | Workflow AI DermAgent                              |
| Knowledge Base | Sumber informasi DermAgent                         |
| Language Model | Menghasilkan respons percakapan                    |
| IBM Bob        | Development tool untuk membangun prototype website |

---

## 🤖 Integrasi IBM Langflow

IBM Langflow digunakan sebagai **AI workflow backend** untuk DermAgent.

Secara umum workflow DermAgent terdiri dari:

```text
User Question
      │
      ▼
Chat Input
      │
      ▼
Prompt / Instruction
      │
      ▼
Knowledge Base / Retrieval
      │
      ▼
Language Model
      │
      ▼
Chat Output
```

Website mengirimkan pertanyaan pengguna beserta konteks hasil deteksi ke Langflow API.

Contoh input:

```text
Hasil Deteksi Website:
- Penyakit/label model: Kurap
- Confidence: 90%
- Sumber: deteksi

Pertanyaan Pengguna:
Apakah saya pasti terkena kurap?
```

Langflow kemudian memproses konteks tersebut melalui workflow AI dan mengembalikan respons ke website.

### Endpoint Langflow

Prototype menggunakan endpoint lokal dengan pola:

```text
http://localhost:7860/api/v1/run/<FLOW_ID>
```

Flow ID DermAgent yang digunakan pada development:

```text
c6bc8a3a-c217-49fa-9f45-da4acc78383f
```

> API key tidak disimpan di repository. Gunakan placeholder pada konfigurasi lokal.

---

## 🧩 Peran IBM Bob

IBM Bob digunakan sebagai **development tool** untuk membantu proses pembuatan dan pengembangan prototype website.

Bob digunakan untuk membantu:

- Pengembangan struktur frontend.
- Pengembangan UI/UX.
- Pembuatan dan pengembangan JavaScript.
- Integrasi chatbot DermAgent.
- Debugging prototype.

Dalam implementasi prototype ini, **Bob bukan runtime chatbot**. Chatbot DermAgent pada website berkomunikasi langsung dengan workflow IBM Langflow melalui API.

Dengan demikian, pembagian perannya adalah:

```text
IBM Bob
   │
   │ Development
   ▼
Website Prototype
   │
   │ Runtime API Request
   ▼
IBM Langflow
   │
   ▼
AI Response
```

---

## 📁 Struktur Project

```text
hackathon_hacktiv8/
│
├── index.html              # Landing page / homepage
├── upload.html             # Upload image & detection
├── camera.html             # Real-time camera detection
│
├── assets/
│   └── logo.png
│
├── css/
│   ├── style.css           # Styling utama website
│   └── chatbot.css         # Styling DermAgent
│
├── js/
│   ├── script.js           # Roboflow + logika deteksi
│   └── chatbot.js          # Integrasi DermAgent + Langflow
│
└── README.md
```

---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/GilangAqshal/hackathon_hacktiv8
cd hackathon_hacktiv8
```

### 2. Konfigurasi Roboflow

Buka:

```text
js/script.js
```

Kemudian isi konfigurasi Roboflow sesuai project yang digunakan.

Contoh struktur:

```javascript
const ROBOFLOW_CONFIG = {
  apiKey: "YOUR_ROBOFLOW_API_KEY",
  modelId: "YOUR_MODEL_ID",
  version: 1,
};
```

**Jangan commit API key asli ke GitHub.**

### 3. Konfigurasi Langflow

Pastikan Langflow berjalan di:

```text
http://localhost:7860
```

Buka:

```text
js/chatbot.js
```

Kemudian isi API key Langflow secara lokal:

```javascript
const DERMAGENT_CONFIG = {
  endpoint:
    "http://localhost:7860/api/v1/run/c6bc8a3a-c217-49fa-9f45-da4acc78383f",
  apiKey: "YOUR_LANGFLOW_API_KEY",
  outputType: "chat",
  inputType: "chat",
};
```

### 4. Pastikan Flow DermAgent Aktif

Sebelum menjalankan website, pastikan:

1. Langflow sedang berjalan.
2. Flow DermAgent tersedia.
3. Language Model pada flow dapat memberikan respons.
4. Knowledge Base/RAG dapat digunakan.
5. Playground Langflow berhasil memberikan output.

### 5. Jalankan Website

Direkomendasikan menggunakan **VS Code Live Server**.

Alternatif menggunakan Python:

```bash
python -m http.server 8080
```

Kemudian buka:

```text
http://localhost:8080
```

Kamera browser membutuhkan **localhost atau HTTPS**.

---

## 💬 Cara Kerja DermAgent

Ketika pengguna mendapatkan hasil deteksi, website menyimpan hasil terakhir pada `sessionStorage`.

Contoh:

```text
Disease: Panu
Confidence: 85%
```

Ketika pengguna mengirim pertanyaan, `chatbot.js` membangun input:

```text
Hasil Deteksi Website:
- Penyakit/label model: Panu
- Confidence: 85%
- Sumber: deteksi

Pertanyaan Pengguna:
Apakah saya benar-benar terkena panu?
```

Input tersebut dikirim ke Langflow.

Langflow kemudian menghasilkan jawaban yang ditampilkan kembali di floating chatbot DermAgent.

---

## 📊 Performa Model

Hasil evaluasi model yang digunakan dalam prototype:

| Metrik        |     Hasil |
| ------------- | --------: |
| **mAP@50**    | **88.7%** |
| **Precision** | **83.3%** |
| **Recall**    | **89.9%** |
| **F1 Score**  | **86.5%** |

> Metrik tersebut merupakan hasil evaluasi model pada eksperimen project dan bukan jaminan akurasi diagnosis medis pada kondisi dunia nyata.

---

## 🛡️ Responsible AI

DermAgent dirancang dengan beberapa batasan untuk mengurangi risiko penggunaan AI secara keliru.

### Confidence bukan diagnosis

Confidence score menunjukkan tingkat keyakinan model terhadap prediksi berdasarkan input gambar. Nilai tersebut **tidak berarti probabilitas pengguna benar-benar menderita penyakit tersebut**.

Contoh:

```text
Panu — Confidence 85%
```

tidak boleh diterjemahkan menjadi:

```text
"Anda 85% pasti terkena panu."
```

### AI bukan pengganti tenaga medis

DermAgent memberikan informasi dan interpretasi awal. Pengguna tetap perlu berkonsultasi dengan tenaga medis untuk pemeriksaan dan diagnosis.

### Informasi berbasis Knowledge Base

Respons DermAgent diarahkan menggunakan knowledge base dan instruksi yang telah disiapkan untuk mengurangi jawaban yang tidak relevan atau tidak sesuai konteks project.

### Tidak memberikan diagnosis pasti

DermAgent menggunakan istilah seperti:

- Hasil deteksi
- Prediksi model
- Indikasi
- Confidence

bukan klaim diagnosis pasti.

---

## 🎯 Tujuan Project

Project ini dikembangkan untuk menyediakan pengalaman yang lebih sederhana dari:

```text
Gambar Kulit
     ↓
Deteksi AI
     ↓
Hasil Deteksi
     ↓
Penjelasan AI
     ↓
Pemahaman Pengguna
```

Tujuan utamanya bukan menggantikan dokter, tetapi membantu pengguna mendapatkan **informasi awal yang lebih mudah dipahami** sebelum mengambil langkah selanjutnya.

---

## 🔮 Pengembangan Selanjutnya

Beberapa pengembangan yang dapat dilakukan:

- Deployment Langflow ke cloud.
- Backend/proxy untuk menyembunyikan API key.
- Pengembangan dataset dan penambahan variasi gambar.
- Penambahan kelas kondisi kulit.
- Peningkatan evaluasi model pada data yang lebih beragam.
- Pengembangan aplikasi mobile.
- Integrasi konsultasi dengan tenaga medis.
- Analytics penggunaan dengan tetap memperhatikan privasi.

---

## 🧪 Contoh Pertanyaan untuk DermAgent

```text
Apa itu panu?
```

```text
Apa perbedaan panu dan kurap?
```

```text
Hasil deteksi saya menunjukkan Panu dengan confidence 85%. Apa artinya?
```

```text
Model mendeteksi Kurap dengan confidence 90%. Apakah saya pasti terkena kurap?
```

```text
Apa yang sebaiknya saya lakukan setelah mendapatkan hasil deteksi?
```

---

## 🏆 Hackathon

Project ini dikembangkan sebagai prototype untuk **Hackathon Hacktiv8 x IBM** dengan tema:

> **Healthcare & Wellbeing**

Project memanfaatkan IBM Langflow untuk membangun workflow AI DermAgent dan IBM Bob sebagai development tool dalam proses pengembangan prototype website.

---

## 👤 Project

**Repository:** `hackathon_hacktiv8`

**Project:** DermAgent — Deteksi Penyakit Kulit Berbasis AI

**AI Assistant:** DermAgent (Dermatology Agent)

**Domain:** Healthcare & Wellbeing

---

## 📄 License

Project ini dibuat sebagai prototype untuk kebutuhan hackathon dan pengembangan pembelajaran.

---

<p align="center">
  <strong>DermAgent</strong><br>
  <em>Detect. Understand. Take the Right Next Step.</em>
</p>
