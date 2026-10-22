import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Code2, 
  Cpu, 
  Layers, 
  Database, 
  Server, 
  Terminal, 
  CheckCircle2, 
  X, 
  ArrowUpRight, 
  Zap, 
  Sparkles, 
  GitBranch, 
  Copy, 
  Check, 
  Mail, 
  Send, 
  Clock, 
  Briefcase, 
  ShieldCheck,
  Activity,
  Phone,
  MapPin,
  GraduationCap,
  MessageSquare,
  Bot
} from 'lucide-react';

// --- Aniket's Projects Data with Deep-Dive Architecture & Case Studies ---
const PROJECTS_DATA = [
  {
    id: 'platform-axiom-rag',
    title: 'Platform Axiom — Enterprise Self-Correcting RAG',
    category: 'AI / GenAI',
    badge: 'Self-Correcting Agent',
    shortSummary: 'Cyclical Agentic RAG system built with LangGraph featuring dual validation loops (DocGrader & Hallucination Grader), multi-tenant hybrid search (Qdrant + BM25Plus RRF), and real-time FastAPI SSE streaming.',
    techStack: ['Python', 'LangGraph', 'FastAPI', 'Qdrant', 'BM25', 'SQLite', 'SSE', 'React'],
    metrics: [
      { label: 'Hallucination Drop', value: '-89%' },
      { label: 'Retrieval MRR', value: '0.91' },
      { label: 'P95 Stream TTFT', value: '<320ms' }
    ],
    overview: {
      problem: 'Enterprise document Q&A systems regularly fail when facing ambiguous queries, specialized domain jargon, or retrieved chunks that are irrelevant. Standard naive RAG feeds hallucinated or out-of-context text directly into generative LLMs without validation or corrective retry mechanisms.',
      solution: 'Architected SCORE, a cyclical state-graph agent in LangGraph with dual validation checkpoints: DocGrader to filter out non-relevant retrieval noise, and a Hallucination Grader with automated query reformulation loops. Implemented hybrid search combining dense vectors (Qdrant) and sparse BM25Plus via Reciprocal Rank Fusion (RRF).',
      architectureNodes: [
        { title: '1. Ingestion & Dynamic Chunking', desc: 'Recursive contextual token splitter with metadata retention (tenant_id, document_id, section, timestamp).' },
        { title: '2. Multi-Tenant Hybrid Search (Qdrant + BM25Plus)', desc: 'Dense vector embeddings combined with sparse BM25Plus keyword matching fused via Reciprocal Rank Fusion (RRF).' },
        { title: '3. DocGrader Node (Relevance Filter)', desc: 'Validates retrieved chunks against user intent; filters out non-relevant contexts before LLM ingestion.' },
        { title: '4. Generative Synthesis & Hallucination Grader', desc: 'Synthesizes grounded response, then verifies assertions against context. Flags hallucinations and triggers query reformulation fallbacks.' },
        { title: '5. FastAPI SSE Streaming & SQLite Persistence', desc: 'Real-time Server-Sent Events (SSE) stream tokens to the frontend while SQLite maintains session history.' }
      ],
      keyDecisions: [
        {
          decision: 'LangGraph State Graph over Linear Chains',
          rationale: 'Linear pipelines cannot recover from poor retrieval. LangGraph provides cyclic conditional branches allowing the agent to evaluate its own retrieved docs and rewrite queries autonomously.'
        },
        {
          decision: 'Hybrid Dense + BM25Plus via RRF over Dense-Only',
          rationale: 'Dense embeddings struggle with exact part numbers, acronyms, and alphanumeric codes. BM25Plus recovers exact lexical matches while dense vectors provide conceptual context.'
        },
        {
          decision: 'Server-Sent Events (SSE) over WebSockets',
          rationale: 'Unidirectional LLM token streaming is natively handled by HTTP SSE with standard connection headers and built-in client reconnection, without WebSocket state overhead.'
        }
      ],
      codeSnippet: {
        language: 'python',
        filename: 'rag_agent_graph.py',
        code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, List

class AgentState(TypedDict):
    question: str
    documents: List[dict]
    generation: str
    retry_count: int

# Define the Cyclical Workflow
workflow = StateGraph(AgentState)

workflow.add_node("retrieve_hybrid", retrieve_hybrid_qdrant_bm25)
workflow.add_node("grade_documents", doc_grader_node)
workflow.add_node("generate_response", generate_answer_node)
workflow.add_node("grade_hallucination", hallucination_grader_node)
workflow.add_node("reformulate_query", query_rewrite_fallback_node)

workflow.set_entry_point("retrieve_hybrid")
workflow.add_edge("retrieve_hybrid", "grade_documents")

# Conditional: If documents lack relevance, rewrite query
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {"generate": "generate_response", "rewrite": "reformulate_query"}
)

workflow.add_edge("reformulate_query", "retrieve_hybrid")
workflow.add_edge("generate_response", "grade_hallucination")

# Conditional: If hallucination detected, loop back with reflection
workflow.add_conditional_edges(
    "grade_hallucination",
    check_groundedness,
    {"grounded": END, "hallucinated": "reformulate_query"}
)

score_rag_agent = workflow.compile()`
      },
      results: [
        'Eliminated context hallucinations by 89% compared to traditional naive single-pass RAG.',
        'Hybrid RRF search improved Mean Reciprocal Rank (MRR) from 0.68 to 0.91 across technical documentation.',
        'Sub-320ms time-to-first-token (TTFT) achieved via FastAPI SSE streaming.'
      ],
      links: {
        github: 'https://github.com/aniket792001',
        live: 'https://github.com/aniket792001'
      }
    }
  },
  {
    id: 'project-pebble-fintech',
    title: 'Project Pebble — AI-Powered Fintech Micro-Financing Platform',
    category: 'Backend & Systems',
    badge: 'Production Fintech',
    shortSummary: 'High-availability microservices architecture powering 100+ REST APIs, Docker containerization, JWT/OAuth/RBAC security, a 99.34% accuracy XGBoost underwriting classifier, and Gemini-powered voice/chat.',
    techStack: ['Python', 'Flask', 'React Native', 'MongoDB', 'Docker', 'XGBoost', 'Gemini API', 'WebSockets'],
    metrics: [
      { label: 'Model Accuracy', value: '99.34%' },
      { label: 'REST APIs Shipped', value: '100+' },
      { label: 'Evaluation Latency', value: '<18ms' }
    ],
    overview: {
      problem: 'Fintech micro-financing platforms in emerging markets need rapid, sub-second credit decisioning while maintaining strict compliance, bulletproof security (preventing unauthorized privilege escalation), and intuitive voice-based onboarding for non-tech-savvy borrowers.',
      solution: 'Engineered a Docker-based microservices backend with Flask, MongoDB, and Redis. Built and benchmarked 10 classification algorithms, selecting an optimized XGBoost model achieving 99.34% accuracy. Integrated Google Gemini API for multimodal voice capture, speech-to-text, and conversational underwriting via WebSockets and WhatsApp.',
      architectureNodes: [
        { title: '1. Dockerized Microservices Topology', desc: 'Separated services for auth, credit evaluation, payment webhooks, messaging, and document storage.' },
        { title: '2. JWT/OAuth & RBAC Security Layer', desc: 'Stateless JWT verification, fine-grained role-based permissions, and token-bucket rate limiting on sensitive routes.' },
        { title: '3. Machine Learning Underwriting Pipeline', desc: 'XGBoost model benchmarked against 10 algorithms; features financial indicators, velocity metrics, and repayment history.' },
        { title: '4. Gemini Voice & WhatsApp Conversational Layer', desc: 'Voice capture with speech-to-text and text-to-speech for accessible borrower applications via WebSockets and WhatsApp API.' },
        { title: '5. Automated Testing & Verification', desc: 'Comprehensive Pytest suite validating API responses, schema integrity, and regression-free microservices deployment.' }
      ],
      keyDecisions: [
        {
          decision: 'XGBoost over Deep Neural Networks / Random Forest',
          rationale: 'Benchmarked 10 models. XGBoost achieved 99.34% accuracy with <18ms inference latency and explainable SHAP values needed for financial auditability.'
        },
        {
          decision: 'Microservices with Docker over Monolith',
          rationale: 'Isolated credit decisioning from conversational WhatsApp webhook traffic, preventing API bottlenecks during peak morning loan application windows.'
        },
        {
          decision: 'Gemini Voice Integration via WebSockets',
          rationale: 'Enabled natural spoken voice loan inquiries for rural/semi-urban applicants, boosting loan application completion rates significantly.'
        }
      ],
      codeSnippet: {
        language: 'python',
        filename: 'underwriting_service.py',
        code: `import xgboost as xgb
import numpy as np
from flask import Blueprint, request, jsonify
from services.auth import require_rbac
from services.gemini_voice import process_voice_application

credit_bp = Blueprint('credit', __name__)
model = xgb.XGBClassifier()
model.load_model("models/credit_xgboost_v2.json")

@credit_bp.route('/api/v1/underwrite', methods=['POST'])
@require_rbac(['borrower', 'loan_officer'])
def evaluate_loan_application():
    data = request.get_json()
    features = np.array([
        data['credit_score'],
        data['income_to_loan_ratio'],
        data['past_default_flags'],
        data['employment_duration_months'],
        data['monthly_cashflow_variance']
    ]).reshape(1, -1)
    
    # 99.34% accuracy XGBoost inference
    prob_approval = float(model.predict_proba(features)[0][1])
    is_approved = prob_approval >= 0.72
    
    return jsonify({
        "status": "APPROVED" if is_approved else "REVIEW_REQUIRED",
        "confidence_score": round(prob_approval, 4),
        "model_version": "xgboost-fintech-prod-v2"
    }), 200`
      },
      results: [
        'Built and shipped 100+ production RESTful APIs powering mobile and web applications.',
        'Achieved 99.34% classification accuracy on loan underwriting workflows across validation test sets.',
        'Seamless multimodal Gemini voice integration enabled real-time speech loan applications over WebSockets and WhatsApp.'
      ],
      links: {
        github: 'https://github.com/aniket792001',
        live: 'https://github.com/aniket792001'
      }
    }
  },
  {
    id: 'rag-document-qa',
    title: 'RAG-Based Document Q&A System',
    category: 'AI / GenAI',
    badge: 'Vector Search Pipeline',
    shortSummary: 'End-to-end question answering pipeline utilizing Hugging Face embeddings, FAISS vector search, and context-grounded LLM generation returning structured JSON with verifiable source citations.',
    techStack: ['Python', 'FastAPI', 'LangChain', 'Hugging Face', 'FAISS', 'Pydantic'],
    metrics: [
      { label: 'Citation Grounding', value: '100%' },
      { label: 'Query Latency', value: '<280ms' },
      { label: 'Recall Rate', value: '94.8%' }
    ],
    overview: {
      problem: 'Organizations struggle to extract verified facts from dense internal documentation. Off-the-shelf generative chat tools frequently fabricate policies and numbers without citing verifiable page or paragraph sources.',
      solution: 'Developed an efficient RAG pipeline utilizing recursive hierarchical document chunking, Hugging Face open-source embeddings, and a FAISS in-memory index. Built a high-performance FastAPI endpoint returning validated JSON containing both the answer and verifiable source document snippets.',
      architectureNodes: [
        { title: '1. Document Splitting & Hierarchy', desc: 'Recursive text splitters keeping semantic paragraphs intact with chapter and line index metadata.' },
        { title: '2. Hugging Face Dense Embeddings', desc: 'Generated sentence-transformer embeddings with normalized cosine similarity metrics.' },
        { title: '3. High-Speed FAISS Vector Index', desc: 'Fast Approximate Nearest Neighbor (ANN) index delivering sub-15ms vector similarity queries.' },
        { title: '4. Context-Grounded Prompting', desc: 'Prompt template constraining LLM reasoning strictly to verified retrieved chunks to prevent hallucination.' },
        { title: '5. FastAPI Structured JSON Endpoint', desc: 'Custom /ask REST endpoint enforcing Pydantic schemas with generated answer and cited reference links.' }
      ],
      keyDecisions: [
        {
          decision: 'FAISS Vector Index for In-Memory Retrieval',
          rationale: 'Zero external database dependency and ultra-low latency (<10ms) indexing for fast local and single-instance cloud deployment.'
        },
        {
          decision: 'Strict Source Citation Schema Enforcement',
          rationale: 'Required every generated sentence to be tagged with corresponding doc ID, ensuring verifiable audit trails for enterprise compliance.'
        }
      ],
      codeSnippet: {
        language: 'python',
        filename: 'qa_pipeline.py',
        code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

app = FastAPI(title="Context-Grounded Document Q&A")

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = FAISS.load_local("faiss_doc_index", embeddings, allow_dangerous_deserialization=True)

class AnswerResponse(BaseModel):
    query: str
    answer: str
    cited_sources: List[dict]

@app.post("/ask", response_model=AnswerResponse)
async def ask_documents(query: str):
    docs = vector_db.similarity_search_with_score(query, k=4)
    if not docs:
        raise HTTPException(status_code=404, detail="No relevant context found.")
    
    context_str = "\\n\\n".join([d[0].page_content for d in docs])
    answer = generate_grounded_answer(query=query, context=context_str)
    
    return AnswerResponse(
        query=query,
        answer=answer,
        cited_sources=[{"doc_id": d[0].metadata.get("id"), "score": float(d[1])} for d in docs]
    )`
      },
      results: [
        '100% cited source verification eliminating unverified generative assertions.',
        'Average response latency under 280ms on standard cloud instances.',
        'Production-ready FastAPI endpoint with complete OpenAPI / Swagger documentation.'
      ],
      links: {
        github: 'https://github.com/aniket792001',
        live: 'https://github.com/aniket792001'
      }
    }
  }
];

