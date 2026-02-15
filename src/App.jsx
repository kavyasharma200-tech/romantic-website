import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Music, Volume2, VolumeX, Mail, Star, X } from 'lucide-react';

// --- Constants & Config ---
const START_DATE = new Date('2023-02-14T00:00:00'); // Default Start Date
const FRAME_COUNT = 192;
const FPS = 30;

// Helper to generate frame paths
const getFramePath = (index) => {
    const padded = String(index + 1).padStart(3, '0');
    return `/frames/ezgif-frame-${padded}.jpg`;
};

// --- Sub-Components ---

const Footer = () => {
    const [clicks, setClicks] = useState(0);

    const handleTextClick = () => {
        const newClicks = clicks + 1;
        setClicks(newClicks);

        if (newClicks === 5) {
            confetti({
                particleCount: 100,
                spread: 160,
                origin: { y: 1 },
                shapes: ['heart'],
                colors: ['#FF69B4', '#FF1493', '#FFB6C1']
            });
            alert("Okay okay, I love you TOO much, happy now? 😭💕");
            setClicks(0);
        }

        // Reset clicks if user stops clicking rapidly
        setTimeout(() => setClicks(0), 1000);
    };

    return (
        <footer style={{ background: 'linear-gradient(to top, #FFB6C1, #FFCBA4)', padding: '60px 20px', textAlign: 'center', color: 'white', position: 'relative' }}>
            <h2
                onClick={handleTextClick}
                style={{ fontSize: '2rem', marginBottom: '10px', cursor: 'pointer', userSelect: 'none' }}
            >
                Made with every bit of my heart 💗
            </h2>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Just for you. Always.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Heart size={20} fill="#FFC0CB" color="#FFC0CB" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
                    <Heart size={20} fill="#FF69B4" color="#FF69B4" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                    <Heart size={20} fill="#FFD700" color="#FFD700" />
                </motion.div>
            </div>
        </footer>
    );
};

const LoadingCurtain = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, pointerEvents: 'none' }}
            transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
            style={{
                position: 'fixed', inset: 0, background: '#FFF0F5', zIndex: 9999,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
        >
            <h1 style={{ fontSize: '3rem', color: '#C9A98A', fontFamily: 'var(--font-heading)' }}>For You...</h1>
        </motion.div>
    );
};

// --- Components ---

const VideoHeader = () => {
    const canvasRef = useRef(null);
    const [images, setImages] = useState([]);
    const requestRef = useRef();

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgs = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
                loadedCount++;
            };
            imgs.push(img);
        }
        setImages(imgs);
    }, []);

    // Animation Loop
    useEffect(() => {
        if (images.length < FRAME_COUNT) return;

        let frameIndex = 0;
        let lastTime = 0;
        const interval = 1000 / FPS;

        const animate = (time) => {
            if (time - lastTime > interval) {
                const ctx = canvasRef.current?.getContext('2d');
                if (ctx && canvasRef.current) {
                    // Draw image covering the canvas (object-fit: cover equivalent)
                    const img = images[frameIndex];
                    if (img.complete) {
                        const canvas = canvasRef.current;
                        const hRatio = canvas.width / img.width;
                        const vRatio = canvas.height / img.height;
                        const ratio = Math.max(hRatio, vRatio);
                        const centerShift_x = (canvas.width - img.width * ratio) / 2;
                        const centerShift_y = (canvas.height - img.height * ratio) / 2;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, img.width, img.height,
                            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
                    }
                }
                frameIndex = (frameIndex + 1) % FRAME_COUNT;
                lastTime = time;
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight * 0.45;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ height: '45vh', width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 10, overflow: 'hidden', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: '#FFF8F0' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 100px rgba(201, 169, 138, 0.3)', pointerEvents: 'none', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}></div>
            {/* Animated Hearts Border */}
            <div className="hearts-border" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '20px', overflow: 'hidden' }}>
                {/* Creates a scrolling simulated border of hearts */}
                <motion.div
                    animate={{ x: [0, -100] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    style={{ display: 'flex', gap: '20px' }}
                >
                    {Array(50).fill(0).map((_, i) => <Heart key={i} size={14} fill="#FFB6C1" color="#FFB6C1" />)}
                </motion.div>
            </div>
        </div>
    );
};

const EnvelopeSection = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                onClick={() => setIsOpen(true)}
                style={{ cursor: 'pointer', textAlign: 'center' }}
                onViewportEnter={() => setTimeout(() => setIsOpen(true), 500)} // Auto open on scroll
            >
                {!isOpen ? (
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                        <Mail size={80} color="#C9A98A" />
                        <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#C9A98A' }}>Tap to open</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, rotateX: 90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        style={{
                            background: '#FFF',
                            padding: '40px',
                            borderRadius: '10px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                            maxWidth: '500px',
                            border: '1px solid #FFE4E1',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)' }}>
                            <Heart fill="#C71585" color="#C71585" size={30} />
                        </div>
                        <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: '#5A3E36', lineHeight: '1.6' }}>
                            "To my favorite person in the whole world… this one's for you 💌"
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
};

