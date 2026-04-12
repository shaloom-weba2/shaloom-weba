import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Routes, Route, Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Editor from "react-simple-code-editor";
// @ts-ignore
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";

import { 
  Terminal, 
  Shield, 
  Cpu, 
  Code, 
  Globe, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  MessageCircle,
  Music,
  ExternalLink, 
  ChevronRight,
  Menu,
  X,
  Lock,
  LayoutDashboard,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit,
  FileText,
  Eye,
  EyeOff,
  ExternalLink as ExternalLinkIcon,
  LogIn,
  Database,
  RefreshCw,
  ShieldAlert
} from "lucide-react";

import { auth, loginWithGoogle, loginWithEmail, logout, db, testFirestoreConnection } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { portfolioService } from "./services/portfolioService";
import CyberBackground3D from "./components/CyberBackground3D";
const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width={size} 
    height={size} 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.123.544 4.197 1.582 6.075L0 24l6.135-1.61a11.803 11.803 0 005.911 1.586h.005c6.632 0 12.028-5.396 12.033-12.034a11.82 11.82 0 00-3.48-8.504z"/>
  </svg>
);

import { PortfolioData, Project, Skill, BlogPost, Research, Message, Profile, DynamicPage } from "./types";

// --- Components ---

const Navbar = ({ 
  pages = [],
  platform
}: { 
  pages?: DynamicPage[],
  platform?: PortfolioData["platform"]
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const LogoIcon = () => {
    switch (platform?.logoIcon) {
      case "Shield": return <Shield className="text-cyber-neon group-hover:animate-pulse" />;
      case "Cpu": return <Cpu className="text-cyber-neon group-hover:animate-pulse" />;
      case "Code": return <Code className="text-cyber-neon group-hover:animate-pulse" />;
      case "Globe": return <Globe className="text-cyber-neon group-hover:animate-pulse" />;
      default: return <Terminal className="text-cyber-neon group-hover:animate-pulse" />;
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { name: "About", href: isHomePage ? "#about" : "/#about" },
    { name: "Skills", href: isHomePage ? "#skills" : "/#skills" },
    { name: "Projects", href: isHomePage ? "#projects" : "/#projects" },
    { name: "Research", href: isHomePage ? "#research" : "/#research" },
    { name: "Blog", href: isHomePage ? "#blog" : "/#blog" },
    { name: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ];

  const dynamicLinks = pages
    .filter(p => p.published && p.showInMenu)
    .map(p => ({ name: p.title, href: `/${p.slug}` }));

  const allLinks = [...navLinks, ...dynamicLinks];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md border-b border-cyber-neon/20 py-3" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-mono font-bold tracking-tighter flex items-center gap-2 group">
          <LogoIcon />
          <span className="text-white">{platform?.logoText1 || "CYBER"}</span>
          <span className="text-cyber-neon">{platform?.logoText2 || "CORE"}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {allLinks.map((link) => (
            link.href.startsWith("#") || link.href.startsWith("/#") ? (
              <a key={link.name} href={link.href} className="text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-cyber-neon transition-colors">
                {link.name}
              </a>
            ) : (
              <Link key={link.name} to={link.href} className="text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-cyber-neon transition-colors">
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-cyber-neon/20"
          >
            <div className="flex flex-col p-6 gap-4">
              {allLinks.map((link) => (
                link.href.startsWith("#") || link.href.startsWith("/#") ? (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-mono uppercase tracking-widest text-gray-400 hover:text-cyber-neon"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-mono uppercase tracking-widest text-gray-400 hover:text-cyber-neon"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-12">
    <div className="flex items-center gap-2 mb-2">
      <div className="h-[1px] w-8 bg-cyber-neon"></div>
      <span className="text-cyber-neon font-mono text-xs uppercase tracking-[0.3em]">{subtitle}</span>
    </div>
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
  </div>
);

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const MatrixBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);

    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const characters = charSet.split("");

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00f2ff"; // Using cyber-neon color
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0"
    />
  );
};

const FloatingHacker = ({ src, fallback }: { src: string, fallback?: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-24 right-6 z-40 w-24 h-24 md:w-32 md:h-32 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.05, 1],
        rotateX: -mousePos.y,
        rotateY: mousePos.x,
        y: [0, -10, 0]
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        ease: "easeInOut",
        rotateX: { type: "spring", stiffness: 100 },
        rotateY: { type: "spring", stiffness: 100 }
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative w-full h-full">
        {/* Glowing border */}
        <div className="absolute -inset-1 bg-cyber-neon/30 blur-md rounded-full animate-pulse"></div>
        
        {/* Image container */}
        <div className="relative w-full h-full rounded-full border-2 border-cyber-neon/50 overflow-hidden bg-black/20 backdrop-blur-sm">
          <img 
            src={src || fallback || undefined} 
            alt="Hacker Avatar" 
            className="w-full h-full object-cover transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          
          {/* Scanline effect on image */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-neon/5 to-transparent h-1/2 w-full animate-[scanline-vertical_4s_linear_infinite] pointer-events-none"></div>
        </div>

        {/* HUD Elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyber-neon/80"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyber-neon/80"></div>
      </div>
    </motion.div>
  );
};

const Typewriter = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleType = () => {
      if (!isDeleting) {
        if (displayText.length < text.length) {
          setDisplayText(text.substring(0, displayText.length + 1));
          setTypingSpeed(100 + Math.random() * 50);
        } else {
          timer = setTimeout(() => setIsDeleting(true), 3000);
          return;
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(text.substring(0, displayText.length - 1));
          setTypingSpeed(50);
        } else {
          timer = setTimeout(() => setIsDeleting(false), 1000);
          return;
        }
      }
      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, typingSpeed]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="inline-block w-[3px] h-[1.2em] ml-1 bg-cyber-neon animate-pulse align-middle"></span>
    </span>
  );
};

const Footer = ({ profile, platform }: { profile: Profile, platform?: PortfolioData["platform"] }) => {
  const LogoIcon = () => {
    switch (platform?.logoIcon) {
      case "Shield": return <Shield size={20} className="text-black" />;
      case "Cpu": return <Cpu size={20} className="text-black" />;
      case "Code": return <Code size={20} className="text-black" />;
      case "Globe": return <Globe size={20} className="text-black" />;
      default: return <Terminal size={20} className="text-black" />;
    }
  };

  return (
    <footer className="relative mt-20 border-t border-cyber-neon/20 bg-black/40 backdrop-blur-md pt-16 pb-8 overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 grid-background opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-cyber-neon rounded-sm flex items-center justify-center">
                <LogoIcon />
              </div>
              <span className="text-xl font-mono font-bold tracking-tighter uppercase">
                {platform?.logoText1 || profile.name.split(' ')[0]}<span className="text-cyber-neon">{platform?.logoText2 ? `.${platform.logoText2}` : ".OS"}</span>
              </span>
            </div>
            <p className="text-gray-400 font-mono text-sm max-w-md leading-relaxed">
              Advanced cyber-security specialist and full-stack architect. 
              Building secure, high-performance digital infrastructures for the next generation of the web.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-cyber-neon font-mono text-xs uppercase tracking-widest mb-6">Navigation</h4>
            <ul className="space-y-3 font-mono text-sm">
              <li><a href="#about" className="text-gray-500 hover:text-white transition-colors">/root/about</a></li>
              <li><a href="#projects" className="text-gray-500 hover:text-white transition-colors">/root/projects</a></li>
              <li><a href="#skills" className="text-gray-500 hover:text-white transition-colors">/root/skills</a></li>
              <li><a href="#blog" className="text-gray-500 hover:text-white transition-colors">/root/blog</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-cyber-neon font-mono text-xs uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex flex-wrap gap-4">
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-cyber-neon hover:text-cyber-neon transition-all" title="GitHub">
                <Github size={20} />
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-cyber-neon hover:text-cyber-neon transition-all" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              {profile.socials.instagram && (
                <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-cyber-neon hover:text-cyber-neon transition-all" title="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {profile.socials.tiktok && (
                <a href={profile.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-cyber-neon hover:text-cyber-neon transition-all" title="TikTok">
                  <Music size={20} />
                </a>
              )}
              {profile.socials.whatsapp && (
                <a href={profile.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2 border border-white/10 hover:border-cyber-neon hover:text-cyber-neon transition-all" title="WhatsApp">
                  <WhatsAppIcon size={20} />
                </a>
              )}
              <a href={`mailto:${profile.email}`} className="p-2 border border-white/10 hover:border-cyber-neon hover:text-cyber-neon transition-all" title="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Sticky WhatsApp Logo on the left side */}
        {profile.socials.whatsapp && (
          <div className="fixed bottom-8 left-8 z-50">
            <a 
              href={profile.socials.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon size={30} />
            </a>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} {profile.name} // All Rights Reserved // Encrypted Connection
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              SYSTEM_ONLINE
            </span>
            <span>LATENCY: 24MS</span>
            <span>V: 2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const DynamicPageRenderer = ({ pages }: { pages: DynamicPage[] }) => {
  const { slug } = useParams();
  const page = pages.find(p => p.slug === slug && p.published);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-mono text-cyber-pink mb-4">404: PAGE_NOT_FOUND</h1>
          <p className="text-gray-500 font-mono">The requested transmission could not be located.</p>
          <Link to="/" className="cyber-button mt-8 inline-block">Return to Base</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 pb-20 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading title={page.title} subtitle={page.description || "Dynamic Transmission"} />
        <div 
          className="mt-12 dynamic-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingItem, setEditingItem] = useState<{ type: string, data: any } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: "success" | "error" } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: any, id: string } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (location.pathname === "/weba") {
      setIsAdminMode(true);
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (editingItem?.type === "pages") {
      setPageContent(editingItem.data?.content || "");
      setIsPreviewMode(false);
    }
  }, [editingItem]);

  useEffect(() => {
    // Listen for Auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Listen for Firestore changes
    const unsubscribeData = onSnapshot(doc(db, "system/data"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data() as PortfolioData);
        setConnectionError(null);
        setLoading(false);
      } else {
        // If no data, we'll wait for admin to login to seed
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore error:", error);
      setConnectionError(error.message);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeData();
    };
  }, []);

  useEffect(() => {
    // If data is missing and user is admin, we can show a button to seed
    // instead of automatic seeding which might have race conditions
  }, [loading, data, user]);

  const seedInitialData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/data.json");
      if (response.ok) {
        const initialData = await response.json();
        await portfolioService.updateData(initialData);
        setData(initialData);
        showNotification("Database Initialized Successfully");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      showNotification("Failed to initialize database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.platform?.name) {
      document.title = data.platform.name;
    }
  }, [data?.platform?.name]);

  const handleLogin = async () => {
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    try {
      const loggedInUser = await loginWithGoogle();
      if (loggedInUser.email === "shaloomoficial250@gmail.com") {
        showNotification("Access Granted: Secure Session Initialized");
      } else {
        showNotification("Access Denied: Unauthorized Personnel", "error");
        await logout();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/popup-blocked") {
        showNotification("Popup Blocked: Please enable popups for this site", "error");
      } else if (error.code === "auth/cancelled-popup-request") {
        // Ignore user cancellation
      } else if (error.message?.includes("INTERNAL ASSERTION FAILED")) {
        showNotification("System Error: Please refresh and try again", "error");
      } else {
        showNotification("Authentication Failed", "error");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticating) return;
    
    setIsAuthenticating(true);
    try {
      const loggedInUser = await loginWithEmail(loginEmail, loginPassword);
      if (loggedInUser.email === "shaloomoficial250@gmail.com") {
        showNotification("Access Granted: Secure Session Initialized");
      } else {
        showNotification("Access Denied: Unauthorized Personnel", "error");
        await logout();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        showNotification("Invalid Credentials", "error");
      } else if (error.code === "auth/operation-not-allowed") {
        showNotification("Email/Password login is not enabled in Firebase Console", "error");
      } else {
        showNotification("Authentication Failed", "error");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAdminMode(false);
    showNotification("Session Terminated");
  };

  const handleUpdate = async (newData: PortfolioData) => {
    try {
      await portfolioService.updateData(newData);
      // Data will be updated via onSnapshot
      return true;
    } catch (error) {
      showNotification("Update Failed: Security Breach Detected", "error");
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "avatar" | "hackerImage") => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification("File too large. Max 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const success = await handleUpdate({
        ...data,
        profile: { ...data.profile, [field]: base64String }
      });
      if (success) {
        showNotification(`${field === "avatar" ? "Avatar" : "Hacker Image"} uploaded successfully`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (type: "projects" | "skills" | "blog" | "messages" | "pages" | "research", id: string) => {
    if (!data) return;
    setDeleteConfirmation({ type, id });
  };

  const confirmDelete = async () => {
    if (!data || !deleteConfirmation) return;
    const { type, id } = deleteConfirmation;

    const newData = { ...data };
    // @ts-ignore
    newData[type] = newData[type].filter((item: any) => item.id !== id);
    
    if (await handleUpdate(newData)) {
      showNotification("Item deleted successfully");
    }
    setDeleteConfirmation(null);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !editingItem) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const itemData = Object.fromEntries(formData);
    
    const newData = { ...data };
    const type = editingItem.type as "projects" | "skills" | "blog" | "pages" | "research";
    
    if (editingItem.data) {
      // Edit
      // @ts-ignore
      newData[type] = newData[type].map((item: any) => {
        if (item.id === editingItem.data.id) {
          const updatedItem = { 
            ...item, 
            ...itemData, 
            id: item.id,
            content: type === "pages" ? pageContent : itemData.content,
            tech: type === "projects" ? (itemData.tech as string).split(",").map(s => s.trim()) : item.tech,
            level: type === "skills" ? parseInt(itemData.level as string) : item.level,
            updatedAt: new Date().toISOString()
          };

          if (type === "pages") {
            // Auto-generate slug from title if not provided or just to keep it in sync
            updatedItem.slug = itemData.slug || (itemData.title as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            updatedItem.published = itemData.published === "on" || true; // Default to true if field removed
            updatedItem.showInMenu = itemData.showInMenu === "on" || true; // Default to true if field removed
          } else {
            updatedItem.published = itemData.published === "on";
            updatedItem.showInMenu = itemData.showInMenu === "on";
          }

          return updatedItem;
        }
        return item;
      });
    } else {
      // Add
      const newItem: any = {
        ...itemData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: type === "pages" ? pageContent : itemData.content,
        tech: type === "projects" ? (itemData.tech as string).split(",").map(s => s.trim()) : undefined,
        level: type === "skills" ? parseInt(itemData.level as string) : undefined,
      };

      if (type === "pages") {
        newItem.slug = itemData.slug || (itemData.title as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        newItem.published = itemData.published === "on" || true;
        newItem.showInMenu = itemData.showInMenu === "on" || true;
      } else {
        newItem.published = itemData.published === "on";
        newItem.showInMenu = itemData.showInMenu === "on";
      }

      // @ts-ignore
      newData[type] = [...newData[type], newItem];
    }

    if (await handleUpdate(newData)) {
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cyber-bg">
        <div className="w-48 h-1 bg-gray-800 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyber-neon"
            animate={{ left: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="mt-4 font-mono text-cyber-neon text-xs animate-pulse">INITIALIZING SECURE PROTOCOLS...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-bg p-6 grid-background relative overflow-hidden">
        <MatrixBackground />
        <div className="scanline"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-card max-w-lg w-full relative z-10 text-center border-cyber-pink/30"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-cyber-pink/10 rounded-full">
              <ShieldAlert className="text-cyber-pink" size={48} />
            </div>
          </div>
          
          <h2 className="text-2xl font-mono mb-4 text-cyber-pink">SYSTEM_OFFLINE</h2>
          
          <div className="bg-black/60 p-4 rounded border border-cyber-pink/20 mb-8 text-left font-mono text-xs space-y-2">
            <p className="text-gray-500"># DIAGNOSTIC_REPORT</p>
            <p className="text-white">STATUS: <span className="text-cyber-pink">DATA_UNREACHABLE</span></p>
            <p className="text-white">SOURCE: <span className="text-gray-400">FIRESTORE_CORE</span></p>
            {connectionError && (
              <p className="text-cyber-pink mt-2">ERROR: {connectionError}</p>
            )}
            <p className="text-gray-500 mt-4">// POSSIBLE_CAUSES:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Database not initialized</li>
              <li>Missing Firebase configuration</li>
              <li>Network connectivity issues</li>
              <li>Unauthorized domain (Vercel)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="cyber-button w-full flex items-center justify-center gap-3"
            >
              <RefreshCw size={20} />
              Retry Connection
            </button>
            
            <p className="text-[10px] text-gray-600 font-mono">
              ADMIN_ACCESS: Navigate to <span className="text-cyber-neon">/weba</span> to initialize system.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Admin View ---
  if (isAdminMode) {
    if (!user || user.email !== "shaloomoficial250@gmail.com") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-6 grid-background">
          <MatrixBackground />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card max-w-md w-full relative z-10"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-cyber-neon/10 rounded-full">
                <Shield className="text-cyber-neon" size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-mono text-center mb-6">ADMIN AUTHENTICATION</h2>
            <p className="text-gray-400 text-center font-mono text-sm mb-8">Identity verification required for secure terminal access.</p>
            
            {!showPasswordLogin ? (
              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  disabled={isAuthenticating}
                  className="cyber-button w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <LogIn size={20} />
                  )}
                  {isAuthenticating ? "Verifying..." : "Sign in with Google"}
                </button>
                
                <button
                  onClick={() => setShowPasswordLogin(true)}
                  className="w-full text-xs font-mono text-cyber-neon hover:underline transition-colors"
                >
                  Use Password Authentication
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="cyber-input w-full"
                    placeholder="admin@terminal.core"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-500 uppercase">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="cyber-input w-full"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="cyber-button w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Lock size={20} />
                  )}
                  {isAuthenticating ? "Authenticating..." : "Login with Password"}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowPasswordLogin(false)}
                  className="w-full text-xs font-mono text-cyber-neon hover:underline transition-colors"
                >
                  Back to Google Sign-in
                </button>
              </form>
            )}
            
            <button 
              type="button" 
              onClick={() => setIsAdminMode(false)}
              className="w-full mt-6 text-xs font-mono text-gray-500 hover:text-white transition-colors"
            >
              Return to Public Interface
            </button>
          </motion.div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-6 grid-background">
          <MatrixBackground />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card max-w-md w-full relative z-10 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-cyber-neon/10 rounded-full">
                <Database className="text-cyber-neon" size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-mono mb-4">DATABASE NOT INITIALIZED</h2>
            <p className="text-gray-400 font-mono text-sm mb-8">
              System data is missing from Firestore. Initialize the database using the local configuration?
            </p>
            <button
              onClick={seedInitialData}
              disabled={loading}
              className="cyber-button w-full flex items-center justify-center gap-3"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              {loading ? "Initializing..." : "Initialize Database"}
            </button>
            <button 
              type="button" 
              onClick={() => setIsAdminMode(false)}
              className="w-full mt-6 text-xs font-mono text-gray-500 hover:text-white transition-colors"
            >
              Return to Public Interface
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-cyber-bg flex flex-col md:flex-row relative">
        <MatrixBackground />
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-black border-r border-cyber-neon/20 p-6 flex flex-col gap-8 relative z-10">
          <div className="flex items-center gap-2">
            <Terminal className="text-cyber-neon" />
            <span className="font-mono font-bold text-white">ADMIN_CORE</span>
          </div>
          
          <div className="flex flex-col gap-2">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "platform", icon: Globe, label: "Platform" },
              { id: "projects", icon: Code, label: "Projects" },
              { id: "skills", icon: Cpu, label: "Skills" },
              { id: "research", icon: Shield, label: "Research" },
              { id: "blog", icon: FileText, label: "Blog" },
              { id: "pages", icon: FileText, label: "Pages" },
              { id: "messages", icon: MessageSquare, label: "Messages" },
              { id: "settings", icon: SettingsIcon, label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-mono text-sm transition-all ${activeTab === item.id ? "bg-cyber-neon/10 text-cyber-neon border-r-2 border-cyber-neon" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-500 font-mono text-sm hover:bg-red-500/10 w-full transition-all"
            >
              <LogOut size={18} />
              Terminate Session
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto relative z-10">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-mono uppercase tracking-widest">{activeTab}</h1>
            <div className="text-xs font-mono text-gray-500">SYSTEM STATUS: <span className="text-cyber-green">OPTIMAL</span></div>
          </header>

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="cyber-card">
                <p className="text-xs font-mono text-gray-500 mb-1 uppercase">Total Projects</p>
                <p className="text-3xl font-bold">{data.projects.length}</p>
              </div>
              <div className="cyber-card">
                <p className="text-xs font-mono text-gray-500 mb-1 uppercase">Unread Messages</p>
                <p className="text-3xl font-bold text-cyber-neon">{data.messages.length}</p>
              </div>
              <div className="cyber-card">
                <p className="text-xs font-mono text-gray-500 mb-1 uppercase">Blog Posts</p>
                <p className="text-3xl font-bold">{data.blog.length}</p>
              </div>
            </div>
          )}

          {activeTab === "platform" && (
            <div className="space-y-8">
              <div className="cyber-card">
                <h3 className="text-lg font-mono mb-4 border-b border-cyber-neon/20 pb-2">Platform Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Platform Name (SEO)</label>
                      <input 
                        type="text" 
                        value={data.platform.name}
                        onChange={(e) => handleUpdate({
                          ...data,
                          platform: { ...data.platform, name: e.target.value }
                        })}
                        className="cyber-input w-full" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Logo Text 1 (White)</label>
                        <input 
                          type="text" 
                          value={data.platform.logoText1}
                          onChange={(e) => handleUpdate({
                            ...data,
                            platform: { ...data.platform, logoText1: e.target.value }
                          })}
                          className="cyber-input w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Logo Text 2 (Neon)</label>
                        <input 
                          type="text" 
                          value={data.platform.logoText2}
                          onChange={(e) => handleUpdate({
                            ...data,
                            platform: { ...data.platform, logoText2: e.target.value }
                          })}
                          className="cyber-input w-full" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Logo Icon</label>
                      <select 
                        value={data.platform.logoIcon}
                        onChange={(e) => handleUpdate({
                          ...data,
                          platform: { ...data.platform, logoIcon: e.target.value }
                        })}
                        className="cyber-input w-full bg-black"
                      >
                        <option value="Terminal">Terminal</option>
                        <option value="Shield">Shield</option>
                        <option value="Cpu">CPU</option>
                        <option value="Code">Code</option>
                        <option value="Globe">Globe</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center border border-white/5 bg-black/40 p-8 rounded">
                    <p className="text-[10px] font-mono text-gray-600 uppercase mb-4 tracking-widest">Live Preview</p>
                    <div className="text-3xl font-mono font-bold tracking-tighter flex items-center gap-3">
                      {data.platform.logoIcon === "Shield" && <Shield className="text-cyber-neon" size={32} />}
                      {data.platform.logoIcon === "Cpu" && <Cpu className="text-cyber-neon" size={32} />}
                      {data.platform.logoIcon === "Code" && <Code className="text-cyber-neon" size={32} />}
                      {data.platform.logoIcon === "Globe" && <Globe className="text-cyber-neon" size={32} />}
                      {data.platform.logoIcon === "Terminal" && <Terminal className="text-cyber-neon" size={32} />}
                      <span className="text-white">{data.platform.logoText1}</span>
                      <span className="text-cyber-neon">{data.platform.logoText2}</span>
                    </div>
                    <p className="mt-6 text-[10px] font-mono text-gray-500 italic">Changes are saved automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <button 
                onClick={() => { setEditingItem({ type: "projects", data: null }); setIsModalOpen(true); }}
                className="cyber-button flex items-center gap-2"
              >
                <Plus size={18} /> Add New Project
              </button>
              <div className="grid grid-cols-1 gap-4">
                {data.projects.map((project) => (
                  <div key={project.id} className="cyber-card flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={project.image || undefined} alt="" className="w-16 h-10 object-cover rounded-sm" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-bold">{project.title}</h3>
                        <p className="text-xs text-gray-500">{project.tech.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingItem({ type: "projects", data: project }); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-cyber-neon"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete("projects", project.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <button 
                onClick={() => { setEditingItem({ type: "skills", data: null }); setIsModalOpen(true); }}
                className="cyber-button flex items-center gap-2"
              >
                <Plus size={18} /> Add New Skill
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="cyber-card flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{skill.name}</h3>
                      <p className="text-xs text-cyber-neon font-mono">{skill.category} // {skill.level}%</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingItem({ type: "skills", data: skill }); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-cyber-neon"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete("skills", skill.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "research" && (
            <div className="space-y-6">
              <button 
                onClick={() => { setEditingItem({ type: "research", data: null }); setIsModalOpen(true); }}
                className="cyber-button flex items-center gap-2"
              >
                <Plus size={18} /> Add New Research
              </button>
              <div className="grid grid-cols-1 gap-4">
                {data.research.map((item) => (
                  <div key={item.id} className="cyber-card flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-xs text-gray-500 truncate max-w-md">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingItem({ type: "research", data: item }); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-cyber-neon"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete("research", item.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-6">
              <button 
                onClick={() => { setEditingItem({ type: "blog", data: null }); setIsModalOpen(true); }}
                className="cyber-button flex items-center gap-2"
              >
                <Plus size={18} /> New Blog Post
              </button>
              <div className="space-y-4">
                {data.blog.map((post) => (
                  <div key={post.id} className="cyber-card flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{post.title}</h3>
                      <p className="text-xs text-gray-500 font-mono">{new Date(post.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingItem({ type: "blog", data: post }); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-cyber-neon"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete("blog", post.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pages" && (
            <div className="space-y-6">
              <button 
                onClick={() => { setEditingItem({ type: "pages", data: null }); setIsModalOpen(true); }}
                className="cyber-button flex items-center gap-2"
              >
                <Plus size={18} /> Create New Page
              </button>
              <div className="grid grid-cols-1 gap-4">
                {data.pages.map((page) => (
                  <div key={page.id} className="cyber-card flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{page.title}</h3>
                        {page.published ? (
                          <span className="text-[10px] bg-cyber-neon/20 text-cyber-neon px-2 py-0.5 rounded-full border border-cyber-neon/30 flex items-center gap-1">
                            <Eye size={10} /> Published
                          </span>
                        ) : (
                          <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full border border-gray-700 flex items-center gap-1">
                            <EyeOff size={10} /> Draft
                          </span>
                        )}
                        {page.showInMenu && (
                          <span className="text-[10px] bg-cyber-pink/20 text-cyber-pink px-2 py-0.5 rounded-full border border-cyber-pink/30">
                            In Menu
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono">/{page.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        to={`/${page.slug}`} 
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-cyber-neon"
                      >
                        <ExternalLinkIcon size={18} />
                      </Link>
                      <button 
                        onClick={() => { setEditingItem({ type: "pages", data: page }); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-cyber-neon"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete("pages", page.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-4">
              {data.messages.length === 0 ? (
                <p className="text-gray-500 font-mono italic">No incoming transmissions detected.</p>
              ) : (
                data.messages.map((msg) => (
                  <div key={msg.id} className="cyber-card">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-cyber-neon">{msg.subject}</h3>
                      <span className="text-xs font-mono text-gray-500">{new Date(msg.date).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">{msg.message}</p>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-400">From: {msg.name} ({msg.email})</span>
                      <button 
                        onClick={() => handleDelete("messages", msg.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8">
              <div className="cyber-card">
                <h3 className="text-lg font-mono mb-4 border-b border-cyber-neon/20 pb-2">Profile Assets</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Hacker Image URL (Top Right)</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        defaultValue={data.profile.hackerImage}
                        onBlur={(e) => handleUpdate({
                          ...data,
                          profile: { ...data.profile, hackerImage: e.target.value }
                        })}
                        className="cyber-input flex-1" 
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border border-cyber-neon/30 bg-cyber-neon/5 flex items-center justify-center overflow-hidden">
                        <img src={data.profile.hackerImage || data.profile.avatar || undefined} alt="Hacker Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <label className="cyber-button text-xs cursor-pointer">
                        Upload Local Image
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "hackerImage")}
                        />
                      </label>
                      <p className="text-[10px] font-mono text-gray-600">Or select a file from your computer.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Main Profile Avatar</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        defaultValue={data.profile.avatar}
                        onBlur={(e) => {
                          if (e.target.value !== data.profile.avatar) {
                            handleUpdate({
                              ...data,
                              profile: { ...data.profile, avatar: e.target.value }
                            });
                          }
                        }}
                        className="cyber-input flex-1" 
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <img src={data.profile.avatar || undefined} alt="Avatar" className="w-12 h-12 rounded-full border border-cyber-neon/30 object-cover" referrerPolicy="no-referrer" />
                      <label className="cyber-button text-xs cursor-pointer">
                        Upload Local File
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "avatar")}
                        />
                      </label>
                      <p className="text-[10px] font-mono text-gray-600">URL or local file. Max 5MB.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cyber-card">
                <h3 className="text-lg font-mono mb-4 border-b border-cyber-neon/20 pb-2">Section Visibility</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(data.settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 hover:bg-white/5 rounded transition-all">
                      <span className="text-sm font-mono text-gray-400">{key.replace("show", "")}</span>
                      <button 
                        onClick={() => handleUpdate({ ...data, settings: { ...data.settings, [key]: !value } })}
                        className={`w-12 h-6 rounded-full relative transition-colors ${value ? "bg-cyber-neon" : "bg-gray-800"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cyber-card">
                <h3 className="text-lg font-mono mb-4 border-b border-cyber-neon/20 pb-2">Security Protocols</h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget as HTMLFormElement);
                    const newPass = formData.get("newPassword") as string;
                    const confirmPass = formData.get("confirmPassword") as string;
                    
                    if (newPass !== confirmPass) {
                      alert("Error: Passwords do not match.");
                      return;
                    }
                    
                    if (newPass.length < 6) {
                      alert("Error: Password too weak. Minimum 6 characters.");
                      return;
                    }

                    handleUpdate({
                      ...data,
                      admin: { ...data.admin, passwordHash: newPass }
                    });
                    (e.target as HTMLFormElement).reset();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">New Access Key</label>
                    <input name="newPassword" type="password" className="cyber-input w-full" required />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Confirm Access Key</label>
                    <input name="confirmPassword" type="password" className="cyber-input w-full" required />
                  </div>
                  <button type="submit" className="cyber-button w-full">Update Security Credentials</button>
                </form>
              </div>
            </div>
          )}
        </div>

      {/* Admin Modals */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 z-[200] px-6 py-3 rounded-sm font-mono text-sm border ${notification.type === "success" ? "bg-cyber-neon/10 border-cyber-neon text-cyber-neon" : "bg-red-500/10 border-red-500 text-red-500"}`}
          >
            {notification.message}
          </motion.div>
        )}

        {deleteConfirmation && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="cyber-card max-w-sm w-full text-center"
            >
              <Shield className="text-red-500 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-mono uppercase mb-4">Confirm Deletion</h2>
              <p className="text-gray-400 mb-8">Are you sure you want to permanently remove this item from the database?</p>
              <div className="flex gap-4">
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2 bg-red-500 text-black font-mono uppercase tracking-widest hover:bg-red-600 transition-all"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 py-2 border border-white/20 text-white font-mono uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="cyber-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6 border-b border-cyber-neon/20 pb-4">
                  <h2 className="text-xl font-mono uppercase tracking-widest">
                    {editingItem?.data ? "Edit" : "Add"} {editingItem?.type}
                  </h2>
                  <div className="flex items-center gap-4">
                    {editingItem?.type === "pages" && (
                      <div className="flex bg-black/40 p-1 rounded border border-cyber-neon/20">
                        <button 
                          type="button"
                          onClick={() => setIsPreviewMode(false)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-all ${!isPreviewMode ? "bg-cyber-neon text-black" : "text-gray-500 hover:text-white"}`}
                        >
                          Code
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsPreviewMode(true)}
                          className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest transition-all ${isPreviewMode ? "bg-cyber-neon text-black" : "text-gray-500 hover:text-white"}`}
                        >
                          Preview
                        </button>
                      </div>
                    )}
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveItem} className="space-y-4">
                  {editingItem?.type === "projects" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Title</label>
                        <input name="title" defaultValue={editingItem.data?.title} className="cyber-input w-full" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Description</label>
                        <textarea name="description" defaultValue={editingItem.data?.description} className="cyber-input w-full" rows={3} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Image URL</label>
                          <input name="image" defaultValue={editingItem.data?.image} className="cyber-input w-full" required />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Tech (comma separated)</label>
                          <input name="tech" defaultValue={editingItem.data?.tech?.join(", ")} className="cyber-input w-full" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Live Link</label>
                          <input name="link" defaultValue={editingItem.data?.link} className="cyber-input w-full" required />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">GitHub Link</label>
                          <input name="github" defaultValue={editingItem.data?.github} className="cyber-input w-full" required />
                        </div>
                      </div>
                    </>
                  )}

                  {editingItem?.type === "skills" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Skill Name</label>
                        <input name="name" defaultValue={editingItem.data?.name} className="cyber-input w-full" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Category</label>
                          <select name="category" defaultValue={editingItem.data?.category || "Frontend"} className="cyber-input w-full">
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Security">Security</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Level (%)</label>
                          <input name="level" type="number" min="0" max="100" defaultValue={editingItem.data?.level || 80} className="cyber-input w-full" required />
                        </div>
                      </div>
                    </>
                  )}

                  {editingItem?.type === "research" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Title</label>
                        <input name="title" defaultValue={editingItem.data?.title} className="cyber-input w-full" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Description</label>
                        <textarea name="description" defaultValue={editingItem.data?.description} className="cyber-input w-full" rows={3} required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Link</label>
                        <input name="link" defaultValue={editingItem.data?.link} className="cyber-input w-full" required />
                      </div>
                    </>
                  )}

                  {editingItem?.type === "blog" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Title</label>
                        <input name="title" defaultValue={editingItem.data?.title} className="cyber-input w-full" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Content</label>
                        <textarea name="content" defaultValue={editingItem.data?.content} className="cyber-input w-full" rows={10} required />
                      </div>
                    </>
                  )}

                  {editingItem?.type === "pages" && (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1">Page Title</label>
                        <input name="title" defaultValue={editingItem.data?.title} className="cyber-input w-full" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-1 flex justify-between">
                          <span>Content Editor (HTML/CSS/JS)</span>
                          {!isPreviewMode && (
                            <button 
                              type="button"
                              onClick={() => {
                                // Simple formatting: indent by 2 spaces
                                const lines = pageContent.split('\n');
                                const formatted = lines.map(line => line.trim()).join('\n');
                                setPageContent(formatted);
                              }}
                              className="text-[10px] text-cyber-neon hover:underline"
                            >
                              Format
                            </button>
                          )}
                        </label>
                        
                        {isPreviewMode ? (
                          <div className="border border-cyber-neon/20 rounded bg-black/60 p-6 min-h-[400px] overflow-y-auto dynamic-content">
                            <div dangerouslySetInnerHTML={{ __html: pageContent }} />
                          </div>
                        ) : (
                          <div className="border border-cyber-neon/20 rounded bg-black/40 overflow-hidden flex">
                            <div className="bg-black/60 text-gray-600 p-3 text-right select-none border-r border-cyber-neon/10 min-w-[45px] font-mono text-[12px] leading-[1.5]">
                              {pageContent.split('\n').map((_, i) => (
                                <div key={i}>{i + 1}</div>
                              ))}
                            </div>
                            <div className="flex-1 overflow-x-auto">
                              <Editor
                                value={pageContent}
                                onValueChange={code => setPageContent(code)}
                                highlight={code => highlight(code, languages.js, 'javascript')}
                                padding={12}
                                style={{
                                  fontFamily: '"Fira code", "Fira Mono", monospace',
                                  fontSize: 12,
                                  minHeight: '400px',
                                  lineHeight: '1.5',
                                }}
                                className="outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-4 flex gap-4">
                    <button type="submit" className="cyber-button flex-1">Save Changes</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-white/20 text-white font-mono uppercase tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- Public View ---
  return (
    <div className="relative min-h-screen">
      <CyberBackground3D />
      <MatrixBackground />
      <FloatingHacker src={data.profile.hackerImage} fallback={data.profile.avatar} />
      <div className="scanline"></div>
      <Navbar pages={data.pages} platform={data.platform} />

      <Routes>
        <Route path="/" element={
          <>
            {/* Hero Section */}
            {data.settings.showHero && (
              <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden grid-background">
                <motion.div 
                  style={{ y: y1, opacity }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-bg/50 to-cyber-bg"
                ></motion.div>
                
                <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ y: y2 }}
                  >
                    <span className="text-cyber-neon font-mono text-sm tracking-[0.5em] uppercase mb-4 block">System Online</span>
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
                      {data.profile.name.split(" ")[0]} <span className="text-cyber-neon">{data.profile.name.split(" ")[1]}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-mono mb-10 max-w-2xl mx-auto min-h-[4rem] md:min-h-[3rem]">
                      <Typewriter text={data.profile.title} />
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-6">
                      <a href="#projects" className="cyber-button">View Projects</a>
                      <a href="#contact" className="px-6 py-2 border border-white/20 text-white font-mono uppercase tracking-widest hover:bg-white/5 transition-all">Contact Me</a>
                    </div>

                    <div className="mt-16 flex justify-center gap-8">
                      <a href={data.profile.socials.github} className="text-gray-500 hover:text-cyber-neon transition-colors"><Github /></a>
                      <a href={data.profile.socials.linkedin} className="text-gray-500 hover:text-cyber-neon transition-colors"><Linkedin /></a>
                      <a href={data.profile.socials.twitter} className="text-gray-500 hover:text-cyber-neon transition-colors"><Twitter /></a>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="absolute bottom-10 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-[1px] h-12 bg-gradient-to-b from-cyber-neon to-transparent"></div>
                </motion.div>
              </section>
            )}

            {/* About Section */}
            {data.settings.showAbout && (
              <section id="about" className="py-24 px-6 bg-black/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <SectionHeading title="About the Architect" subtitle="Background" />
                    <p className="text-lg text-gray-400 leading-relaxed mb-8">
                      {data.profile.bio}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="cyber-feature-card p-4">
                        <p className="text-cyber-neon font-mono text-xs uppercase mb-1">Location</p>
                        <p className="text-white">{data.profile.location}</p>
                      </div>
                      <div className="cyber-feature-card p-4">
                        <p className="text-cyber-neon font-mono text-xs uppercase mb-1">Experience</p>
                        <p className="text-white">5+ Years</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute -inset-4 border border-cyber-neon/20 rounded-sm"></div>
                    <div className="absolute -inset-2 border border-cyber-neon/40 rounded-sm"></div>
                    <img 
                      src={data.profile.avatar || undefined} 
                      alt="Profile" 
                      className="relative z-10 w-full aspect-square object-cover transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-cyber-neon text-black px-3 py-1 font-mono text-xs font-bold">VERIFIED_USER</div>
                  </motion.div>
                </div>
              </section>
            )}

            {/* Skills Section */}
            {data.settings.showSkills && (
              <section id="skills" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading title="Technical Arsenal" subtitle="Capabilities" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {["Frontend", "Backend", "Security"].map((cat) => (
                      <div key={cat} className="cyber-feature-card space-y-6">
                        <h3 className="text-xl font-mono text-cyber-neon flex items-center gap-2">
                          {cat === "Frontend" && <Globe size={20} />}
                          {cat === "Backend" && <Cpu size={20} />}
                          {cat === "Security" && <Shield size={20} />}
                          {cat}
                        </h3>
                        <div className="space-y-4">
                          {data.skills.filter(s => s.category === cat).map((skill) => (
                            <div key={skill.id} className="space-y-2">
                              <div className="flex justify-between text-sm font-mono">
                                <span className="text-white">{skill.name}</span>
                                <span className="text-cyber-neon">{skill.level}%</span>
                              </div>
                              <div className="h-1 bg-gray-800 w-full rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.level}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-cyber-neon"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects Section */}
            {data.settings.showProjects && (
              <section id="projects" className="py-24 px-6 bg-black/50">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading title="Featured Deployments" subtitle="Portfolio" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.projects.map((project, idx) => (
                      <TiltCard key={project.id}>
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="cyber-card group h-full"
                        >
                        <div className="relative h-64 mb-6 overflow-hidden">
                          <img 
                            src={project.image || undefined} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <a href={project.link} className="p-3 bg-cyber-neon text-black rounded-full hover:scale-110 transition-transform"><ExternalLink size={20} /></a>
                            <a href={project.github} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"><Github size={20} /></a>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyber-neon transition-colors">{project.title}</h3>
                        <p className="text-gray-400 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map(t => (
                            <span key={t} className="px-2 py-1 bg-cyber-neon/10 text-cyber-neon text-xs font-mono border border-cyber-neon/20">{t}</span>
                          ))}
                        </div>
                      </motion.div>
                    </TiltCard>
                  ))}
                  </div>
                </div>
              </section>
            )}

            {/* Research Section */}
            {data.settings.showResearch && (
              <section id="research" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading title="Security Research" subtitle="Intelligence" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.research.map((item) => (
                      <TiltCard key={item.id}>
                        <div className="cyber-card border-l-4 border-l-cyber-pink h-full">
                          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                          <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                          <a href={item.link} className="text-cyber-pink font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                            Access Report <ChevronRight size={14} />
                          </a>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Blog Section */}
            {data.settings.showBlog && (
              <section id="blog" className="py-24 px-6 bg-black/50">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading title="Terminal Logs" subtitle="Insights" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.blog.map((post) => (
                      <div 
                        key={post.id} 
                        className="cyber-feature-card flex flex-col h-full group hover:shadow-[0_0_30px_rgba(0,242,255,0.2)] transition-all duration-500"
                      >
                        <div className="font-mono text-cyber-neon text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyber-neon rounded-full animate-pulse"></span>
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-cyber-neon transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-cyber-neon/10 flex justify-between items-center">
                          <span className="text-[10px] font-mono text-gray-500 uppercase">Log_ID: {post.id.slice(0, 6)}</span>
                          <button className="text-cyber-neon text-xs font-mono hover:underline">Read_More</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section */}
            {data.settings.showContact && (
              <section id="contact" className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                  <SectionHeading title="Establish Connection" subtitle="Contact" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <p className="text-lg text-gray-400">
                        Interested in collaboration or security consultation? Send an encrypted message through the terminal.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-cyber-neon/10 rounded-full text-cyber-neon"><Mail size={20} /></div>
                          <div>
                            <p className="text-xs font-mono text-gray-500 uppercase">Email</p>
                            <p className="text-white">{data.profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-cyber-neon/10 rounded-full text-cyber-neon"><Globe size={20} /></div>
                          <div>
                            <p className="text-xs font-mono text-gray-500 uppercase">Location</p>
                            <p className="text-white">{data.profile.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form className="cyber-card space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const messageData = Object.fromEntries(formData) as any;
                      portfolioService.sendMessage(messageData)
                        .then(() => showNotification("Transmission Received: Message Sent Successfully"))
                        .catch(() => showNotification("Transmission Failed: Connection Error", "error"));
                      (e.target as HTMLFormElement).reset();
                    }}>
                      <div className="grid grid-cols-2 gap-4">
                        <input name="name" type="text" placeholder="NAME" className="cyber-input" required />
                        <input name="email" type="email" placeholder="EMAIL" className="cyber-input" required />
                      </div>
                      <input name="subject" type="text" placeholder="SUBJECT" className="cyber-input w-full" required />
                      <textarea name="message" placeholder="MESSAGE" rows={5} className="cyber-input w-full" required></textarea>
                      <button type="submit" className="cyber-button w-full">Send Transmission</button>
                    </form>
                  </div>
                </div>
              </section>
            )}
          </>
        } />
        <Route path="/:slug" element={<DynamicPageRenderer pages={data.pages} />} />
      </Routes>

      {/* Footer */}
      <Footer profile={data.profile} platform={data.platform} />
    </div>
  );
}