// --- Skills Data from Aniket's Resume ---
const SKILLS_DATA = {
  ai_ml: [
    { name: 'RAG & Agentic Systems', level: 'Advanced', note: 'LangGraph, LangChain, Self-Correcting RAG, Multi-Hop' },
    { name: 'LLMs & APIs', level: 'Expert', note: 'Gemini API, Hugging Face, Prompt Engineering, Evaluation' },
    { name: 'Vector DBs & Embeddings', level: 'Advanced', note: 'FAISS, Qdrant, BM25 / BM25Plus, RRF Hybrid Search' },
    { name: 'Machine Learning', level: 'Advanced', note: 'XGBoost (99.34%), Random Forest, Feature Engineering' }
  ],
  backend: [
    { name: 'Python', level: 'Expert', note: 'FastAPI, Flask, Asynchronous I/O, Celery, Pytest' },
    { name: 'REST & Microservices', level: 'Expert', note: '100+ APIs Shipped, Distributed Services, Architecture' },
    { name: 'Security & Auth', level: 'Advanced', note: 'JWT Authentication, OAuth2, RBAC, Rate Limiting' },
    { name: 'JavaScript & APIs', level: 'Proficient', note: 'Modern ES6+, WebSockets, REST Integration' }
  ],
  realtime_devops: [
    { name: 'Real-Time & Voice', level: 'Advanced', note: 'WebSockets (Flask-SocketIO), WhatsApp API, STT, TTS' },
    { name: 'Docker & Containers', level: 'Advanced', note: 'Microservices containerization, Multi-container Compose' },
    { name: 'Databases', level: 'Expert', note: 'MongoDB, MySQL, SQLite, Vector Databases' },
    { name: 'Git & Developer Tools', level: 'Expert', note: 'Git, GitHub, Linux, Cursor, VS Code, Postman' }
  ],
  frontend_mobile: [
    { name: 'React Native', level: 'Proficient', note: 'Fintech mobile apps, API integration, Unit testing' },
    { name: 'Streamlit', level: 'Advanced', note: 'AI dashboards, interactive model demos, rapid prototypes' },
    { name: 'Testing & QA', level: 'Advanced', note: 'Pytest, Backend API validation, End-to-end testing' },
    { name: 'System Design', level: 'Advanced', note: 'Cyclical graphs, low latency architectures, caching' }
  ]
};

