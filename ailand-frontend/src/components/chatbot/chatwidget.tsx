"use client";
import React, { useState } from "react";
import { X, Send, User as UserIcon, Mic, Camera, Paperclip, Volume2, Sparkles, CheckCircle2, ArrowRight, Info, Lightbulb, Layers, Tag, Palette, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"; 
import { useChatWidget, Msg } from "@/hooks/useChatWidget";

export function ChatWidget() {
  const aiLogo = "/assets/logo.png";
  
  const {
    isWindowOpen, setisWindowOpen,
    input, setInput,
    messages,
    isTyping,
    isRecording,
    attachment, setAttachment,
    showCamera,
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
   
  } = useChatWidget();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-display">   
      {showCamera && (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
              <div className="bg-zinc-900 p-4 rounded-2xl flex flex-col items-center gap-4 relative shadow-2xl border border-zinc-800">
                  <h3 className="text-white font-bold">Take Photo</h3>
                  <button onClick={stopCamera} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X /></button>
                  <video ref={videoRef} autoPlay playsInline className="w-[300px] h-[200px] bg-black rounded-lg object-cover" />
                  <canvas ref={canvasRef} width="300" height="200" className="hidden" />
                  <button onClick={capturePhoto} className="px-6 py-2 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                      <Camera size={18} /> Capture
                  </button>
              </div>
          </div>
      )}
      <div style={{ width: isWindowOpen ? size.width : 0, height: isWindowOpen ? size.height : 0 }} className={cn("bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right font-sans relative", isWindowOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none")}>
        <div onMouseDown={startResize} className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-50 hover:bg-[#5a47c7]/20 rounded-br-lg transition-colors">
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-slate-300 dark:border-slate-600 rounded-tl-sm" />
        </div>
        <div className="bg-card px-6 py-4 flex items-center justify-between border-b border-border relative">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 relative flex items-center justify-center bg-[#5a47c7] rounded-full shadow-lg shadow-[#5a47c7]/20 border border-white/10">
                 <Image src={aiLogo} alt="AI Logo" width={24} height={24} className="object-contain" />
             </div>
             <div>
               <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                 Assistant <span className="text-[10px] bg-secondary rounded px-1 text-secondary-foreground font-normal">v1.0</span>
               </h3>
               <p className="text-[10px] text-green-500 font-medium tracking-wide flex items-center gap-1">
                 <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
                 ONLINE
               </p>
             </div>
          </div>
          <button onClick={() => setisWindowOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-md"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex w-full gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden relative", msg.role === "user" ? "bg-secondary" : "bg-[#5a47c7]")}>
                {msg.role === "user" ? (
                    <UserIcon size={14} className="text-slate-600 dark:text-slate-400" />
                ) : (
                    <Image src={aiLogo} alt="AI" width={18} height={18} className="object-contain" />
                )}
              </div>
              <div className={cn("max-w-[85%] p-4 rounded-2xl text-sm shadow-sm flex flex-col gap-2", msg.role === "user" ? "bg-[#5a47c7] text-white rounded-br-none" : "bg-card border border-border text-foreground rounded-bl-none")}>
                 {msg.attachment && (
                     <img src={msg.attachment} alt="Attachment" className="rounded-lg max-h-40 object-cover border border-white/20" />
                 )}                 
                <div className="flex flex-col gap-3">
                  {(msg.content || "").split("###").map((section, idx) => {
                    if (!section.trim()) return null;
                    
                    // ── VOCAB_LIST ───────────────────────────────────────────
                    if (section.trim().startsWith("VOCAB_LIST")) {
                        const lines = section
                            .replace("VOCAB_LIST", "")
                            .split("\n")
                            .map(l => l.trim())
                            .filter(l => l.startsWith("-"));

                        const genderStyles: any = {
                            die: { strip: "bg-rose-50",    text: "text-rose-600",    badge: "text-rose-500 border-rose-200 bg-rose-50",    label: "Feminine"  },
                            der: { strip: "bg-blue-50",    text: "text-blue-600",    badge: "text-blue-500 border-blue-200 bg-blue-50",    label: "Masculine" },
                            das: { strip: "bg-emerald-50", text: "text-emerald-600", badge: "text-emerald-500 border-emerald-200 bg-emerald-50", label: "Neuter" },
                        };

                        const cards = lines.map(line => {
                            // Pattern: - [article] **word** (plural: X) — translation. Example: Y.
                            const articleMatch = line.match(/\[(\w+)\]/);
                            const wordMatch    = line.match(/\*\*(.+?)\*\*/);
                            const pluralMatch  = line.match(/\(plural:\s*(.+?)\)/);
                            const transMatch   = line.match(/—\s*(.+?)(?:\.\s*Example:|$)/);
                            const exampleMatch = line.match(/Example:\s*(.+?)\.?\s*$/);
                            return {
                                article:     articleMatch?.[1] || "",
                                word:        wordMatch?.[1]    || line,
                                plural:      pluralMatch?.[1]  || "",
                                translation: transMatch?.[1]?.trim()  || "",
                                example:     exampleMatch?.[1]?.trim() || "",
                            };
                        });

                        return (
                            <div key={idx} className="flex flex-col gap-3 w-full">
                                {cards.map((card, cIdx) => {
                                    const style = genderStyles[card.article.toLowerCase()] || genderStyles.der;
                                    return (
                                        <div key={cIdx} className="w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm">
                                            {/* Top strip */}
                                            <div className={`${style.strip} dark:bg-zinc-800/60 px-4 py-2 flex items-center justify-between`}>
                                                <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>{card.article.toUpperCase()}</span>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest border rounded-full px-2 py-0.5 ${style.badge}`}>{style.label}</span>
                                            </div>
                                            {/* Body */}
                                            <div className="px-4 pt-3 pb-0">
                                                <div className="flex items-start justify-between mb-0.5">
                                                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">{card.word}</span>
                                                    <button onClick={() => speak(`${card.article} ${card.word}`)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400 hover:text-[#5a47c7] transition-colors">
                                                        <Volume2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-xs font-semibold text-[#5a47c7] mb-2">{card.translation}</div>
                                                {card.plural && (
                                                    <div className="mb-3">
                                                        <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Plural</div>
                                                        <div className="border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800">{card.plural}</div>
                                                    </div>
                                                )}
                                            </div>
                                            {card.example && (
                                                <div className="bg-gradient-to-r from-[#e91e63] to-[#c2185b] px-4 py-3 flex items-start justify-between gap-2">
                                                    <span className="text-xs text-white italic font-medium">"{card.example}"</span>
                                                    <div className="shrink-0 opacity-60"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                    if (section.trim().startsWith("EXPLANATION_CARD")) {
                        try {
                            let jsonStr = section.replace("EXPLANATION_CARD", "").trim();
                            jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
                            const mastery = JSON.parse(jsonStr);
                            
                            const IconMap: any = {
                                bulb: <Lightbulb size={20} className="text-indigo-600" />,
                                layers: <Layers size={20} className="text-indigo-600" />,
                                tag: <Tag size={20} className="text-indigo-600" />,
                                palette: <Palette size={20} className="text-indigo-600" />,
                                calendar: <Calendar size={20} className="text-indigo-600" />
                            };

                            const ExpandableCard = () => {
                                const [expanded, setExpanded] = useState(true);
                                return (
                                    <div className="w-full bg-[#f0f2ff] dark:bg-indigo-950/20 rounded-3xl overflow-hidden border border-indigo-100 dark:border-indigo-900/30 my-4 shadow-sm animate-in zoom-in-95 duration-500">
                                        <button
                                            onClick={() => setExpanded(e => !e)}
                                            className="w-full px-6 py-5 flex items-center justify-between border-b border-indigo-50 dark:border-indigo-900/20 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white dark:bg-indigo-900/40 rounded-xl shadow-sm">
                                                    <Lightbulb size={20} className="text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-base">{mastery.title}</h4>
                                            </div>
                                            {expanded
                                                ? <ChevronUp size={20} className="text-indigo-400 transition-transform" />
                                                : <ChevronDown size={20} className="text-indigo-400 transition-transform" />
                                            }
                                        </button>
                                        
                                        {expanded && (
                                            <div className="p-4 bg-white/50 dark:bg-zinc-950/20 backdrop-blur-sm">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {mastery.sections?.map((sec: any, sIdx: number) => (
                                                        <div key={sIdx} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                                                    {IconMap[sec.icon] || IconMap.bulb}
                                                                </div>
                                                                <span className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">{sec.title}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                                {sec.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            };

                            return <ExpandableCard key={idx} />;
                        } catch (e) {
                            return <div key={idx} className="text-red-500 text-xs">Error loading mastery card</div>;
                        }
                    }

                    if (section.trim().startsWith("CORRECTION_CARD")) {
                        try {
                            let jsonStr = section.replace("CORRECTION_CARD", "").trim();
                            jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
                            const correction = JSON.parse(jsonStr);
                            
                            return (
                                <div key={idx} className="bg-white dark:bg-zinc-950 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-zinc-800 my-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Sparkles size={16} className="text-amber-600" />
                                        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">Correction & Analysis</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 mb-6 px-4">
                                        <div className="flex flex-col items-center gap-2 flex-1">
                                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">Incorrect</span>
                                            <div className="flex items-center gap-2">
                                                <X size={14} className="text-rose-400" />
                                                <span className="text-lg font-medium text-rose-600 line-through decoration-2 opacity-80">{correction.incorrect}</span>
                                            </div>
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-zinc-900 flex items-center justify-center border border-slate-100 dark:border-zinc-800">
                                            <ArrowRight size={18} className="text-slate-400" />
                                        </div>

                                        <div className="flex flex-col items-center gap-2 flex-1 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Correct</span>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={18} className="text-emerald-500" />
                                                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{correction.correct}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 flex gap-3">
                                        <div className="mt-0.5">
                                            <Info size={16} className="text-amber-600" />
                                        </div>
                                        <div className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                                            {correction.explanation}
                                        </div>
                                    </div>
                                </div>
                            );
                        } catch (e) {
                            return <div key={idx} className="text-red-500 text-xs">Error loading correction</div>;
                        }
                    }

                    if (section.trim().startsWith("VOCAB_CARD")) {
                        try {
                            let jsonStr = section.replace("VOCAB_CARD", "").trim();
                            jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
                            const card = JSON.parse(jsonStr);

                            // Gender-based colors for the top strip
                            const genderStyles: any = {
                                Feminine:  { strip: "bg-rose-50",   text: "text-rose-600",   badge: "text-rose-500 border-rose-200 bg-rose-50"   },
                                Masculine: { strip: "bg-blue-50",   text: "text-blue-600",   badge: "text-blue-500 border-blue-200 bg-blue-50"   },
                                Neuter:    { strip: "bg-emerald-50", text: "text-emerald-600", badge: "text-emerald-500 border-emerald-200 bg-emerald-50" },
                            };
                            const style = genderStyles[card.gender] || genderStyles.Masculine;

                            return (
                                <div key={idx} className="w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 my-3 shadow-sm">
                                    {/* Top colored strip: Article | Gender badge */}
                                    <div className={`${style.strip} dark:bg-zinc-800/60 px-5 py-2.5 flex items-center justify-between`}>
                                        <span className={`text-sm font-bold uppercase tracking-wider ${style.text}`}>{card.article?.toUpperCase()}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest border rounded-full px-2 py-0.5 ${style.badge}`}>{card.gender}</span>
                                    </div>

                                    {/* Card body */}
                                    <div className="px-5 pt-4 pb-0">
                                        {/* Word + speaker icon */}
                                        <div className="flex items-start justify-between mb-1">
                                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{card.word}</span>
                                            <button onClick={() => speak(`${card.article} ${card.word}`)} className="mt-1 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-400 hover:text-[#5a47c7] transition-colors">
                                                <Volume2 size={16} />
                                            </button>
                                        </div>
                                        {/* Translation */}
                                        <div className="text-sm font-semibold text-[#5a47c7] mb-4">{card.translation}</div>

                                        {/* Plural field */}
                                        {card.plural && (
                                            <div className="mb-4">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Plural</div>
                                                <div className="border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800">
                                                    {card.plural}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Example sentence — full width pink/red banner */}
                                    {card.example && (
                                        <div className="bg-gradient-to-r from-[#e91e63] to-[#c2185b] px-5 py-4 flex items-start justify-between gap-2">
                                            <span className="text-sm text-white italic font-medium">"{card.example}"</span>
                                            <div className="shrink-0 mt-0.5 opacity-60">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        } catch (e) {
                            return <div key={idx} className="text-red-500 text-xs">Error loading vocab card</div>;
                        }
                    }

                    const [title, ...bodyParts] = section.split("\n");
                    const body = bodyParts.join("\n").trim();

                    if ([" Explanation", " Example", " Practice", " Progress Update", " Options", " Stats"].some(t => title.includes(t))) {
                       return (
                         <div key={idx} className="flex flex-col gap-2 bg-[#5a47c7]/5 dark:bg-zinc-800/50 p-3 rounded-lg border border-[#5a47c7]/10 dark:border-zinc-700/50 text-slate-800 dark:text-slate-200">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a47c7] dark:text-[#5a47c7]">
                             {title.trim()}
                           </span>
                           <div className="text-sm leading-relaxed whitespace-pre-wrap">
                             {body}
                           </div>
                         </div>
                       );
                    }

                    if (title.includes("Suggestions")) {
                        const suggestions = body.split("\n").map(s => s.trim()).filter(s => s.startsWith("-")).map(s => s.replace("-", "").trim());
                        if (suggestions.length === 0) return null;
                        return (
                            <div key={idx} className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/50">
                                {suggestions.map((s, i) => (
                                    <button key={i} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full text-[#5a47c7] dark:text-[#5a47c7] font-medium hover:bg-[#5a47c7]/5 dark:hover:bg-[#5a47c7]/10 hover:scale-105 active:scale-95 transition-all shadow-sm">
                                        ✨ {s}
                                    </button>
                                ))}
                            </div>
                        );
                    }
                    
                    return <div key={idx} className={cn("leading-relaxed whitespace-pre-wrap", msg.role === "user" ? "text-white" : "text-slate-800 dark:text-slate-200")}>{section.trim()}</div>;
                  })}
                 </div>

                 {msg.role === "assistant" && (
                     <button onClick={() => speak(msg.content)} className="self-start mt-2 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-400 hover:text-[#5a47c7] transition-colors">
                         <Volume2 size={12} />
                     </button>
                 )}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-xs text-slate-400 animate-pulse pl-12 flex items-center gap-2">
            <div className="h-4 w-4 relative rounded-full overflow-hidden">
                <Image src={aiLogo} alt=".." fill className="object-cover" />
            </div>
            AI Assistant is thinking...
            </div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
          {attachment && (
              <div className="relative inline-block w-fit">
                  <img src={attachment} alt="Preview" className="h-16 rounded-lg border border-slate-200" />
                  <button onClick={() => setAttachment(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={10}/></button>
              </div>
          )}
          
          <div className="bg-secondary/50 dark:bg-muted/50 rounded-xl p-1 flex items-center gap-1 border border-border">
             <button onClick={() => userFileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-[#5a47c7] hover:bg-[#5a47c7]/5 rounded-lg transition-colors"><Paperclip size={18} /></button>
             <button onClick={startCamera} className="p-2 text-slate-400 hover:text-[#5a47c7] hover:bg-[#5a47c7]/5 rounded-lg transition-colors"><Camera size={18} /></button>
             <input type="file" ref={userFileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}   />
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSend()}
               placeholder={isRecording ? "Listening..." : "Message..."}
               className={cn("flex-1 bg-transparent px-2 py-3 text-sm focus:outline-none text-slate-800 dark:text-slate-100", isRecording && "placeholder:text-red-500 animate-pulse")}
             />
             
             <button onClick={handleVoiceInput} className={cn("p-2 rounded-lg transition-colors", isRecording ? "bg-red-100 text-red-600 animate-pulse" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50")}>
                 <Mic size={18} />
             </button>
             
             <button onClick={handleSend} disabled={!input.trim() && !attachment} className="p-2.5 bg-[#5a47c7] text-white rounded-lg hover:bg-[#5a47c7]/90 disabled:opacity-50 transition-all shadow-md shadow-[#5a47c7]/20 dark:shadow-none"><Send size={16} /></button>
          </div>
        </div>
      </div>

      <button onClick={() => setisWindowOpen(!isWindowOpen)} className={cn("h-14 w-14 rounded-full bg-[#5a47c7] text-white shadow-xl shadow-[#5a47c7]/30 flex items-center justify-center hover:bg-[#5a47c7]/90 transition-all hover:scale-105 active:scale-95 group overflow-hidden relative", isWindowOpen ? "rotate-90" : "rotate-0")}>
        {isWindowOpen ? <X size={24} /> : <div className="w-10 h-10 relative"><Image src={aiLogo} alt="AI" fill className="object-cover" /></div>}
      </button>
    </div>
  );
}
