'use client'

import { useEffect, useRef, useState, useLayoutEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

// ============================================
// NAVIGATION
// ============================================
function Navigation() {
    const navItems = [
        { id: 'hero', label: 'Home', icon: '🏠' },
        { id: 'about', label: 'About', icon: '👤' },
        { id: 'projects', label: 'Projects', icon: '🎮' },
        { id: 'experience', label: 'Experience', icon: '💼' },
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'contact', label: 'Connect', icon: '📬' },
    ]

    return (
        <nav className="nav-wrapper" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <div className="nav-collapsed">
                <div className="nav-tab-icon">
                    <div className="nav-tab-line" />
                    <div className="nav-tab-line" />
                    <div className="nav-tab-line" />
                </div>
            </div>
            <div className="nav-expanded">
                {navItems.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="nav-menu-item">
                        <span className="nav-item-icon">{item.icon}</span>
                        <span className="nav-item-label">{item.label}</span>
                    </a>
                ))}
            </div>
        </nav>
    )
}

// ============================================
// INTERACTIVE BUTTON - Simple Hover Effect
// ============================================
interface InteractiveButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    download?: string;
    target?: string;
    rel?: string;
}

function InteractiveButton({
    children,
    href,
    onClick,
    className = '',
    download,
    target,
    rel,
}: InteractiveButtonProps) {
    const content = (
        <div className="relative inline-flex items-center justify-center">
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )

    if (href) {
        return (
            <a href={href} download={download} target={target} rel={rel} className={className}>
                {content}
            </a>
        )
    }

    return (
        <div onClick={onClick} className={className}>
            {content}
        </div>
    )
}

// ============================================
// FLOATING DARTS ANIMATION (Japanese Red)
// ============================================
interface Dart {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    speedX: number;
    speedY: number;
    rotationSpeed: number;
    opacity: number;
    phase: number;
}

function FloatingDarts() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const dartsRef = useRef<Dart[]>([])
    const initializedRef = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Initialize darts - more darts, smaller size
        const NUM_DARTS = 35
        if (!initializedRef.current) {
            for (let i = 0; i < NUM_DARTS; i++) {
                dartsRef.current.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: 8 + Math.random() * 16, // Smaller: 8-24px instead of 20-50px
                    rotation: Math.random() * Math.PI * 2,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.25 - 0.08,
                    rotationSpeed: (Math.random() - 0.5) * 0.015,
                    opacity: 0.1 + Math.random() * 0.2,
                    phase: Math.random() * Math.PI * 2
                })
            }
            initializedRef.current = true
        }

        // Draw a dart shape
        const drawDart = (dart: Dart) => {
            ctx.save()
            ctx.translate(dart.x, dart.y)
            ctx.rotate(dart.rotation)
            ctx.globalAlpha = dart.opacity

            // Dart body (elongated triangle)
            ctx.beginPath()
            ctx.moveTo(dart.size, 0) // Tip
            ctx.lineTo(-dart.size * 0.6, -dart.size * 0.15)
            ctx.lineTo(-dart.size * 0.4, 0)
            ctx.lineTo(-dart.size * 0.6, dart.size * 0.15)
            ctx.closePath()
            ctx.fillStyle = '#c73e3a'
            ctx.fill()
            ctx.strokeStyle = '#a32e2a'
            ctx.lineWidth = 1
            ctx.stroke()

            // Flight (feathers) at the back
            ctx.beginPath()
            ctx.moveTo(-dart.size * 0.4, 0)
            ctx.lineTo(-dart.size * 0.7, -dart.size * 0.25)
            ctx.lineTo(-dart.size * 0.5, -dart.size * 0.1)
            ctx.lineTo(-dart.size * 0.6, 0)
            ctx.closePath()
            ctx.fillStyle = '#d45a55'
            ctx.fill()
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(-dart.size * 0.4, 0)
            ctx.lineTo(-dart.size * 0.7, dart.size * 0.25)
            ctx.lineTo(-dart.size * 0.5, dart.size * 0.1)
            ctx.lineTo(-dart.size * 0.6, 0)
            ctx.closePath()
            ctx.fillStyle = '#e85a55'
            ctx.fill()
            ctx.stroke()

            ctx.restore()
        }

        let animationId: number
        let time = 0

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            time += 0.01

            // Update and draw each dart
            for (const dart of dartsRef.current) {
                // Floating motion
                dart.x += dart.speedX + Math.sin(time + dart.phase) * 0.2
                dart.y += dart.speedY + Math.cos(time + dart.phase * 0.7) * 0.15
                dart.rotation += dart.rotationSpeed

                // Wrap around edges
                if (dart.x < -dart.size) dart.x = canvas.width + dart.size
                if (dart.x > canvas.width + dart.size) dart.x = -dart.size
                if (dart.y < -dart.size) dart.y = canvas.height + dart.size
                if (dart.y > canvas.height + dart.size) dart.y = -dart.size

                drawDart(dart)
            }

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    )
}