// --- Career Experience & Education Journey ---
const EXPERIENCE_JOURNEY = [
  {
    role: 'AI Intern — Project Pebble',
    company: '1GEN',
    period: 'Jan 2026 – Aug 2026',
    description: 'AI-powered fintech micro-financing platform built with React Native, Flask, and MongoDB across a Docker-based microservices architecture.',
    achievements: [
      'Built 100+ RESTful APIs and integrated MongoDB to power core platform services across distributed microservices.',
      'Implemented JWT authentication, OAuth, and role-based access control (RBAC) with rate limiting and input validation to harden backend services.',
      'Benchmarked 10 classification algorithms and selected XGBoost, achieving 99.34% accuracy on financing-decision workflows.',
      'Integrated Gemini API for voice capture, speech-to-text, and text-to-speech, plus WebSocket-based real-time chat/calling and WhatsApp messaging integration.',
      'Wrote comprehensive unit and API tests (Pytest) for backend services and React Native app to catch regressions before release.'
    ]
  },
  {
    role: 'B.Tech in Artificial Intelligence & Data Science',
    company: "TPCT's College of Engineering, Dharashiv (Osmanabad)",
    period: '2022 – 2025',
    description: 'Specialized in Artificial Intelligence, Machine Learning algorithms, Data Structures, and Database Management Systems. Graduated with a 7.33 CGPA.',
    achievements: [
      'Hands-on research and development in Natural Language Processing and Vector Search systems.',
      'Engineered cyclical RAG systems with LangGraph and benchmarked tree-based ensemble models.',
      'Active participant in technical symposiums, hackathons, and open-source AI tooling.'
    ]
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [modalTab, setModalTab] = useState('architecture');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredProjects = selectedCategory === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    
    // Fallback direct mailto trigger
    window.location.href = `mailto:aniketkadam792001@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(contactForm.name)}&body=${encodeURIComponent(contactForm.message + '\\n\\nSender Email: ' + contactForm.email)}`;
    
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-100 tracking-tight text-lg">Aniket Kadam</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono">
                AI/ML & Backend Engineer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#projects" className="text-slate-400 hover:text-cyan-400 transition-colors">Case Studies</a>
            <a href="#skills" className="text-slate-400 hover:text-cyan-400 transition-colors hidden sm:block">Skills</a>
            <a href="#journey" className="text-slate-400 hover:text-cyan-400 transition-colors hidden md:block">Experience</a>
            <a 
              href="./Resume_Aniket_Kadam_AI_Engineer.pdf" 
              download 
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Resume PDF</span>
            </a>
            <a href="#contact" className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI/ML Engineer • GenAI Developer • Backend Architect</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
              Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Agentic RAG Systems</span> & High-Scale Microservices.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-3xl">
              I am <strong className="text-slate-200">Aniket Hauserao Kadam</strong>, an AI Engineer with production experience shipping fintech platforms, self-correcting RAG agents with LangGraph, and Gemini-powered multimodal voice integrations.
            </p>

            {/* CTAs and quick links */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a 
                href="#projects" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 transition-all"
              >
                <span>Explore Case Studies</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a 
                href="./Resume_Aniket_Kadam_AI_Engineer.pdf" 
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </a>

              <div className="flex items-center gap-2 pl-2">
                <a 
                  href="https://github.com/aniket792001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/aniket-kadam-79a200k1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:aniketkadam792001@gmail.com" 
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                  aria-label="Email Aniket"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Metrics Banner */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">99.34%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">XGBoost Accuracy</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">100+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">REST APIs Shipped</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">Dual Loop</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">LangGraph RAG Agent</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">8 Months</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Production AI Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS & CASE STUDIES SECTION */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 font-bold">
                <Code2 className="w-4 h-4" />
                <span>Engineered Projects</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
                Featured Case Studies & Systems
              </h2>
              <p className="text-slate-400 mt-2 max-w-xl text-sm sm:text-base">
                Click any case study to inspect the step-by-step system design, technical tradeoffs, and production code logic.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
              {['All', 'AI / GenAI', 'Backend & Systems'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="p-7">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-cyan-300">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {project.badge}
                    </span>
                  </div>

                  {/* Title & Short Summary */}
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {project.shortSummary}
                  </p>

                  {/* Measurable Metrics Chips */}
                  <div className="mt-6 grid grid-cols-3 gap-2.5 py-3 px-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="text-center">
                        <span className="block text-sm sm:text-base font-bold font-mono text-cyan-300">{m.value}</span>
                        <span className="block text-[10px] text-slate-400 uppercase tracking-tight">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-7 py-4 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                    Deep-Dive Available
                  </span>

                  <button 
                    onClick={() => {
                      setActiveModalProject(project);
                      setModalTab('architecture');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS & ARCHITECTURAL MATRIX SECTION */}
        <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Core Proficiencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Technical Stack & Architecture Matrix
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
              Technologies backed by hands-on production microservices, benchmarked models, and agentic workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* AI / LLM Matrix */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100">AI / ML / GenAI</h3>
              </div>
              <ul className="space-y-4">
                {SKILLS_DATA.ai_ml.map(skill => (
                  <li key={skill.name} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{skill.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend Matrix */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100">Backend & APIs</h3>
              </div>
              <ul className="space-y-4">
                {SKILLS_DATA.backend.map(skill => (
                  <li key={skill.name} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{skill.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Realtime, DB & DevOps */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100">DevOps & Databases</h3>
              </div>
              <ul className="space-y-4">
                {SKILLS_DATA.realtime_devops.map(skill => (
                  <li key={skill.name} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{skill.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frontend & Architecture */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-100">Mobile & Systems</h3>
              </div>
              <ul className="space-y-4">
                {SKILLS_DATA.frontend_mobile.map(skill => (
                  <li key={skill.name} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{skill.note}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* EXPERIENCE & JOURNEY SECTION */}
        <section id="journey" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 font-bold">
              <Clock className="w-4 h-4" />
              <span>Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Experience & Education
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
              Production engineering contributions and academic foundation in Artificial Intelligence.
            </p>
          </div>

          <div className="relative border-l border-slate-800 ml-4 sm:ml-6 space-y-12">
            {EXPERIENCE_JOURNEY.map((exp, idx) => (
              <div key={idx} className="relative pl-8 group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  {idx === 0 ? <Briefcase className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="text-lg font-bold text-slate-100">{exp.role}</h3>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-md w-fit">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-300 mb-3">{exp.company}</p>
                  <p className="text-sm text-slate-400 mb-4">{exp.description}</p>
                  
                  <ul className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2 font-bold">
                <Mail className="w-4 h-4" />
                <span>Contact Aniket</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
                Let's discuss AI architectures, GenAI pipelines, or full-time opportunities.
              </h2>
              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you're exploring production RAG pipelines, microservice backends, or looking for an AI/ML engineer for your team—feel free to reach out directly.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:aniketkadam792001@gmail.com" className="hover:text-cyan-400 transition-colors">
                    aniketkadam792001@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+91 9765618537</span>
                </div>

                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Pune, Maharashtra, India</span>
                </div>

                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span>Available for AI Engineer & Backend Roles</span>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form Card */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 relative">
              {contactSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-100">Draft Prepared!</h4>
                  <p className="text-sm text-slate-400 mt-2">
                    Your email client has been opened to send your note directly to aniketkadam792001@gmail.com.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Recruiter or Engineering Lead"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your.email@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell me about your role, team requirements, or project..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-sm resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Aniket</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Aniket Hauserao Kadam. AI/ML & Backend Engineer.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="https://github.com/aniket792001" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/aniket-kadam-79a200k1" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
            <a href="mailto:aniketkadam792001@gmail.com" className="hover:text-cyan-400 transition-colors">Email</a>
            <a href="./Resume_Aniket_Kadam_AI_Engineer.pdf" download className="hover:text-cyan-400 transition-colors">Resume</a>
          </div>
        </div>
      </footer>

      {/* DEEP-DIVE CASE STUDY MODAL */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60 sticky top-0 z-20">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60">
                    {activeModalProject.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    System Architecture & Blueprint
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                  {activeModalProject.title}
                </h3>
              </div>

              <button 
                onClick={() => setActiveModalProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40 flex gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
              <button 
                onClick={() => setModalTab('architecture')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'architecture'
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Architecture & Pipeline</span>
              </button>

              <button 
                onClick={() => setModalTab('decisions')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'decisions'
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Tradeoffs & Decisions</span>
              </button>

              <button 
                onClick={() => setModalTab('code')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'code'
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Implementation Code</span>
              </button>

              <button 
                onClick={() => setModalTab('results')}
                className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  modalTab === 'results'
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Metrics & Impact</span>
              </button>
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
              
              {/* Problem / Solution Executive Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div>
                  <h4 className="text-xs font-mono uppercase text-red-400 font-bold mb-1.5 flex items-center gap-1.5">
                    <span>The Engineering Problem</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {activeModalProject.overview.problem}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
                    <span>The Architectural Solution</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {activeModalProject.overview.solution}
                  </p>
                </div>
              </div>

              {/* TAB 1: ARCHITECTURE PIPELINE */}
              {modalTab === 'architecture' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                    <span>System Workflow & Pipeline Nodes</span>
                  </h4>
                  <div className="space-y-3">
                    {activeModalProject.overview.architectureNodes.map((node, i) => (
                      <div 
                        key={i} 
                        className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start gap-3 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200 text-sm">{node.title}</p>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{node.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: KEY DECISIONS */}
              {modalTab === 'decisions' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Architectural Tradeoffs & Technology Choices</span>
                  </h4>
                  <div className="space-y-3">
                    {activeModalProject.overview.keyDecisions.map((kd, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                          <span>{kd.decision}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-2 pl-6 leading-relaxed">
                          {kd.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CODE SNIPPET */}
              {modalTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      {activeModalProject.overview.codeSnippet.filename}
                    </span>

                    <button 
                      onClick={() => handleCopyCode(activeModalProject.overview.codeSnippet.code)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs p-4 overflow-x-auto leading-relaxed text-cyan-100 shadow-inner">
                    <pre>
                      <code>{activeModalProject.overview.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 4: RESULTS */}
              {modalTab === 'results' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Quantifiable Results & Measured Impact</span>
                  </h4>
                  <div className="space-y-3">
                    {activeModalProject.overview.results.map((res, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300/90 flex items-start gap-3 text-xs sm:text-sm">
                        <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com/aniket792001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View on GitHub</span>
                </a>
              </div>

              <button 
                onClick={() => setActiveModalProject(null)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}