const ButtonsSection = () => {
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [escapes, setEscapes] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const noBtnRef = useRef(null);

    const handleNoHover = (e) => {
        if (escapes >= 4) return;

        // Calculate new random position within viewport
        // Simple implementation: move away from mouse broadly
        const x = Math.random() * (window.innerWidth - 200); // Keep within bounds
        const y = Math.random() * (window.innerHeight - 100);

        setNoBtnPos({ x, y });
        setEscapes(prev => prev + 1);

        // Play sound
        // (Simulated with console log or specific implementation if audio file exists)
    };

    const handleYesClick = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFB6C1', '#FFF', '#C9A98A', '#FF0000']
        });
        setShowPopup(true);
    };

    const getNoText = () => {
        if (escapes === 0) return "No, never! 💕"; // Wait, prompt said Button 1 is "No, never!" but implies that's the WRONG answer? 
        // Re-reading prompt:
        // Button 1: "No, never! 💕" -> onClick: Shows "Obviously!! I knew it all along"
        // Button 2: "Yes..." -> Flees.

        // Ah! The Question is: "Can you really stay mad at a girlfriend this lovely?"
        // So "No, never!" is the GOOD answer. "Yes..." is the BAD answer (which flees).
        return "No, never! 💕";
    };

    const getYesText = () => {
        // Button 2 (Yes...) flees.
        if (escapes === 1) return "Nope!";
        if (escapes === 2) return "Not a chance!";
        if (escapes === 3) return "Absolutely not!";
        return "Yes...";
    };

    return (
        <section style={{ padding: '60px 20px', textAlign: 'center', position: 'relative', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div key={i} animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}>
                            <Star fill="#C9A98A" color="#C9A98A" size={20} />
                        </motion.div>
                    ))}
                </div>
                <h2 style={{ fontSize: '3rem', color: '#5A3E36', marginBottom: '10px' }}>
                    Can you really stay mad at a girlfriend this lovely? 🥺💕
                </h2>
                <p style={{ fontStyle: 'italic', color: '#888' }}>Choose wisely, my love…</p>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ display: 'inline-block', marginTop: '10px' }}>
                    <Heart fill="#FFB6C1" color="#FFB6C1" size={24} />
                </motion.div>
            </div>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Button 1: The "Good" Answer */}
                <motion.button
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255,182,193,0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleYesClick}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        border: '2px solid #C9A98A',
                        background: '#FFB6C1',
                        color: 'white',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-heading)'
                    }}
                >
                    No, never! 💕
                </motion.button>

                {/* Button 2: The "Bad" Answer (Flees) */}
                {escapes < 4 ? (
                    <motion.button
                        ref={noBtnRef}
                        onMouseEnter={handleNoHover} // Desktop
                        onTouchStart={handleNoHover} // Mobile
                        animate={escapes > 0 ? { position: 'fixed', left: noBtnPos.x, top: noBtnPos.y } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{
                            padding: '15px 40px',
                            fontSize: '1.2rem',
                            borderRadius: '50px',
                            border: 'none',
                            background: '#E6E6FA', // Lavender
                            color: '#888',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-heading)',
                            zIndex: 100 // Ensure it flies on top
                        }}
                    >
                        {getYesText()}
                    </motion.button>
                ) : (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontStyle: 'italic', color: '#C9A98A' }}>
                        Wrong answer doesn't exist 😇✨
                    </motion.p>
                )}
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 100 }}
                            animate={{ scale: 1, y: 0 }}
                            className="popup-card"
                            style={{
                                background: 'white', padding: '40px', borderRadius: '20px',
                                textAlign: 'center', maxWidth: '90%', width: '400px',
                                border: '4px solid #FFB6C1'
                            }}
                        >
                            <motion.div
                                animate={{ y: [-10, 0, -10] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Heart size={60} fill="#FFB6C1" color="#FFB6C1" style={{ margin: '0 auto 20px' }} />
                            </motion.div>
                            <h3 style={{ fontSize: '1.8rem', color: '#5A3E36', marginBottom: '10px' }}>Obviously!!</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
                                I knew it all along 🥰<br />
                                You are literally the best person ever.<br />
                                I love you to the moon and back! 💗
                            </p>
                            <button
                                onClick={() => setShowPopup(false)}
                                style={{
                                    marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer'
                                }}
                            >
                                <X size={24} color="#C9A98A" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// --- Main App Component ---

function App() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isPlaying, setIsPlaying] = useState(false);
    // Audio ref placeholder
    const audioRef = useRef(new Audio('https://cdn.pixabay.com/audio/2022/02/10/audio_5a30687139.mp3')); // Romantic royalty-free placeholder

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
            audioRef.current.loop = true;
        }
        setIsPlaying(!isPlaying);
    };

    // Custom Cursor
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div style={{ position: 'relative', overflowX: 'hidden' }}>
            {/* Custom Cursor */}
            <div
                className="custom-cursor"
                style={{ left: mousePos.x, top: mousePos.y }}
            ></div>

            {/* Scroll Progress */}
            <motion.div
                style={{
                    scaleX,
                    height: '5px',
                    background: '#C9A98A',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    transformOrigin: '0%',
                    zIndex: 100
                }}
            />

            {/* Floating Petals Overlay (Simplified) */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: -50,
                            fontSize: `${Math.random() * 20 + 10}px`,
                            color: Math.random() > 0.5 ? '#FFB6C1' : '#FFF0F5'
                        }}
                        animate={{
                            y: window.innerHeight + 100,
                            rotate: 360,
                            x: [0, Math.random() * 100 - 50, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: Math.random() * 5
                        }}
                    >
                        {Math.random() > 0.5 ? '🌸' : '❤️'}
                    </motion.div>
                ))}
            </div>



            <LoadingCurtain />
            <VideoHeader />

            {/* Scrollable Content Wrapper */}
            <div style={{ position: 'relative', zIndex: 1, marginTop: '45vh', paddingBottom: '100px', background: 'var(--color-cream-white)' }}>
                {/* Ensure background color is set so content doesn't show through if z-indices interact weirdly, 
                     though here content is scrolling *under* (if z-index < video) or *over* (if z-index > video).
                     
                     If z-index of Video is 10.
                     And this wrapper is z-index 1.
                     Then content scrolls BEHIND the video.
                     The video acts as a window/mask.
                     
                     If the user wanted the video to be a background and content scrolls OVER it:
                     "Pin it fixed... stays visible" -> If content covers it, it's not visible.
                     So "Behind" is the only logical interpretation for "stays visible".
                 */}
                <EnvelopeSection />
                <ButtonsSection />

                {/* Reasons Carousel */}
                <section style={{ padding: '40px 0', overflow: 'hidden' }}>
                    <h2 style={{ textAlign: 'center', color: '#5A3E36', marginBottom: '30px', fontSize: '2.5rem' }}>Exhibit A through forever… 🥰</h2>
                    <div style={{ display: 'flex', gap: '20px', padding: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '40px' }} className="no-scrollbar">
                        {[
                            "I remember every little thing you like",
                            "I stay up just to make sure you're okay",
                            "I literally got your favorite snack without being asked",
                            "I give the best hugs in the entire universe",
                            "I made you a whole entire website, need I say more?"
                        ].map((reason, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ rotate: Math.random() * 4 - 2, scale: 1.05 }}
                                style={{
                                    minWidth: '250px',
                                    background: '#FFF',
                                    border: '2px solid #C9A98A',
                                    borderRadius: '15px',
                                    padding: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    scrollSnapAlign: 'center',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.2rem',
                                    color: '#5A3E36'
                                }}
                            >
                                {reason}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Love Counter */}
                <section style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(to bottom, #FFF8F0, #FFF0F5)' }}>
                    <h3 style={{ fontSize: '2rem', color: '#5A3E36', marginBottom: '20px' }}>You've been loved for:</h3>
                    <Timer startDate={START_DATE} />
                    <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#C9A98A' }}>…and every second counts 💛</p>
                </section>

                {/* Polaroid Wall Placeholder */}
                <section style={{ padding: '60px 20px', background: '#F5F5DC' /* Cork/Linen placeholder color */ }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#5A3E36', fontSize: '2.5rem' }}>Us, always 📷</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
                                style={{
                                    width: '200px',
                                    background: 'white',
                                    padding: '15px 15px 40px 15px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    rotate: `${Math.random() * 10 - 5}deg`,
                                    transformOrigin: 'center'
                                }}
                            >
                                <div style={{ width: '100%', height: '180px', background: '#FFCBA4', marginBottom: '10px' }}></div>
                                <p style={{ fontFamily: 'cursive', color: '#555', fontSize: '0.9rem' }}>Memory {i}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>


            {/* Footer */}
            <Footer />

            {/* Music Toggle */}
            <button
                onClick={toggleMusic}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    background: '#FFB6C1',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                {isPlaying ? <Volume2 color="white" /> : <VolumeX color="white" />}
            </button>
        </div >
    )
}

const Timer = ({ startDate }) => {
    const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const distance = now - startDate;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setDiff({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, [startDate]);

    const unitStyle = {
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px'
    };

    const numStyle = {
        fontSize: '2.5rem', fontWeight: 'bold', color: '#C9A98A'
    };

    const labelStyle = {
        fontSize: '0.9rem', color: '#888'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={unitStyle}><span style={numStyle}>{diff.days}</span><span style={labelStyle}>Days</span></div>
            <div style={unitStyle}><span style={numStyle}>{diff.hours}</span><span style={labelStyle}>Hours</span></div>
            <div style={unitStyle}><span style={numStyle}>{diff.minutes}</span><span style={labelStyle}>Minutes</span></div>
            <div style={unitStyle}><span style={numStyle}>{diff.seconds}</span><span style={labelStyle}>Seconds</span></div>
        </div>
    );
}

export default App;