// ============================================
// HERO
// ============================================
function HeroSection() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
                <div className="animate-fade-in-up opacity-0 mb-6" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                    <span className="sketchy-badge">
                        <span className="w-2 h-2 rounded-full bg-gray-800 animate-pulse" />
                        Available for Opportunities
                    </span>
                </div>

                {/* Name with background */}
                <div className="animate-fade-in-up opacity-0 inline-block" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <div className="text-bg-wrapper">
                        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                            <span className="text-stroke-inverse">SUTAR</span>
                            <br />
                            <span className="text-stroke-inverse">ABHILASH</span>
                        </h1>
                    </div>
                </div>

                {/* Subtitle - Pop Art Style */}
                <div className="animate-fade-in-up opacity-0 mb-6" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                        <span className="pop-art-text">
                            <span className="pop-art-word">GAME</span>
                            <span className="pop-art-accent">PRODUCER</span>
                        </span>
                        <span className="pop-art-divider">◆</span>
                        <span className="pop-art-text">
                            <span className="pop-art-word">QA</span>
                            <span className="pop-art-accent">SPECIALIST</span>
                        </span>
                    </div>
                </div>

                {/* Quote - Japanese minimal style */}
                <div className="animate-fade-in-up opacity-0 mb-8" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    <div className="inline-flex items-center gap-3 px-4 py-2">
                        <div className="w-0.5 h-6 bg-gray-300 rounded-full" />
                        <p className="text-gray-700 text-sm tracking-wide">
                            <span className="font-medium">Play until you die, then</span>
                            <span className="font-bold text-gray-900 mx-1">RESPAWN!</span>
                        </p>
                        <div className="w-0.5 h-6 bg-gray-300 rounded-full" />
                    </div>
                </div>

                <div className="animate-fade-in-up opacity-0 flex flex-col sm:flex-row gap-4 justify-center mb-12" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                    <InteractiveButton href="#projects" className="btn-black">
                        View Projects
                    </InteractiveButton>
                    <InteractiveButton href="/Abh17ash.pdf" download="Sutar_Abhilash_Resume.pdf" className="btn-white">
                        Download CV
                    </InteractiveButton>
                </div>

                <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                    <div className="sketchy-card inline-flex flex-col items-center gap-3 p-6">
                        <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">Latest Project</span>
                        <div className="flex items-center gap-4">
                            <span className="sketchy-badge-dark">Coming Soon</span>
                            <span className="text-gray-900 font-bold" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Darts VR 2: BullsEye</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://store.playstation.com/pl-pl/concept/10010616" target="_blank" rel="noopener noreferrer" className="btn-white-small flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.153 0-3.236-1.755-4.816-4.389-5.539-1.323-.37-3.618-.65-5.442-.789zm-2.456 9.795l-3.603 1.341c-.656.244-.798.658-.238.921.577.27 1.541.198 2.199-.054l1.642-.622v2.218l-.297.1c-.67.224-1.595.318-2.42.196-1.433-.201-2.153-.845-2.083-1.872.073-1.03.959-1.821 2.209-2.284l3.591-1.354v1.31zm12.324 1.48l1.62-.609v1.902l-1.62.609v-1.902zm-3.602 1.354l3.602-1.354v1.902l-3.602 1.354v-1.902zm-1.62.609l3.602 1.354v1.902l-3.602-1.354v-1.902z" />
                                </svg>
                                <span className="font-bold">PlayStation</span>
                            </a>
                            <a href="https://store.steampowered.com/app/2873180/Darts_VR_2_Bullseye/" target="_blank" rel="noopener noreferrer" className="btn-white-small flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-3.86 2.74-7.09 6.38-7.84l2.53 1.05-.01.01c-.32-.07-.65-.11-.99-.11-2.76 0-5 2.24-5 5s2.24 5 5 5c2.76 0 5-2.24 5-5 0-.42-.06-.83-.16-1.22l1.71-2.35C19.14 8.18 20 9.99 20 12c0 4.41-3.59 8-8 8zm-2-8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
                                </svg>
                                <span className="font-bold">Steam</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Location with background */}
                <div className="animate-fade-in-up opacity-0 mt-12 mb-16 inline-block" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                    <div className="text-bg-wrapper-location px-4 py-2 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-sm text-gray-900 font-bold">Warsaw, Poland</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
        </section>
    )
}

