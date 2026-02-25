import React, { useState, useEffect, useRef } from 'react';
import { useRoutine } from './RoutineContext';
import {
  Flame, Clock, CheckCircle2, Activity, Briefcase, Home, Info,
  User, ClipboardList, TrendingUp, Settings, ChevronRight, AlertCircle,
  Camera, Award, Mic, Heart, Moon, Footprints, ArrowUpRight, Compass, Zap, BarChart3, MessageSquare, Send, Bot, X, Plus, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const formatTime = (hours) => {
  const h = Math.floor(hours);
  const m = Math.floor((hours % 1) * 60);
  return `${h}시간 ${m}분`;
};

// --- [PinLock] Security Privacy (PRD 4) ---
const PinLock = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (val) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin === '1234') { // Mock PIN
        onUnlock();
      } else if (newPin.length === 4) {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-space-gray z-[9999] flex flex-col items-center justify-center p-10">
      <div className="mb-12 text-center">
        <Zap size={48} className="text-electric-blue mx-auto mb-4" />
        <h2 className="text-2xl font-black tracking-widest">SECURE ACCESS</h2>
        <p className="text-dim text-sm mt-2">{error ? 'ACCESS DENIED' : 'IDENTIFICATION REQUIRED'}</p>
      </div>
      <div className="flex gap-4 mb-12">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 border-white/20 ${pin.length > i ? 'bg-electric-blue border-electric-blue shadow-[0_0_10px_rgba(0,229,255,0.5)]' : ''}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((val, i) => (
          <button
            key={i}
            className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold active:bg-electric-blue transition-all"
            onClick={() => val === 'del' ? setPin(pin.slice(0, -1)) : handleInput(val)}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- [ConditionModal] Junsemi PRD F1 ---
const ConditionModal = ({ onSave }) => {
  const [fatigue, setFatigue] = useState(5);
  const [pain, setPain] = useState({ back: 0, knee: 0 });
  const [alcohol, setAlcohol] = useState(false);
  const [sodium, setSodium] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[5000] flex flex-col justify-end">
      <div className="bg-[#1a1a1a] rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom duration-500 max-h-[95vh] overflow-y-auto">
        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
        <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Daily Sync</h3>
        <p className="text-dim text-sm mb-10">오늘의 신체 데이터를 동기화합니다.</p>

        <div className="space-y-12 mb-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-dim tracking-[0.2em] uppercase flex justify-between">
              Fatigue Level <span>{fatigue}/10</span>
            </label>
            <input type="range" min="1" max="10" value={fatigue} onChange={e => setFatigue(parseInt(e.target.value))} className="w-full accent-electric-blue" />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <button onClick={() => setAlcohol(!alcohol)} className={`py-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${alcohol ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/5 border-white/10 text-dim'}`}>
              <Zap size={24} className={alcohol ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">Alcohol In</span>
            </button>
            <button onClick={() => setSodium(!sodium)} className={`py-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${sodium ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-dim'}`}>
              <Zap size={24} className={sodium ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">Salt / Sodium</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-dim tracking-[0.2em] uppercase">Back Pain</label>
              <div className="flex gap-2">
                {[0, 2, 5].map(v => (
                  <button key={v} onClick={() => setPain({ ...pain, back: v })} className={`flex-1 py-4 rounded-xl border text-xs font-bold transition-all ${pain.back === v ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 text-dim'}`}>
                    {v === 0 ? '정상' : v === 2 ? '경미' : '주의'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-dim tracking-[0.2em] uppercase">Knee Pain</label>
              <div className="flex gap-2">
                {[0, 2, 5].map(v => (
                  <button key={v} onClick={() => setPain({ ...pain, knee: v })} className={`flex-1 py-4 rounded-xl border text-xs font-bold transition-all ${pain.knee === v ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 text-dim'}`}>
                    {v === 0 ? '정상' : v === 2 ? '경미' : '주의'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-6 rounded-3xl bg-electric-blue text-space-gray font-black tracking-widest active:scale-95 transition-all text-lg shadow-[0_10px_30px_rgba(0,229,255,0.3)]" onClick={() => onSave({ fatigue, pain, alcoholFlag: alcohol, sodiumFlag: sodium })}>
          SYNC DATA & START
        </button>
      </div>
    </div>
  );
};

// --- [HomeView] Primary Dashboard ---
const HomeView = ({ onNavigate }) => {
  const { user, analysis, habits, ptPlan, toggleSet, completeWorkout, profile } = useRoutine();
  const [showSettings, setShowSettings] = useState(false);

  if (!analysis) return <div className="p-10 text-center animate-pulse text-dim">LOADING DATA...</div>;

  const handleCompleteSession = () => {
    addExerciseEntry({
      category: 'Strength',
      exercises: ptPlan.recommendations,
      duration: 45,
      burntKcal: 320
    });
    completeWorkout(); // Legacy XP gain & streak
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Safe variables to prevent NaN errors
  const intake = analysis.intake || 0;
  const tdee = analysis.tdee || 2000;
  const remaining = Math.max(0, tdee - intake);
  const intakePercent = Math.min(100, (intake / tdee) * 100) || 0;

  // SVG Circle calculations (safe against NaN)
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~377
  const strokeDashoffset = isNaN(circumference) ? 0 : circumference - (intakePercent / 100) * circumference;

  return (
    <div className="content-wrapper pb-32 animate-in fade-in duration-500">
      <header className="mb-6 pt-6 flex justify-between items-center px-4">
        <div>
          <h1 className="text-2xl font-black text-text">대시보드</h1>
          <p className="text-dim text-[10px] font-bold mt-1">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>
        <div className="relative">
          <div
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 cursor-pointer transition-transform active:scale-95"
            onClick={() => setShowSettings(true)}
          >
            <User size={18} className="text-dim hover:text-primary transition-colors" />
          </div>
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-bg" />
        </div>
      </header>

      {/* 1. Main Calorie Gauge Section */}
      <section className="mb-8 px-4 flex flex-col items-center">
        <div className="card w-full flex flex-col items-center py-8">
          <h2 className="text-sm font-bold text-dim mb-4">오늘의 식단</h2>

          <div className="relative flex items-center justify-center w-48 h-48 mb-6">
            {/* Background Track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%" cy="50%" r={radius}
                stroke="var(--color-bg)" strokeWidth="14" fill="none"
              />
              {/* Progress Track */}
              <circle
                cx="50%" cy="50%" r={radius}
                stroke="var(--color-primary)" strokeWidth="14" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-dim mb-1">섭취 칼로리</span>
              <span className="text-4xl font-black text-text tracking-tighter">{intake}</span>
              <span className="text-[10px] font-bold text-dim mt-1">/ {tdee} kcal</span>
            </div>
          </div>

          <div className="flex w-full px-8 justify-between text-center">
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-dim font-bold mb-1">권장 목표</p>
              <p className="font-bold text-text">{tdee} <span className="text-[10px] font-normal">kcal</span></p>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-dim font-bold mb-1">잔여 칼로리</p>
              <p className="font-bold text-primary">{remaining} <span className="text-[10px] font-normal">kcal</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Primary Record Button (+ 식단 기록하기) */}
      <div className="px-4 mb-8">
        <button onClick={() => onNavigate('record')} className="w-full py-4 rounded-xl bg-text text-card font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Plus size={18} />
          식단 기록하기
        </button>
      </div>

      {/* 3. Macronutrient Progress Bars (탄단지) */}
      <section className="px-4 mb-8">
        <div className="card p-6">
          <h3 className="text-sm font-bold text-text mb-5">영양소 섭취 현황</h3>

          <div className="space-y-6">
            {[
              { label: '탄수화물', cur: analysis.currentMacros.carb || 0, tar: analysis.targetMacros.carb || 150, color: 'bg-emerald-400' },
              { label: '단백질', cur: analysis.currentMacros.protein || 0, tar: analysis.targetMacros.protein || 100, color: 'bg-sky-400' },
              { label: '지방', cur: analysis.currentMacros.fat || 0, tar: analysis.targetMacros.fat || 50, color: 'bg-amber-400' }
            ].map((macro, i) => {
              const safePercent = Math.min(100, (macro.cur / macro.tar) * 100) || 0;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-dim">{macro.label}</span>
                    <span className="font-bold text-text">{macro.cur}g <span className="text-dim/60 font-medium">/ {macro.tar}g</span></span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${macro.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${safePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Active Missions / Habits */}
      <section className="px-4">
        <h3 className="text-sm font-bold text-text mb-4">오늘의 미션</h3>
        <div className="space-y-3">
          {habits.slice(0, 2).map((habit) => (
            <div key={habit.id} className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${habit.streak > 0 ? 'bg-primary shadow-[0_0_8px_rgba(244,114,182,0.4)]' : 'bg-slate-200'}`} />
                <span className="text-sm font-bold text-text">{habit.name}</span>
              </div>
              <span className="text-[10px] font-bold text-dim bg-slate-50 px-2 py-1 rounded">{habit.streak} 일째 달성중</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Active Protocol Routine */}
      <section className="mb-20 px-2" >
        <h3 className="text-[10px] font-black text-dim tracking-[0.3em] mb-6 uppercase pl-2 flex justify-between items-center">
          Next Mission Protocol
          <span className="px-3 py-1 bg-electric-blue/10 text-electric-blue rounded-full text-[8px] font-black tracking-widest border border-electric-blue/20">
            {analysis.currentMode.toUpperCase()} ACTIVE
          </span>
        </h3>

        <div className="space-y-4">
          {ptPlan.recommendations.map((ex, i) => {
            const isFullyCompleted = ex.completedSets?.length === ex.sets;
            return (
              <div key={ex.id || i} className={`card p-6 flex flex-col bg-gradient-to-r ${isFullyCompleted ? 'from-electric-blue/10 to-transparent border-electric-blue/50' : 'from-white/[0.03] to-transparent border-white/5'} transition-all duration-300 group`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[8px] text-electric-blue font-black tracking-widest uppercase mb-1 opacity-60">Sequence {String(i + 1).padStart(2, '0')}</p>
                    <h4 className={`font-black text-lg tracking-tighter transition-colors ${isFullyCompleted ? 'text-electric-blue' : 'text-white group-hover:text-electric-blue/80'}`}>{ex.name}</h4>
                    <p className="text-[10px] text-dim font-bold mt-1 uppercase tracking-tighter">Target: {ex.reps} Reps · {ex.weight}kg</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <span className={`text-2xl font-black italic transition-colors ${isFullyCompleted ? 'text-electric-blue text-shadow-[0_0_10px_rgba(0,229,255,0.5)]' : 'text-white'}`}>{ex.completedSets?.length || 0}</span>
                      <span className="text-[10px] text-dim font-bold">/ {ex.sets}</span>
                    </div>
                    <span className="text-[8px] text-dim uppercase tracking-widest mt-1">SETS</span>
                  </div>
                </div>

                {/* Interactive Set Toggles */}
                <div className="flex gap-2">
                  {[...Array(ex.sets)].map((_, setIdx) => {
                    const isCompleted = ex.completedSets?.includes(setIdx);
                    return (
                      <button
                        key={setIdx}
                        onClick={() => toggleSet(ex.id, setIdx)}
                        className={`flex-1 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-90 ${isCompleted
                          ? 'bg-electric-blue border-electric-blue text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                          : 'bg-white/5 border-white/10 text-dim hover:border-electric-blue/50 hover:bg-white/10'
                          }`}
                      >
                        {isCompleted ? <Check size={16} strokeWidth={4} /> : <span className="text-[10px] font-black">{setIdx + 1}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button
            className={`w-full py-6 rounded-3xl font-black tracking-[0.2em] active:scale-95 transition-all text-base mt-4 shadow-[0_10px_30px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2 ${ptPlan.recommendations.some(ex => ex.completedSets?.length > 0)
              ? 'bg-electric-blue text-space-gray hover:bg-white'
              : 'bg-white/10 text-dim cursor-not-allowed opacity-50'
              }`}
            onClick={completeWorkout}
            disabled={!ptPlan.recommendations.some(ex => ex.completedSets?.length > 0)}
          >
            <CheckCircle2 size={20} className={ptPlan.recommendations.some(ex => ex.completedSets?.length > 0) ? 'text-black' : 'text-dim'} />
            COMPLETE PROTOCOL
          </button>
        </div>
      </section >

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div >
  );
};


// --- [RecordView] Intelligent Diet Logging & Habits ---
const RecordView = () => {
  const {
    diet, activity, habits, lifestyle, addDietEntry, removeDietEntry, carryover, trackWater, toggleSupplement
  } = useRoutine();

  const [mealType, setMealType] = useState('Breakfast');
  const [inputText, setInputText] = useState('');
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    // Simulate AI processing
    setTimeout(() => {
      let mockKcal = 0, pt = 0, cb = 0, ft = 0;
      if (inputText.includes('닭가슴살')) { mockKcal += 120; pt += 25; cb += 0; ft += 2; }
      else if (inputText.includes('샐러드')) { mockKcal += 150; pt += 5; cb += 20; ft += 7; }
      else if (inputText.includes('연어')) { mockKcal += 200; pt += 20; cb += 0; ft += 13; }
      else { mockKcal = 350; pt = 15; cb = 40; ft = 12; }

      setPreview({
        name: inputText,
        kcal: mockKcal,
        protein: pt,
        carb: cb,
        fat: ft,
        feedback: `${inputText}의 대략적인 영양 성분을 분석했습니다. 훌륭한 선택입니다!`
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleRecord = () => {
    if (preview) {
      addDietEntry({
        type: mealType,
        items: [preview],
        isAiAnalyzed: true,
        feedback: preview.feedback
      });
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#00E5FF'] });
      setInputText('');
      setPreview(null);
    }
  };

  const handleQuickAdd = (log) => {
    addDietEntry({
      type: mealType, // Add to current selected meal type
      items: log.items,
      isAiAnalyzed: false,
      feedback: "빠른 추가 완료"
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#A1A1AA'] });
  };

  const todayStr = new Date().toDateString();

  return (
    <div className="content-wrapper pb-32 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black mb-8 mt-4 uppercase tracking-tighter px-2">Log Activity</h2>

      {/* 1. Intelligent Diet Logging */}
      <div className="mb-10 px-2 space-y-4">
        {/* Meal Type Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {mealTypes.map(type => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${mealType === type
                ? 'bg-electric-blue text-black shadow-[0_0_15px_rgba(0,229,255,0.4)] border border-electric-blue'
                : 'bg-white/5 text-dim border border-white/10 hover:bg-white/10'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Smart Input Card */}
        <div className="card glass p-1 bg-gradient-to-r from-electric-blue/20 via-transparent to-transparent border-electric-blue/30 relative focus-within:ring-1 focus-within:ring-electric-blue">
          <div className="bg-space-gray/80 backdrop-blur-md rounded-[18px] p-4 flex flex-col gap-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="무엇을 드셨나요? (ex. 닭가슴살 샐러드)"
              className="bg-transparent border-none text-white placeholder:text-dim/50 resize-none h-20 outline-none text-sm leading-relaxed"
            />

            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
              <button
                onClick={() => {
                  setInputText("단백질 쉐이크와 닭가슴살 샌드위치");
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#00E5FF'] });
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-electric-blue bg-electric-blue/10 hover:bg-electric-blue hover:text-black transition-colors"
                title="Marlang Vision Scan"
              >
                <Camera size={18} />
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
                className="px-6 py-2.5 rounded-full bg-electric-blue text-black font-black text-[10px] tracking-widest disabled:opacity-50 disabled:bg-white/10 disabled:text-dim transition-colors"
              >
                ANALYZE
              </button>
            </div>
          </div>
        </div>

        {/* AI Preview Card */}
        {isAnalyzing && (
          <div className="card glass p-6 flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-electric-blue border-t-transparent animate-spin" />
            <p className="text-[10px] font-black tracking-widest text-electric-blue uppercase">Marlang Vision 연동 중...</p>
          </div>
        )}

        {preview && !isAnalyzing && (
          <div className="card bg-gradient-to-br from-electric-blue/10 to-transparent border-electric-blue/50 p-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={20} className="text-electric-blue" />
              <h4 className="text-sm font-black text-white italic">Analysis Complete</h4>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="col-span-1 flex flex-col items-center justify-center bg-white/5 rounded-xl p-3 border border-white/10">
                <span className="text-lg font-black text-white">{preview.kcal}</span>
                <span className="text-[8px] font-bold text-dim uppercase tracking-widest mt-1">KCAL</span>
              </div>
              {[
                { label: 'PRO', val: preview.protein, color: 'text-emerald-400' },
                { label: 'CARB', val: preview.carb, color: 'text-sky-400' },
                { label: 'FAT', val: preview.fat, color: 'text-rose-400' }
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center justify-center bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className={`text-base font-black ${m.color}`}>{m.val}g</span>
                  <span className="text-[8px] font-bold text-dim uppercase tracking-widest mt-1">{m.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleRecord}
              className="w-full py-4 rounded-xl bg-electric-blue text-black font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95 transition-all"
            >
              SAVE RECORD
            </button>
          </div>
        )}
      </div>

      <div className="px-2">
        {/* Recent Meals (Quick Add) */}
        {diet.logs.length > 0 && (
          <>
            <h3 className="text-[10px] font-black text-dim tracking-widest uppercase pl-4 mb-2">Recent Logs</h3>
            {diet.logs.slice(0, 3).map((log) => {
              const totalProtein = log.items.reduce((acc, item) => acc + (item.protein || 0), 0);
              const totalKcal = log.items.reduce((acc, item) => acc + (item.kcal || 0), 0);
              return (
                <div
                  key={log.id}
                  onClick={() => setInputText(log.items[0]?.name || "")}
                  className="card p-4 flex justify-between items-center bg-white/[0.01] border-white/5 hover:border-white/20 transition-all cursor-pointer mb-2 group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Flame size={16} className="text-amber-500 opacity-80" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm tracking-tight">{log.items[0]?.name || "Meal Entry"}</h4>
                      <p className="text-[9px] text-dim font-bold uppercase tracking-widest mt-0.5">
                        {totalProtein}g PRO · {totalKcal} KCAL
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleQuickAdd(log)}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-dim bg-white/5 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeDietEntry(log.id)}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-dim bg-white/5 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Workout Log & Habits (Preserved from original) */}
        <h3 className="text-[10px] font-black text-dim tracking-widest uppercase pl-4 mt-8 mb-2">Workout Status</h3>
        {activity.workouts.length === 0 ? (
          <div className="card p-6 text-center border-dashed border-white/5 bg-transparent mb-8">
            <p className="text-[10px] text-dim font-bold uppercase opacity-50">NO SESSIONS LOGGED TODAY</p>
          </div>
        ) : (
          activity.workouts.slice(0, 1).map((workout) => (
            <div key={workout.id} className="card p-5 flex justify-between items-center bg-white/[0.02] border-white/5 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Activity size={16} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{workout.exercises[0]?.name || "Workout"}</h4>
                  <p className="text-[9px] text-dim font-bold uppercase tracking-widest mt-0.5">
                    {workout.totalBurntKcal} KCAL BURNT
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-black text-electric-blue px-2 py-1 bg-electric-blue/10 rounded-md">COMPLETED</span>
            </div>
          ))
        )}

        {/* 2. Lifestyle & Habits Tracker (New Category 6 Feature) */}
        <h3 className="text-[10px] font-black text-dim tracking-widest uppercase pl-4 mb-2 flex justify-between items-center">
          Lifestyle & Habits
          <span className="text-[8px] text-electric-blue">XP BOOST ACTIVE</span>
        </h3>

        {/* Water Intake Tracker */}
        <div className="card glass p-6 mb-4 relative overflow-hidden group">
          {/* Water Fill Background effect */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-blue-500/10 transition-all duration-1000 ease-in-out z-0"
            style={{ height: `${(lifestyle.water.intake / lifestyle.water.target) * 100}%` }}
          />

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Water Intake</h4>
              <p className="text-[10px] text-dim font-bold uppercase tracking-widest">{lifestyle.water.intake} / {lifestyle.water.target} Glasses</p>
            </div>

            <div className="flex gap-2">
              {[...Array(lifestyle.water.target)].map((_, i) => (
                <div
                  key={i}
                  onClick={trackWater}
                  className={`w-6 h-8 rounded-b-lg border-2 cursor-pointer transition-all duration-300 ${i < lifestyle.water.intake
                    ? 'bg-blue-400 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'
                    : 'bg-white/5 border-white/10 hover:border-blue-400/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Supplements/Daily Routines */}
        <div className="grid grid-cols-2 gap-4">
          {lifestyle.supplements.map((sup, i) => {
            const isCompleted = sup.lastCompleted === todayStr;
            return (
              <div
                key={sup.id}
                onClick={() => toggleSupplement(sup.id)}
                className={`card p-4 cursor-pointer transition-all duration-300 active:scale-95 border ${isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  {sup.name.includes("비타민") || sup.name.includes("유산균") ? <Briefcase size={16} className={isCompleted ? "text-emerald-400" : "text-dim"} /> : <Heart size={16} className={isCompleted ? "text-emerald-400" : "text-dim"} />}
                  {isCompleted && <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-400/10 px-1 py-0.5 rounded">DONE +15XP</span>}
                </div>
                <h4 className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-dim'}`}>{sup.name}</h4>
                <p className="text-[8px] text-dim/60 font-black uppercase tracking-widest mt-1">{sup.amount}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div >
  );
};

// --- [ReportView] Visual SVG Charts & InBody Analytics ---
const ReportView = () => {
  const { healthData, analysis, profile, addInbodyEntry } = useRoutine();
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const fileInputRef = useRef(null);

  const handleInbodyScanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setScanDone(false);

    // Simulate OCR process taking 2 seconds
    setTimeout(() => {
      const currentWeight = healthData.inbodyHistory[0]?.weight || 77;
      const variation = (Math.random() - 0.5) * 0.4;
      addInbodyEntry({
        weight: parseFloat((currentWeight + variation).toFixed(1)),
        muscleMass: parseFloat(((healthData.inbodyHistory[0]?.muscleMass || 34) + (Math.random() - 0.5) * 0.2).toFixed(1)),
        fat: parseFloat(((healthData.inbodyHistory[0]?.fat || 14) + (Math.random() - 0.5) * 0.2).toFixed(1)),
        bmi: parseFloat((analysis.bmi || 24.4).toFixed(1)),
      });
      setIsScanning(false);
      setScanDone(true);

      // Reset input to effectively "discard" the photo
      e.target.value = null;

      setTimeout(() => setScanDone(false), 3000);
    }, 2000);
  };

  // Calculate points for the Weight Trend chart
  const history = [...healthData.inbodyHistory].reverse(); // oldest to newest for chart left-to-right
  const minWeight = Math.min(...history.map(d => d.weight)) - 2;
  const maxWeight = Math.max(...history.map(d => d.weight)) + 2;
  const range = maxWeight - minWeight;

  const width = 300;
  const height = 120;

  const safeRange = range === 0 ? 1 : range;

  const points = history.map((d, i) => {
    const x = (i / (history.length - 1 || 1)) * width;
    const y = height - ((d.weight - minWeight) / safeRange) * height;
    return `${x},${y}`;
  }).join(' ');

  // For Area Chart
  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="content-wrapper pb-32 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black mb-8 mt-4 uppercase tracking-tighter px-2">Analytics</h2>

      {/* 0. Body Insight Card (New Feature) */}
      <section className="mb-6 px-2">
        <div className="card bg-gradient-to-br from-electric-blue/10 to-transparent border-electric-blue/30 p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-electric-blue/10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Activity size={80} />
          </div>
          <h4 className="text-[10px] font-black text-electric-blue tracking-widest uppercase mb-2">Body Insight</h4>
          <h3 className="text-lg font-black text-white leading-tight mb-2 tracking-tighter">{analysis.bodyInsight.title}</h3>
          <p className="text-xs text-dim font-medium leading-relaxed max-w-[90%]">{analysis.bodyInsight.text}</p>
        </div>
      </section>

      {/* 1. InBody Composition (Enhanced Sliders) */}
      <section className="mb-6 px-2">
        <div className="card glass p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-end mb-8">
            <h4 className="text-sm font-black text-white uppercase tracking-tighter">InBody Composition</h4>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={handleInbodyScanClick}
              disabled={isScanning}
              className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all active:scale-95 ${scanDone
                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                : isScanning
                  ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20 animate-pulse'
                  : 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20 hover:bg-electric-blue/20'
                }`}
            >
              {scanDone ? <><Check size={10} /> Photo Discarded</> : isScanning ? '⟳ Analyzing Image...' : <><Camera size={10} /> Upload InBody Photo</>}
            </button>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Skeletal Muscle', val: healthData.inbodyHistory[0]?.muscleMass, target: 35, unit: 'kg', color: 'bg-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
              { label: 'Body Fat', val: healthData.inbodyHistory[0]?.fat, target: 12, unit: 'kg', color: 'bg-rose-400', glow: 'shadow-[0_0_10px_rgba(251,113,133,0.5)]' },
              { label: 'Weight', val: healthData.inbodyHistory[0]?.weight, target: profile.targetWeight, unit: 'kg', color: 'bg-electric-blue', glow: 'shadow-[0_0_10px_rgba(0,229,255,0.5)]' },
            ].map((item, i) => (
              <div key={i} className="space-y-3 relative group">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-dim uppercase tracking-tighter">{item.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-black text-white italic">{item.val}</span>
                    <span className="text-[9px] text-dim not-italic uppercase ml-0.5">{item.unit}</span>
                  </div>
                </div>

                {/* Advanced Slider Bar */}
                <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  {/* Target Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white/30 z-10"
                    style={{ left: `${item.target > 0 ? Math.min(100, (item.target / (item.target * 1.5)) * 100) : 0}%` }}
                  />
                  {/* Fill Bar */}
                  <div
                    className={`h-full ${item.color} ${item.glow} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.target > 0 ? Math.min(100, (item.val / (item.target * 1.5)) * 100) : 0}%` }}
                  />
                </div>
                {/* Target Label */}
                <div className="flex justify-between mt-1 px-1">
                  <span className="text-[8px] text-dim/50 uppercase font-bold tracking-widest">Target: {item.target}{item.unit}</span>
                  <span className="text-[8px] text-white/50 uppercase font-bold tracking-widest">{(item.target > 0 ? (item.val / item.target) * 100 : 0).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Weight Trend (Area Chart) */}
      <section className="mb-6 px-2">
        <div className="card glass p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-tighter mb-1">Weight Trend</h4>
              <p className="text-[9px] text-dim tracking-widest uppercase font-bold">Past 3 Months</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-electric-blue italic">{healthData.inbodyHistory[0]?.weight}</span>
              <span className="text-[10px] text-dim font-bold ml-1 uppercase">kg</span>
            </div>
          </div>

          <div className="relative h-40 bg-white/[0.02] rounded-2xl p-4 overflow-hidden border border-white/5">
            {/* Y-axis guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 px-2 pointer-events-none opacity-20">
              <div className="border-t border-dashed border-white/30 w-full"></div>
              <div className="border-t border-dashed border-white/30 w-full"></div>
              <div className="border-t border-dashed border-white/30 w-full"></div>
            </div>

            <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full drop-shadow-[0_0_15px_rgba(0,229,255,0.2)] overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <polygon points={areaPoints} fill="url(#areaGradient)" />
              <polyline fill="none" stroke="#00E5FF" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />

              {history.map((d, i) => {
                const x = (i / (history.length - 1 || 1)) * width;
                const y = height - ((d.weight - minWeight) / safeRange) * height;
                return (
                  <g key={i}>
                    {/* Glow and point */}
                    <circle cx={x} cy={y} r="6" fill="#00E5FF" opacity="0.3" className="animate-pulse" />
                    <circle cx={x} cy={y} r="3" fill="#FFFFFF" stroke="#00E5FF" strokeWidth="2" />
                    {/* Value Label (only first and last to avoid clutter) */}
                    {(i === 0 || i === history.length - 1) && (
                      <text x={x} y={y - 12} fill="#A1A1AA" fontSize="10" fontWeight="bold" textAnchor={i === 0 ? "start" : "end"}>
                        {d.weight}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* 3. Data Source Info */}
      <section className="px-2 mb-6">
        <div className="card p-5 border-white/5 bg-white/[0.02]">
          <h4 className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info size={12} className="text-electric-blue" />
            데이터 분석 근거
          </h4>
          <ul className="space-y-2 text-[10px] text-dim leading-relaxed">
            <li>• <span className="text-white/70 font-bold">BMI</span>: 프로필 키·몸무게 기반 자동 계산 (체중 / 키²)</li>
            <li>• <span className="text-white/70 font-bold">InBody</span>: 'Scan InBody' 버튼으로 최신 데이터를 수동 동기화</li>
            <li>• <span className="text-white/70 font-bold">AG Score</span>: 식단 달성률·운동 연속 일수·습관 완료율 종합 점수</li>
            <li>• <span className="text-white/70 font-bold">칼로리/영양소</span>: 오늘 날짜 기록된 LOG 데이터만 집계</li>
          </ul>
        </div>
      </section>

      {/* 4. Summary Stats (BMI added) */}
      <section className="px-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5 border-t-2 border-t-electric-blue/50 bg-gradient-to-b from-electric-blue/5 to-transparent">
            <p className="text-[10px] text-dim font-black uppercase tracking-widest mb-1">BMI Index</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-black text-white">{analysis.bmi}</p>
              <p className={`text-[10px] font-black uppercase mb-1 ${analysis.bmiStatus === 'Normal' ? 'text-emerald-400' :
                analysis.bmiStatus === 'Underweight' ? 'text-cyan-400' : 'text-rose-400'
                }`}>{analysis.bmiStatus}</p>
            </div>
          </div>
          <div className="card p-5 border-white/5">
            <p className="text-[10px] text-dim font-black uppercase tracking-widest mb-1">Rank Level</p>
            <p className="text-sm font-black text-electric-blue uppercase mt-1">Level {profile.level}</p>
            <p className="text-[9px] text-dim uppercase tracking-tighter mt-1">{analysis.agScore > 50 ? 'Stellar Voyager' : 'Ground Zero'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- [ChatView] Context-Aware AI Interaction ---
const ChatView = () => {
  const { analysis, diet, profile } = useRoutine();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `안녕하세요 ${profile.name}님! 저는 Anti-Gravity AI 헬스 코치, Marlang입니다. 현재 상태를 바탕으로 맞춤 조언을 해드릴게요. 무엇이 궁금하신가요?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const userText = typeof text === 'string' ? text : inputValue;
    if (!userText.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Logic based on RoutineContext
    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = userText.toLowerCase();

      if (lowerInput.includes("저녁") || lowerInput.includes("메뉴") || lowerInput.includes("추천") || lowerInput.includes("밥") || lowerInput.includes("점심")) {
        if (analysis.currentMacros.protein < analysis.targetMacros.protein * 0.8) {
          aiResponse = `오늘 단백질이 목표치보다 약 ${Math.max(0, analysis.targetMacros.protein - analysis.currentMacros.protein)}g 더 필요하네요! 저녁 메뉴로는 단백질이 풍부한 닭가슴살 샐러드나 구운 연어, 가벼운 두부 요리를 추천합니다. (남은 여유 칼로리: ${analysis.remainingKcal}kcal)`;
        } else if (analysis.intake > analysis.tdee * 0.9) {
          aiResponse = `오늘 이미 많은 칼로리(${analysis.intake}kcal)를 섭취하셨습니다! 가벼운 채소 위주의 식단이나 단식 프로토콜을 유지하시는 걸 추천드려요.`;
        } else {
          aiResponse = `오늘 권장 단백질을 훌륭하게 채우셨군요! 남은 ${analysis.remainingKcal}kcal 내에서 신선한 야채가 듬뿍 들어간 포케나 가벼운 샌드위치는 어떨까요?`;
        }
      } else if (lowerInput.includes("운동") || lowerInput.includes("루틴") || lowerInput.includes("프로토콜")) {
        aiResponse = `현재 ${analysis.currentMode} 모드가 활성화되어 있습니다. \n\n🤖 코치 브리핑: "${analysis.reason}" \n\nORBIT 탭 하단의 'Next Mission Protocol'을 확인하고 오늘 분량의 세트를 완수해보세요!`;
      } else if (lowerInput.includes("인바디") || lowerInput.includes("상태") || lowerInput.includes("몸") || lowerInput.includes("체중")) {
        aiResponse = `최근 데이터 분석 결과: ${analysis.bodyInsight.title} \n\n💡 ${analysis.bodyInsight.text} \n\nBMI 지수는 ${analysis.bmi}로 '${analysis.bmiStatus}' 상태입니다. 조금만 더 파이팅 하세요!`;
      } else if (lowerInput.includes("안녕") || lowerInput.includes("반가워") || lowerInput.includes("누구")) {
        aiResponse = `안녕하세요! 오늘도 건강한 하루를 위해 저 Marlang이 대기 중입니다. 저는 ${profile.name}님의 데이터를 실시간으로 읽고 있어요. 식단 추천이나 운동 가이드에 대해 물어봐주세요!`;
      } else if (lowerInput.includes("점수") || lowerInput.includes("스코어") || lowerInput.includes("랭크")) {
        aiResponse = `${profile.name}님의 현재 Anti-Gravity 스코어는 ${analysis.agScore}점입니다! 현재 레벨 ${profile.level}로 순항 중이시네요. 꾸준한 루틴 달성이 스코어 상승의 핵심입니다.`;
      } else {
        aiResponse = `현재 ${analysis.remainingKcal}kcal 정도 더 섭취하실 수 있는 여유가 있습니다. (오늘 ${analysis.intake}kcal 섭취) \n\n혹시 식단 기록이 누락되었거나 운동 루틴에 대해 궁금한 점이 있으신가요?`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickSuggestions = ["저녁 메뉴 추천해줘 🥗", "내 인바디 상태 어때? 📈", "운동 루틴 조언해줘 🏋️‍♂️"];

  return (
    <div className="content-wrapper flex flex-col h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="py-4 px-4 border-b border-white/10 flex items-center gap-3 bg-space-gray/90 backdrop-blur-md z-10 shrink-0 mt-2">
        <div className="w-10 h-10 rounded-full bg-electric-blue flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
          <Bot size={20} className="text-black" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white italic tracking-tighter">Marlang AI</h2>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">Online & Ready</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-4 shrink min-h-0 no-scrollbar relative">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 text-[13px] leading-relaxed relative ${msg.sender === 'user'
              ? 'bg-electric-blue text-black font-bold rounded-2xl rounded-tr-sm shadow-[0_5px_15px_rgba(0,229,255,0.2)]'
              : 'glass text-white font-medium border border-white/5 rounded-2xl rounded-tl-sm'
              }`}>
              {msg.text.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center justify-center border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 bg-space-gray border-t border-white/5">
        <div className="flex gap-2 overflow-x-auto mb-3 no-scrollbar pb-1">
          {quickSuggestions.map((text, i) => (
            <button key={i} onClick={() => handleSend(text)} className="whitespace-nowrap px-4 py-2 rounded-full glass border border-white/10 text-[10px] text-dim font-bold hover:text-electric-blue hover:border-electric-blue/50 transition-colors">
              {text}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="마를랑 코치에게 물어보세요..."
            className="flex-1 glass border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-electric-blue/50 focus:bg-white/5 outline-none transition-all placeholder:text-dim/50"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-12 h-12 rounded-2xl bg-electric-blue flex items-center justify-center text-black active:scale-95 transition-all disabled:opacity-30 disabled:bg-white/10 disabled:text-white/30"
          >
            <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- [SettingsModal] Profile & Data Management (Spring Theme Compatible) ---
const SettingsModal = ({ onClose }) => {
  const { profile, updateProfile } = useRoutine();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    updateProfile(tempProfile);
    setIsEditing(false);
    confetti({ particleCount: 50, colors: ['#F472B6'] });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex flex-col justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 flex" onClick={onClose} />
      <div className="bg-card rounded-t-[32px] p-6 pb-12 w-full max-w-md mx-auto relative flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-500 border-t border-white/10 shadow-[0_-20px_50px_rgba(51,65,85,0.05)]">

        {/* Drag Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0 cursor-pointer" onClick={onClose} />

        <div className="flex justify-between items-center mb-8 shrink-0">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-text">System Settings</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-dim hover:text-text transition-colors">
            <ChevronRight className="rotate-90" size={20} />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar pb-10">
          {/* Identity Card */}
          <div className="card p-0 overflow-hidden mb-6 border-white/10" onClick={() => { setTempProfile(profile); setIsEditing(true); }}>
            <div className="flex items-center gap-4 p-5 cursor-pointer active:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-electric-blue/10 flex items-center justify-center text-electric-blue group-hover:bg-electric-blue group-hover:text-white transition-colors">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-text mb-0.5">Profile Identity</div>
                <div className="text-xs text-dim tracking-wide">{profile.name} · {profile.height}cm · {profile.weight}kg</div>
              </div>
              <div className="p-2 rounded-full bg-white/5 text-dim group-hover:bg-white/10 group-hover:text-text transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* System Options */}
          <h3 className="text-[10px] font-black text-dim tracking-widest uppercase mb-3 pl-2">Data & Preferences</h3>
          <div className="card p-0 overflow-hidden mb-8 border-white/10">
            {[
              { icon: <Heart size={18} />, label: 'HealthKit Sync', sub: 'Biometric link established', color: 'text-rose-400', bg: 'bg-rose-400/10' },
              { icon: <Settings size={18} />, label: 'Interface Theme', sub: 'Spring mode active', color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { icon: <ClipboardList size={18} />, label: 'Data Export', sub: 'Download protocol history', color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity ${i !== 2 ? 'border-b border-white/5' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-text">{item.label}</div>
                  <div className="text-[10px] text-dim tracking-wide mt-0.5">{item.sub}</div>
                </div>
                <div className="text-[9px] font-black text-dim uppercase bg-white/5 px-2 py-1 rounded">Soon</div>
              </div>
            ))}
          </div>

          <div className="mt-auto px-2">
            <button className="w-full py-4 rounded-xl border border-rose-500/30 text-rose-500/80 font-black tracking-widest text-[10px] uppercase hover:bg-rose-500/10 transition-colors">
              Reset Protocol Data
            </button>
            <p className="text-center text-[9px] font-black text-dim tracking-[0.4em] uppercase opacity-30 mt-6">Anti-Gravity // Build 4.5.1</p>
          </div>
        </div>
      </div>

      {/* Nested Edit Modal */}
      {isEditing && (
        <div className="absolute inset-0 bg-card z-[2100] flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/90 backdrop-blur-md">
            <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text hover:bg-white/10 transition-colors">
              <ChevronRight className="rotate-180" size={20} />
            </button>
            <h3 className="text-xl font-black uppercase tracking-tighter text-text">Edit Identity</h3>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="w-24 h-24 rounded-3xl bg-electric-blue/10 mx-auto flex items-center justify-center text-electric-blue mb-10 border border-electric-blue/30 shadow-[0_0_30px_rgba(244,114,182,0.15)] relative">
              <User size={48} />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera size={14} />
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-electric-blue tracking-widest uppercase pl-2">Codename</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-text font-bold text-lg focus:border-electric-blue outline-none transition-all focus:bg-white/10 placeholder:text-dim" value={tempProfile.name} onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-electric-blue tracking-widest uppercase pl-2">Height (cm)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-text font-bold text-lg focus:border-electric-blue outline-none transition-all focus:bg-white/10 text-center" value={tempProfile.height} onChange={e => setTempProfile({ ...tempProfile, height: parseFloat(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-electric-blue tracking-widest uppercase pl-2">Weight (kg)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-text font-bold text-lg focus:border-electric-blue outline-none transition-all focus:bg-white/10 text-center" value={tempProfile.weight} onChange={e => setTempProfile({ ...tempProfile, weight: parseFloat(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-dim tracking-widest uppercase pl-2">Activity Level</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-text font-bold focus:border-electric-blue outline-none transition-all appearance-none"
                  value={tempProfile.activityLevel.toString()}
                  onChange={e => setTempProfile({ ...tempProfile, activityLevel: parseFloat(e.target.value) })}
                >
                  <option value="1.2">Sedentary (1.2x)</option>
                  <option value="1.375">Lightly Active (1.375x)</option>
                  <option value="1.55">Moderately Active (1.55x)</option>
                  <option value="1.725">Very Active (1.725x)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-space-gray shrink-0">
            <button className="w-full py-5 rounded-2xl bg-electric-blue text-white font-black tracking-widest text-sm uppercase shadow-[0_10px_30px_rgba(244,114,182,0.3)] active:scale-95 transition-all" onClick={handleSave}>
              Confirm Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { condition, updateCondition } = useRoutine();
  const [activeTab, setActiveTab] = useState('home');
  const [isLocked, setIsLocked] = useState(true);
  const [showCondition, setShowCondition] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = condition.lastRecorded ? new Date(condition.lastRecorded).toDateString() : null;

    if (lastDate !== today) {
      setTimeout(() => setShowCondition(true), 1000);
    }
  }, [condition.lastRecorded]);

  if (isLocked) return <PinLock onUnlock={() => setIsLocked(false)} />;

  return (
    <div className="bg-space-gray min-h-screen text-white pb-24">
      {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
      {activeTab === 'record' && <RecordView />}
      {activeTab === 'report' && <ReportView />}
      {activeTab === 'chat' && <ChatView />}

      {showCondition && <ConditionModal onSave={(data) => { updateCondition(data); setShowCondition(false); }} />}

      <nav className="glass-nav">
        {[
          { id: 'home', icon: <Compass size={28} />, label: 'ORBIT' },
          { id: 'record', icon: <Zap size={28} />, label: 'LOG' },
          { id: 'report', icon: <BarChart3 size={28} />, label: 'DATA' },
          { id: 'chat', icon: <MessageSquare size={28} />, label: 'AI' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`nav-item flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-electric-blue' : 'opacity-40'}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ width: '48px', height: '48px' }} // Accessibility
          >
            {tab.icon}
            <span className="text-[9px] font-black tracking-[0.2em]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
