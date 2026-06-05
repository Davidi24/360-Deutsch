import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/useAuth";
import { sendChatMessage } from "@/app/actions/aiChat";

export interface Msg {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    attachment?: string;
}

export function useChatWidget() {
    const { user } = useAuth();
    const [isWindowOpen, setisWindowOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Msg[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Welcome to the AI-Powered 360° Assistant. How can I assist you?",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [attachment, setAttachment] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [size, setSize] = useState({ width: 400, height: 600 });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userFileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isResizingRef = useRef(false);

    useEffect(() => {
        if (isWindowOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isWindowOpen]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingRef.current) return;
            const newWidth = window.innerWidth - e.clientX - 24;
            const newHeight = window.innerHeight - e.clientY - 24;
            if (newWidth > 320 && newWidth < 800) setSize(prev => ({ ...prev, width: newWidth }));
            if (newHeight > 400 && newHeight < window.innerHeight - 50) setSize(prev => ({ ...prev, height: newHeight }));
        };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            document.body.style.cursor = "default";
        };

        if (isWindowOpen) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isWindowOpen]);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingRef.current = true;
        document.body.style.cursor = "nwse-resize";
    };

    // --- SPEECH RECOGNITION (STT) ---
    const handleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.start();

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => (prev ? prev + " " + transcript : transcript));
            setIsRecording(false);
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
    };

    // --- TEXT TO SPEECH (TTS) ---
    const speak = (text: string) => {
        if ("speechSynthesis" in window) {
            const cleanText = text.replace(/[*#_`]/g, "");
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v => v.lang.includes("de") || v.name.includes("Google"));
            if (preferred) utterance.voice = preferred;
            window.speechSynthesis.speak(utterance);
        }
    };

    // --- FILE UPLOAD ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAttachment(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // --- CAMERA CAPTURE ---
    const startCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera Error:", err);
            alert("Could not access camera.");
            setShowCamera(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 300, 200);
                const dataUrl = canvasRef.current.toDataURL("image/jpeg");
                setAttachment(dataUrl);
                if (!input.trim()) setInput("Identify objects in this photo");
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(t => t.stop());
        }
        setShowCamera(false);
    };

    const handleSend = async () => {
        if (!input.trim() && !attachment) return;

        const userMsg: Msg = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
            attachment: attachment || undefined
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setAttachment(null);
        setIsTyping(true);

        try {
            const data = await sendChatMessage({
                client_id: user?.id?.toString() || "guest",
                user_level: user?.level || "A1",
                user_progress: null,
                message: userMsg.content,
                image: userMsg.attachment
            });

            const aiMsg: Msg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMsg]);

            if (data.debug) {
                const intent = data.debug.step_1_intent || "Unknown";
                const routing = data.debug.step_2_routing || "Default";
                const debugMsg: Msg = {
                    id: (Date.now() + 2).toString(),
                    role: "assistant",
                    content: `🔍 [Debug]: Intent: ${intent} | Routing: ${routing}`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, debugMsg]);
            }

        } catch (error: any) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: "Error connecting to AI.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return {
        isWindowOpen, setisWindowOpen,
        input, setInput,
        messages, setMessages,
        isTyping,
        isRecording,
        attachment, setAttachment,
        showCamera, setShowCamera,
        size,
        messagesEndRef,
        userFileInputRef,
        videoRef,
        canvasRef,
        startResize,
        handleSend,
        handleVoiceInput,
        speak,
        handleFileSelect,
        startCamera,
        capturePhoto,
        stopCamera
    };
}