// ============================================
// ABOUT
// ============================================
function AboutSection() {
    return (
        <section id="about" className="relative py-24 px-6 bg-section">
            <div className="max-w-6xl mx-auto">
                <div className="section-header">
                    <div className="sketchy-line flex-1" />
                    <h2 className="section-title"><span className="section-number">01.</span> <span className="section-icon">👤</span> About</h2>
                    <div className="sketchy-line flex-1" />
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <p className="text-lg text-gray-800 leading-relaxed">
                            I am an aspiring Producer currently enhancing my skills at <span className="font-bold text-gray-900">Futuregames Warsaw</span>. I have a solid understanding of game development and its challenges.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            My practical experience includes managing community events, identifying production risks, and collaborating with developers to address issues. I am eager to leverage this hands-on experience to support teams in delivering exceptional games on schedule.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Having witnessed the final stages of production (QA), I am now prepared to oversee the entire process as a Producer.
                        </p>

                        <div className="sketchy-card p-6">
                            <div className="flex items-start gap-4">
                                <div className="sketchy-icon-box">
                                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-bold mb-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Key Achievement</h3>
                                    <p className="text-gray-600 text-sm">Handled QA for <span className="font-bold">Darts VR 2: BullsEye</span> across PSVR & Meta VR platforms, collaborating with a two-person support team.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {[{ num: '3+', label: 'Years in Gaming' }, { num: '5', label: 'Languages' }, { num: '5+', label: 'Games Shipped' }, { num: 'VR', label: 'Specialist' }].map((stat, i) => (
                            <div key={i} className="sketchy-card p-6 text-center">
                                <div className="sketchy-text-shadow text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>{stat.num}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// PROJECTS
// ============================================
interface Project {
    title: string;
    studio: string;
    description: string;
    fullStory: string;
    role: string;
    platform: string;
    status: string;
    link?: string;
    links?: { url: string }[];
    featured?: boolean;
    award?: string;
    clients?: string[];
    image?: string;
    youtubeId?: string; // YouTube video ID for trailer
}

function ProjectsSection() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    const projects: Project[] = [
        {
            title: 'Darts VR 2: BullsEye',
            studio: 'Gamitronics Studios',
            description: 'The most true to life esports Darts game.',
            fullStory: 'Darts VR 2: BullsEye is the most authentic darts simulation ever created for virtual reality platforms. Built from the ground up for PS VR2, Meta Quest, and PC VR, it features precision hand tracking, realistic physics simulation, and professional tournament modes. Players can compete in career mode, challenge friends online, or practice in custom environments. The game includes licensed dart designs, real-world venues, and commentary from professional darts players. As QA Game Tester, I was responsible for testing across all VR platforms, identifying physics bugs, tracking issues, and ensuring gameplay felt authentic to the real sport.',
            role: 'QA Game Tester',
            platform: 'PS VR, Meta VR, PC VR',
            status: 'announced',
            links: [{ url: 'https://store.playstation.com/pl-pl/concept/10010616' }, { url: 'https://store.steampowered.com/app/2873180/Darts_VR_2_Bullseye/' }],
            featured: true,
            youtubeId: '9bhi99V5qXU' // Darts VR 2 trailer
        },
        {
            title: 'Murder Mystery',
            studio: 'Vincell Studios',
            description: 'A crime thriller with logic puzzles.',
            fullStory: 'Murder Mystery is an immersive detective game that combines crime thriller storytelling with challenging logic puzzles. Players step into the shoes of a brilliant detective investigating complex murder cases filled with love, drama, betrayal, and suspense. Each case features multiple suspects, branching storylines, and various endings based on the evidence you gather. The game challenges players to interrogate suspects, analyze crime scenes, and piece together clues using deductive reasoning. With its gripping narrative and brain-teasing puzzles, Murder Mystery keeps players engaged as they uncover dark secrets and bring criminals to justice.',
            role: 'Jr. Game Tester',
            platform: 'Mobile',
            status: 'released',
            link: 'https://play.google.com/store/apps/details?id=com.vincellstudios.murdermystery&pcampaignid=web_share'
        },
        {
            title: 'Secret Agent',
            studio: 'Vincell Studios',
            description: 'Play as Agent Falcon, a rookie spy.',
            fullStory: 'Secret Agent puts players in the role of Agent Falcon, a rookie spy on a dangerous mission to save the world from a shadowy organization. Navigate through enemy territories using stealth mechanics, outsmart enemy agents with clever gadgets, crack complex codes, and uncover secret plots that threaten global security. The game features pulse-pounding action sequences, espionage mini-games, and moral choices that affect the story outcome. With its blend of stealth gameplay, puzzle-solving, and narrative-driven missions, Secret Agent delivers an authentic spy thriller experience.',
            role: 'Jr. Game Tester',
            platform: 'Mobile',
            status: 'released',
            link: 'https://play.google.com/store/apps/details?id=com.vincellstudios.hiddenescapespyagent'
        },
        {
            title: 'PartyNite Metaverse',
            studio: 'Gamitronics Studios',
            description: 'India\'s metaverse for socializing.',
            fullStory: 'PartyNite is India\'s premier metaverse platform designed for social events, virtual parties, and interactive gatherings. Users can create custom avatars, build personalized spaces, attend virtual concerts, host events, and connect with friends in immersive 3D environments. The platform has partnered with major brands including Airtel, Van Heusen, and ENO to deliver exclusive branded experiences and virtual events. PartyNite supports multiple platforms including PC, Mobile, and VR, making it accessible to users across different devices. The metaverse features live events, multiplayer games, and social spaces where communities can thrive.',
            role: 'QA Game Tester',
            platform: 'PC, Mobile & VR',
            status: 'released',
            clients: ['Airtel', 'Van Heusen', 'ENO'],
            link: 'https://play.google.com/store/search?q=partynite&c=apps',
            youtubeId: '7XC2nqlYFCM' // PartyNite trailer
        },
        {
            title: 'SoapBox Racing',
            studio: 'Futuregames',
            description: 'Fast-paced downhill racing game.',
            fullStory: 'SoapBox Racing is a fast-paced downhill racing game where physics meets chaos! Players build custom soapbox racers with various parts and modifications, then race down treacherous tracks filled with obstacles, jumps, tight corners, and hidden shortcuts. The game features realistic physics simulation, vehicle customization, and competitive multiplayer modes. Compete against AI opponents or challenge friends in split-screen multiplayer races. This project won 1st Place at the Futuregames Game Jam, judged by industry veterans from CD Projekt RED, Activision, and Flying Wild Hog. As Game Producer, I led the team through rapid prototyping, milestone planning, and final delivery.',
            role: 'Game Producer',
            platform: 'PC',
            status: 'released',
            award: '1st Place - CD Projekt RED, Activision & Flying Wild Hog',
            link: 'https://futuregames.itch.io/soapbox-racing',
            youtubeId: 'ZIDo3iyM3bU' // SoapBox Racing trailer
        },
    ]

    return (
        <section id="projects" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="section-header">
                    <div className="sketchy-line flex-1" />
                    <h2 className="section-title"><span className="section-number">02.</span> <span className="section-icon">🎮</span> Projects</h2>
                    <div className="sketchy-line flex-1" />
                </div>

                {/* Project Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p, i) => (
                        <div
                            key={i}
                            className={`sketchy-card project-card cursor-pointer ${p.featured ? 'md:col-span-2 lg:col-span-3' : ''}`}
                            onClick={() => setSelectedProject(p)}
                        >
                            <div className={`p-6 ${p.featured ? 'lg:p-8' : ''}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={p.status === 'announced' ? 'sketchy-badge-dark' : 'sketchy-badge'}>{p.status === 'announced' ? 'Coming Soon' : 'Released'}</span>
                                            {p.award && <span className="sketchy-badge-gold">★ Award</span>}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>{p.title}</h3>
                                        <p className="text-gray-500 text-sm">{p.studio}</p>
                                    </div>
                                    {(p.links || p.link) && (
                                        <a
                                            href={p.link || p.links?.[0]?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-white-small flex items-center gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            <span className="font-bold">View</span>
                                        </a>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{p.description}</p>
                                {p.award && <div className="sketchy-box p-3 mb-4"><p className="text-gray-700 text-xs">{p.award}</p></div>}
                                <div className="flex gap-8">
                                    <div><span className="text-xs text-gray-400 uppercase">Role</span><p className="text-sm text-gray-800">{p.role}</p></div>
                                    <div><span className="text-xs text-gray-400 uppercase">Platform</span><p className="text-sm text-gray-600">{p.platform}</p></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-[#c73e3a] font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                        Click to see full story
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Expanded Project Modal */}
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            className="project-expanded-card w-full max-w-4xl max-h-[85vh] overflow-y-auto"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8">
                                {/* Close Button */}
                                <button
                                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white border-2 border-[#c73e3a] text-[#c73e3a] hover:bg-[#c73e3a] hover:text-white transition-all"
                                    onClick={() => setSelectedProject(null)}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>

                                {/* Header */}
                                <div className="flex items-start justify-between mb-6 pr-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={selectedProject.status === 'announced' ? 'sketchy-badge-dark' : 'sketchy-badge'}>
                                                {selectedProject.status === 'announced' ? 'Coming Soon' : 'Released'}
                                            </span>
                                            {selectedProject.award && <span className="sketchy-badge-gold">★ Award Winner</span>}
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-800 mb-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                            {selectedProject.title}
                                        </h3>
                                        <p className="text-gray-500 text-lg">{selectedProject.studio}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mb-6">
                                    {selectedProject.links && selectedProject.links.length > 1 ? (
                                        <div className="flex gap-3">
                                            <a
                                                href={selectedProject.links[0].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-white-small flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.153 0-3.236-1.755-4.816-4.389-5.539-1.323-.37-3.618-.65-5.442-.789z" />
                                                </svg>
                                                <span className="font-bold">PlayStation</span>
                                            </a>
                                            <a
                                                href={selectedProject.links[1].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-white-small flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-3.86 2.74-7.09 6.38-7.84l2.53 1.05c-.32-.07-.65-.11-.99-.11-2.76 0-5 2.24-5 5s2.24 5 5 5c2.76 0 5-2.24 5-5 0-.42-.06-.83-.16-1.22l1.71-2.35C19.14 8.18 20 9.99 20 12c0 4.41-3.59 8-8 8z" />
                                                </svg>
                                                <span className="font-bold">Steam</span>
                                            </a>
                                        </div>
                                    ) : (selectedProject.link || selectedProject.links?.[0]) && (
                                        <a
                                            href={selectedProject.link || selectedProject.links?.[0]?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-black flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            <span className="font-bold">View Project</span>
                                        </a>
                                    )}
                                </div>

                                {/* Full Story */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                        <span className="text-[#c73e3a]">📖</span> The Story
                                    </h4>
                                    <p className="text-gray-700 text-base leading-relaxed">
                                        {selectedProject.fullStory}
                                    </p>
                                </div>

                                {/* Video Trailer Section - Only show if youtubeId exists */}
                                {selectedProject.youtubeId && (
                                    <div className="mb-6">
                                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                            <span className="text-[#c73e3a]">🎬</span> Trailer
                                        </h4>
                                        <div className="youtube-embed-container">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${selectedProject.youtubeId}?rel=0&modestbranding=1`}
                                                title={`${selectedProject.title} Trailer`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Award */}
                                {selectedProject.award && (
                                    <div className="sketchy-box p-4 mb-6">
                                        <p className="text-gray-700 font-bold flex items-center gap-2">
                                            <span className="text-[#d4a84b]">🏆</span> {selectedProject.award}
                                        </p>
                                    </div>
                                )}

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 border-2 border-[#c73e3a]">
                                        <span className="text-xs text-gray-400 uppercase block mb-1">Role</span>
                                        <p className="text-sm font-bold text-gray-800">{selectedProject.role}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 border-2 border-[#c73e3a]">
                                        <span className="text-xs text-gray-400 uppercase block mb-1">Platform</span>
                                        <p className="text-sm font-bold text-gray-600">{selectedProject.platform}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 border-2 border-[#c73e3a]">
                                        <span className="text-xs text-gray-400 uppercase block mb-1">Status</span>
                                        <p className="text-sm font-bold text-gray-600">{selectedProject.status === 'announced' ? 'Coming Soon' : 'Released'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 border-2 border-[#c73e3a]">
                                        <span className="text-xs text-gray-400 uppercase block mb-1">Studio</span>
                                        <p className="text-sm font-bold text-gray-600">{selectedProject.studio}</p>
                                    </div>
                                </div>

                                {/* Clients */}
                                {selectedProject.clients && (
                                    <div className="mb-4">
                                        <span className="text-xs text-gray-400 uppercase">Notable Clients</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedProject.clients.map((client, i) => (
                                                <span key={i} className="sketchy-tag">{client}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

// ============================================
// EXPERIENCE
// ============================================
interface Experience {
    title: string;
    subtitle: string;
    company: string;
    companyUrl: string;
    location: string;
    period: string;
    highlights: string[];
    fullStory: string;
    achievements: string[];
    technologies: string[];
    projects: string[];
    current: boolean;
}

function ExperienceSection() {
    const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)

    const experiences: Experience[] = [
        {
            title: 'QA Game Tester',
            subtitle: 'Production Support',
            company: 'Gamitronics',
            companyUrl: 'https://gamitronics.com/',
            location: 'Hyderabad',
            period: '04/2022 - 03/2025',
            highlights: ['QA for Darts VR 2 across PS VR to Meta VR', 'Daily stand-ups and sprint meetings', 'Live Metaverse events for Airtel, Van Heusen, ENO'],
            fullStory: 'At Gamitronics, I served as a QA Game Tester with production support responsibilities, working on cutting-edge VR titles and metaverse experiences. My role evolved from pure quality assurance to taking on production-adjacent responsibilities, giving me invaluable insight into the game development lifecycle. I was the sole QA responsible for Darts VR 2: BullsEye across multiple VR platforms including PlayStation VR2, Meta Quest, and PC VR, working directly with developers to identify and resolve critical issues before launch.',
            achievements: [
                'Directed end-to-end QA testing for Darts VR 2: BullsEye across PlayStation VR2, Meta Quest, and PC VR platforms',
                'Collaborated with cross-functional teams including developers, artists, and producers in daily stand-ups and sprint planning',
                'Managed live metaverse events for major clients including Airtel, Van Heusen, and ENO',
                'Developed comprehensive test plans and bug tracking documentation',
                'Identified and documented over 500+ bugs across multiple projects',
                'Participated in localization testing for multiple language support'
            ],
            technologies: ['Unity', 'JIRA', 'Meta Quest Developer Hub', 'PlayStation Dev Kits', 'Test Management Tools', 'Git'],
            projects: ['Darts VR 2: BullsEye', 'PartyNite Metaverse', 'Client Branded Experiences'],
            current: true
        },
        {
            title: 'Jr. Game Tester',
            subtitle: 'Intern to Full-time',
            company: 'Vincell Studios',
            companyUrl: 'https://vincellstudios.com/games.html',
            location: 'Bangalore',
            period: '08/2021 - 04/2022',
            highlights: ['Trained new QA testers', 'Optimized Unity testing workflows', 'Murder Mystery, Lost Temple, Secret Agent'],
            fullStory: 'I began my journey at Vincell Studios as an intern and quickly proved my value, transitioning to a full-time Junior Game Tester position within months. This role provided my foundation in game quality assurance, working on mobile narrative games with millions of downloads. I learned to identify bugs efficiently, communicate with developers, and maintain quality standards under tight deadlines. My time here taught me the importance of thorough testing and the impact of QA on player experience.',
            achievements: [
                'Progressed from intern to full-time employee within 3 months based on performance',
                'Trained and mentored 5+ new QA testers on testing methodologies and tools',
                'Optimized Unity testing workflows, reducing bug identification time by 30%',
                'Tested and released multiple mobile games including Murder Mystery, Secret Agent, and Lost Temple',
                'Developed testing documentation templates still used by the team',
                'Contributed to games with combined downloads exceeding 1 million on Google Play Store'
            ],
            technologies: ['Unity', 'Android Studio', 'JIRA', 'Test Cases Documentation', 'Bug Tracking Systems'],
            projects: ['Murder Mystery', 'Secret Agent', 'Lost Temple', 'Hidden Escape Games'],
            current: false
        },
    ]

    return (
        <section id="experience" className="relative py-24 px-6 bg-section">
            <div className="max-w-4xl mx-auto">
                <div className="section-header">
                    <div className="sketchy-line flex-1" />
                    <h2 className="section-title"><span className="section-number">03.</span> <span className="section-icon">💼</span> Experience</h2>
                    <div className="sketchy-line flex-1" />
                </div>

                <div className="space-y-8">
                    {experiences.map((exp, i) => (
                        <div key={i} className="relative pl-8 border-l-2 border-gray-300">
                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${exp.current ? 'bg-gray-800 animate-pulse' : 'bg-gray-400'}`} />
                            <div
                                className="sketchy-card p-6 cursor-pointer hover:shadow-lg transition-all"
                                onClick={() => setSelectedExperience(exp)}
                            >
                                <div className="flex justify-between gap-2 mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>{exp.title}</h3>
                                        <p className="text-gray-600 text-sm">{exp.subtitle}</p>
                                        <p className="text-gray-500 text-sm"><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-bold hover:underline" onClick={(e) => e.stopPropagation()}>{exp.company}</a> • {exp.location}</p>
                                    </div>
                                    <span className="text-xs text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded whitespace-nowrap font-bold shadow-sm">{exp.period}</span>
                                </div>
                                <ul className="space-y-2">
                                    {exp.highlights.map((h, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-[#c73e3a] font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                                        Click to see full story
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded Experience Modal */}
            {selectedExperience && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSelectedExperience(null)}
                >
                    <motion.div
                        className="experience-expanded-card w-full max-w-4xl max-h-[85vh] overflow-y-auto"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white border-2 border-[#c73e3a] text-[#c73e3a] hover:bg-[#c73e3a] hover:text-white transition-all"
                                onClick={() => setSelectedExperience(null)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            {/* Header */}
                            <div className="pr-12 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    {selectedExperience.current && <span className="sketchy-badge-dark">Current</span>}
                                    <span className="sketchy-badge">{selectedExperience.period}</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                    {selectedExperience.title}
                                </h3>
                                <p className="text-gray-500 text-lg">{selectedExperience.subtitle}</p>
                                <p className="text-gray-600 mt-1">
                                    <a href={selectedExperience.companyUrl} target="_blank" rel="noopener noreferrer" className="text-[#c73e3a] font-bold hover:underline">
                                        {selectedExperience.company}
                                    </a>
                                    <span className="text-gray-400 mx-2">•</span>
                                    {selectedExperience.location}
                                </p>
                            </div>

                            {/* Full Story */}
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                    <span className="text-[#c73e3a]">📖</span> My Journey
                                </h4>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {selectedExperience.fullStory}
                                </p>
                            </div>

                            {/* Achievements */}
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                    <span className="text-[#c73e3a]">🏆</span> Key Achievements
                                </h4>
                                <ul className="space-y-3">
                                    {selectedExperience.achievements.map((achievement, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 border-l-4 border-[#c73e3a]">
                                            <svg className="w-5 h-5 text-[#c73e3a] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Projects Worked On */}
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                    <span className="text-[#c73e3a]">🎮</span> Projects
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedExperience.projects.map((project, i) => (
                                        <span key={i} className="sketchy-tag text-sm">{project}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>
                                    <span className="text-[#c73e3a]">⚙️</span> Technologies & Tools
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedExperience.technologies.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 hover:border-[#c73e3a] hover:text-[#c73e3a] transition-colors">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Company Link */}
                            <div className="pt-4 border-t border-gray-200">
                                <a
                                    href={selectedExperience.companyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-black inline-flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    <span className="font-bold">Visit {selectedExperience.company}</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    )
}

// ============================================
// SKILLS
// ============================================
function SkillsSection() {
    const skillCategories = [
        { title: 'Production', level: 85, skills: ['GDLC', 'Agile', 'QA Pipeline', 'Test Management'] },
        { title: 'Technical', level: 75, skills: ['Metaverse', 'Performance', 'Documentation'] },
        { title: 'Leadership', level: 80, skills: ['Team Management', 'Risk Management'] },
        { title: 'Tools', level: 90, skills: ['JIRA', 'Unity', 'Unreal', 'Git', 'Notion'] },
    ]

    return (
        <section id="skills" className="relative py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="section-header">
                    <div className="sketchy-line flex-1" />
                    <h2 className="section-title"><span className="section-number">04.</span> <span className="section-icon">⚡</span> Skills</h2>
                    <div className="sketchy-line flex-1" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skillCategories.map((cat, i) => (
                        <div key={i} className="sketchy-card p-6">
                            <div className="flex justify-between mb-3">
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>{cat.title}</h3>
                                <span className="text-gray-600 text-sm font-bold">{cat.level}%</span>
                            </div>
                            <div className="sketchy-xp-bar mb-4"><div className="sketchy-xp-fill" style={{ width: `${cat.level}%` }} /></div>
                            <div className="flex flex-wrap gap-2">{cat.skills.map((s, j) => <span key={j} className="sketchy-tag">{s}</span>)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================
// EDUCATION
// ============================================
function EducationSection() {
    const education = [
        { degree: 'Diploma: Game Production', school: 'Futuregames', schoolUrl: 'https://futuregames.se/pl/', location: 'Warsaw, Poland', period: '2025 - 2027', current: true },
        { degree: 'B.Tech CS: Game Development', school: 'Backstagepass Institute', schoolUrl: null, location: 'Hyderabad, India', period: '2018 - 2022', gpa: '7.0' },
    ]

    const activities = [
        { name: 'IGDC Volunteer', years: '2018, 19, 22, 23', url: 'https://indiagdc.com/' },
        { name: 'NASSCOM Summit', years: '2018', url: 'https://www.nasscomfoundation.org/digital-literacy' },
        { name: 'GamerConnect HYD', years: '2017', url: 'https://gamerconnect.in/' },
        { name: 'IGX PUBG Champions', years: '2018 - Runner Up', url: null },
    ]

    return (
        <section id="education" className="relative py-24 px-6 bg-section">
            <div className="max-w-4xl mx-auto">
                <div className="section-header">
                    <div className="sketchy-line flex-1" />
                    <h2 className="section-title"><span className="section-number">05.</span> <span className="section-icon">🎓</span> Education</h2>
                    <div className="sketchy-line flex-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        {education.map((edu, i) => (
                            <div key={i} className="sketchy-card p-6">
                                {edu.current && <span className="sketchy-badge-dark mb-2">Current</span>}
                                <h3 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>{edu.degree}</h3>
                                {edu.schoolUrl ? <a href={edu.schoolUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-bold hover:underline text-sm">{edu.school}</a> : <p className="text-gray-900 font-bold text-sm">{edu.school}</p>}
                                <p className="text-gray-400 text-xs">{edu.location}</p>
                                <p className="text-xs text-gray-700 mt-2 font-medium">{edu.period}{edu.gpa && ` • GPA: ${edu.gpa}`}</p>
                            </div>
                        ))}
                    </div>

                    <div className="sketchy-card p-6">
                        <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Activities & Events</h3>
                        <div className="space-y-3">
                            {activities.map((act, i) => (
                                <div key={i} className="flex justify-between p-3 bg-gray-50 hover:bg-gray-100 group">
                                    {act.url ? <a href={act.url} target="_blank" rel="noopener noreferrer" className="text-gray-700 font-medium hover:text-gray-900 underline flex items-center gap-2">{act.name}<svg className="w-3 h-3 opacity-0 group-hover:opacity-100 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a> : <span className="text-gray-700 font-medium">{act.name}</span>}
                                    <span className="text-xs text-gray-500">{act.years}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// CONTACT
// ============================================
function ContactSection() {
    return (
        <section id="contact" className="relative py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="section-header">
                    <div className="sketchy-line flex-1" />
                    <h2 className="section-title"><span className="section-number">06.</span> <span className="section-icon">📬</span> Connect</h2>
                    <div className="sketchy-line flex-1" />
                </div>

                <p className="text-center text-gray-600 text-lg mb-12">Ready to discuss game production opportunities.</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <a href="/Abh17ash.pdf" download="Sutar_Abhilash_Resume.pdf" className="btn-contact-card">
                        <div className="btn-contact-icon">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Resume</h3>
                        <p className="text-xs opacity-70">Download CV</p>
                    </a>

                    <a href="https://mail.google.com/mail/?view=cm&to=sutarabhilash20@gmail.com" target="_blank" rel="noopener noreferrer" className="btn-contact-card">
                        <div className="btn-contact-icon">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Email</h3>
                        <p className="text-xs opacity-70">sutarabhilash20@gmail.com</p>
                    </a>

                    <a href="tel:+48453368691" className="btn-contact-card">
                        <div className="btn-contact-icon">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Phone</h3>
                        <p className="text-xs opacity-70">+48 453 368 691</p>
                    </a>

                    <div className="btn-contact-card-static">
                        <div className="btn-contact-icon-static">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-sketchy), cursive' }}>Location</h3>
                        <p className="text-xs opacity-70">Warsaw, Poland</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// FOOTER
// ============================================
function Footer() {
    return (
        <footer className="py-8 px-6 border-t border-gray-200 bg-section">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-400">© {new Date().getFullYear()} Sutar Abhilash. All rights reserved.</div>
                <div className="flex items-center gap-2">
                    <div className="w-0.5 h-4 bg-gray-300 rounded-full" />
                    <span className="text-xs text-gray-600 font-medium">Play until you die, then <span className="font-bold">RESPAWN!</span></span>
                    <div className="w-0.5 h-4 bg-gray-300 rounded-full" />
                </div>
            </div>
        </footer>
    )
}

// ============================================
// CHERRY BLOSSOM BRANCH DECORATION
// Dark black branches, bright red blossoms
// ============================================
function CherryBlossomBranch({ position }: { position: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right' | 'mid-left' | 'mid-right' }) {
    const getTransform = () => {
        switch (position) {
            case 'top-right': return 'rotate(15deg)'
            case 'bottom-left': return 'rotate(-15deg)'
            case 'top-left': return 'rotate(-10deg) scaleX(-1)'
            case 'bottom-right': return 'rotate(10deg) scaleX(-1)'
            case 'mid-left': return 'rotate(5deg)'
            case 'mid-right': return 'rotate(-5deg) scaleX(-1)'
            default: return 'rotate(0deg)'
        }
    }

    const getPosition = () => {
        switch (position) {
            case 'top-right': return { top: 0, right: 0 }
            case 'bottom-left': return { bottom: 0, left: 0 }
            case 'top-left': return { top: '5%', left: 0 }
            case 'bottom-right': return { bottom: '5%', right: 0 }
            case 'mid-left': return { top: '35%', left: 0 }
            case 'mid-right': return { top: '40%', right: 0 }
            default: return { top: 0, right: 0 }
        }
    }

    const getSize = () => {
        switch (position) {
            case 'top-right':
            case 'bottom-left':
                return { width: '300px', height: '300px' }
            case 'top-left':
            case 'bottom-right':
                return { width: '220px', height: '220px' }
            default:
                return { width: '180px', height: '180px' }
        }
    }

    return (
        <svg
            className="cherry-branch"
            viewBox="0 0 200 200"
            fill="none"
            style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 1,
                opacity: 0.35,
                transform: getTransform(),
                ...getPosition(),
                ...getSize()
            }}
        >
            {/* Main branch - pure black */}
            <path
                d="M180 10 Q160 30 140 25 Q100 40 80 80 Q60 120 40 140"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />
            {/* Sub-branches - dark black */}
            <path
                d="M140 25 Q130 15 115 20 M80 80 Q70 70 60 75 M100 50 Q90 40 75 45"
                stroke="#0a0a0a"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            {/* Cherry blossoms - ultra bright vibrant red */}
            <circle cx="115" cy="18" r="10" fill="#ff1744" />
            <circle cx="125" cy="10" r="8" fill="#ff3d00" />
            <circle cx="75" cy="42" r="9" fill="#ff1744" />
            <circle cx="60" cy="73" r="10" fill="#ff3d00" />
            <circle cx="50" cy="82" r="7" fill="#ff5252" />
            <circle cx="140" cy="28" r="7" fill="#ff3d00" />
            <circle cx="105" cy="35" r="8" fill="#ff5252" />
            <circle cx="88" cy="60" r="9" fill="#ff1744" />
            <circle cx="70" cy="95" r="7" fill="#ff3d00" />
            {/* Extra blossoms - brighter */}
            <circle cx="130" cy="45" r="6" fill="#ff5252" />
            <circle cx="95" cy="70" r="6" fill="#ff1744" />
            {/* More blossoms for density */}
            <circle cx="48" cy="95" r="6" fill="#ff3d00" />
            <circle cx="65" cy="55" r="5" fill="#ff5252" />
            <circle cx="110" cy="50" r="5" fill="#ff1744" />
            {/* Blossom centers - bright white dots */}
            <circle cx="115" cy="18" r="3" fill="#fff" opacity="0.9" />
            <circle cx="60" cy="73" r="3" fill="#fff" opacity="0.9" />
            <circle cx="88" cy="60" r="3" fill="#fff" opacity="0.9" />
            <circle cx="125" cy="10" r="2.5" fill="#fff" opacity="0.85" />
            <circle cx="75" cy="42" r="2.5" fill="#fff" opacity="0.85" />
            <circle cx="48" cy="95" r="2" fill="#fff" opacity="0.8" />
            <circle cx="65" cy="55" r="2" fill="#fff" opacity="0.8" />
        </svg>
    )
}

// ============================================
// FLOATING CHERRY PETALS
// ============================================
function CherryPetals() {
    const petals = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 15,
            duration: 10 + Math.random() * 10
        }))
        , [])

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {petals.map(petal => (
                <div
                    key={petal.id}
                    className="cherry-petal"
                    style={{
                        left: `${petal.left}%`,
                        animationDelay: `${petal.delay}s`,
                        animationDuration: `${petal.duration}s`,
                    }}
                />
            ))}
        </div>
    )
}

// ============================================
// BACKGROUND LAYERS
// ============================================
function BackgroundLayers() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Brush stroke layers */}
            <div className="brush-stroke-layer brush-stroke-1" />
            <div className="brush-stroke-layer brush-stroke-2" />
            <div className="brush-stroke-layer brush-stroke-3" />

            {/* Cherry blossom branches - multiple positions */}
            <CherryBlossomBranch position="top-right" />
            <CherryBlossomBranch position="bottom-left" />
            <CherryBlossomBranch position="top-left" />
            <CherryBlossomBranch position="bottom-right" />
            <CherryBlossomBranch position="mid-left" />
            <CherryBlossomBranch position="mid-right" />

            {/* Floating petals */}
            <CherryPetals />
        </div>
    )
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
    return (
        <main className="min-h-screen bg-layer-base text-gray-900 overflow-x-hidden">
            <Navigation />
            <BackgroundLayers />
            <FloatingDarts />
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <ExperienceSection />
            <SkillsSection />
            <EducationSection />
            <ContactSection />
            <Footer />
        </main>
    )
}