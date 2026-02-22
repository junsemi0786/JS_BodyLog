import React, { useState, useEffect, useRef } from 'react';
import { useRoutine } from './RoutineContext';
import {
  Flame, Clock, CheckCircle2, Activity, Briefcase, Home, Info,
  User, ClipboardList, TrendingUp, Settings, ChevronRight, AlertCircle,
  Camera, Award, Mic, Heart, Moon, Footprints, ArrowUpRight, Compass, Zap, BarChart3, Terminal
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

// --- [HomeView] Anti-Gravity Futuristic Dashboard ---
const HomeView = () => {
  const { profile, agScore, healthKit, ptPlan, analysis, completeWorkout } = useRoutine();

  return (
    <div className="content-wrapper pb-32">
      <header className="mb-8 pt-4 flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white italic">ANTIGRAVITY</h1>
          <p className="text-dim text-xs font-bold uppercase tracking-widest">{profile.name} // Status Active</p>
        </div>
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <User size={24} className="text-electric-blue" />
        </div>
      </header>

      {/* Futuristic Gravity Score Card */}
      <section className="relative mb-10">
        <div className="card glass flex flex-col items-center py-10 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-electric-blue/20 blur-[60px] rounded-full" />

          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
              <circle cx="96" cy="96" r="88" stroke="url(#agGradient)" strokeWidth="12" fill="none" strokeDasharray="552.92" strokeDashoffset={552.92 * (1 - agScore / 100)} strokeLinecap="round" />
              <defs>
                <linearGradient id="agGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#007AFF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-5xl font-black text-white">{agScore}</span>
              <p className="text-[10px] text-dim font-bold tracking-widest uppercase mt-1">Gravity Score</p>
            </div>
          </div>

          {/* Level System UI */}
          <div className="w-full px-10 mb-2">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-electric-blue tracking-widest">LV. {profile.level}</span>
              <span className="text-[10px] font-black text-dim">{profile.xp} / {profile.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-electric-blue to-blue-500 transition-all duration-1000"
                style={{ width: `${analysis?.xpProgress || 0}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-dim text-center px-4 leading-relaxed mt-4">
            현재 중력을 <span className="text-white font-bold">{agScore}%</span> 정복하셨습니다.<br />
            {agScore > 50 ? '행성 탈출 속도에 진입하고 있습니다!' : '지면을 박차고 오를 준비가 되었습니다.'}
          </p>
        </div>
      </section>
      {/* Smart Interpretation Card (Junsemi PRD 5) */}
      {analysis && (
        <section className="mb-10 px-2 animate-in fade-in zoom-in duration-500">
          <div className={`card p-6 border-l-4 ${analysis.status === 'positive' ? 'border-l-emerald-500 bg-emerald-500/5' : analysis.status === 'warning' ? 'border-l-rose-500 bg-rose-500/5' : analysis.status === 'caution' ? 'border-l-amber-500 bg-amber-500/5' : 'border-l-electric-blue'}`}>
            <h4 className="text-[10px] font-black text-dim tracking-[0.2em] uppercase mb-2">Coach Intelligence</h4>
            <p className="text-sm font-black text-white leading-relaxed tracking-tight italic">
              "{analysis.interpretation}"
            </p>
          </div>
        </section>
      )}

      {/* Protocol Analysis Card */}
      {analysis && (
        <section className="mb-10 px-2">
          <div className="card p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={80} className="text-electric-blue" />
            </div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="bg-electric-blue text-space-gray text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase mb-2 inline-block">Analysis Active</span>
                <h3 className="text-3xl font-black italic tracking-tighter mt-2">{analysis.recommendedFasting} PROTOCOL</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-dim tracking-widest uppercase">Program Week</p>
                <p className="text-4xl font-black text-electric-blue italic">{analysis.week}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-dim tracking-widest uppercase">Target Protein</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white italic">{analysis.targetProtein}</span>
                  <span className="text-xs font-bold text-dim uppercase">g</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-black text-dim tracking-widest uppercase">Cardio Goal</p>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl font-black text-white italic">{analysis.cardioMinutes}</span>
                  <span className="text-xs font-bold text-dim uppercase">min</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HealthKit Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'STEPS', val: healthKit.steps, icon: <Footprints size={18} />, color: 'text-green-400' },
          { label: 'SLEEP', val: `${healthKit.sleepHours}h`, icon: <Moon size={18} />, color: 'text-indigo-400' },
          { label: 'BPM', val: healthKit.heartRate, icon: <Heart size={18} />, color: 'text-rose-400' }
        ].map((stat, i) => (
          <div key={i} className="card p-4 flex flex-col items-center gap-2">
            <span className={`${stat.color} mb-1 opacity-80`}>{stat.icon}</span>
            <span className="text-sm font-black text-white tracking-tight">{stat.val}</span>
            <span className="text-[9px] text-dim font-bold tracking-tighter uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Supplement Timeline (Junsemi PRD 4) */}
      {analysis?.supplements && (
        <section className="mb-12 px-2 animate-in slide-in-from-right duration-700">
          <h3 className="text-[10px] font-black text-dim tracking-[0.3em] mb-4 uppercase pl-2">Supplement Lifecycle</h3>
          <div className="flex flex-col gap-3">
            <div className="card p-4 flex items-center gap-4 bg-white/[0.02] border-white/5">
              <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue font-black text-[10px]">PRE</div>
              <p className="text-xs font-bold text-white tracking-tight">{analysis.supplements.pre}</p>
            </div>
            <div className="card p-4 flex items-center gap-4 bg-white/[0.02] border-white/5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-[10px]">INTRA</div>
              <p className="text-xs font-bold text-white tracking-tight">{analysis.supplements.intra}</p>
            </div>
            <div className="card p-4 flex items-center gap-4 bg-white/[0.02] border-white/5 border-l-2 border-l-electric-blue">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-[10px]">POST</div>
              <p className="text-xs font-bold text-white tracking-tight">{analysis.supplements.post}</p>
            </div>
          </div>
        </section>
      )}

      {/* AI PT Prescription (PRD F3) */}
      <section className="mb-12 px-2">
        <h3 className="text-[10px] font-black text-dim tracking-[0.3em] mb-4 uppercase pl-2 flex justify-between items-center">
          Today's Routine
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${ptPlan.currentMode === 'Reset' ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]' : ptPlan.currentMode === 'Recovery' ? 'bg-rose-500 text-white' : ptPlan.currentMode === 'Overload' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-electric-blue text-black'}`}>
            {ptPlan.currentMode.toUpperCase()} MODE
          </span>
        </h3>
        <div className="space-y-4">
          {ptPlan.recommendations.map((ex, i) => (
            <div key={i} className="card p-6 flex justify-between items-center border-white/5 hover:border-electric-blue/30 transition-all duration-300">
              <div className="flex-1">
                <p className="text-[9px] text-electric-blue font-black tracking-widest uppercase mb-1 opacity-60">#{ex.area}</p>
                <h4 className="font-black text-white text-lg tracking-tight leading-none mb-2">{ex.name}</h4>
                <div className="flex gap-3">
                  <span className="text-xs text-dim font-bold">{ex.sets} SETS</span>
                  <span className="text-xs text-dim font-bold">{ex.reps} REPS</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-electric-blue italic">{ex.weight}</span>
                <span className="text-[10px] text-dim font-bold ml-1 uppercase">kg</span>
              </div>
            </div>
          ))}
          <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black tracking-widest active:scale-95 transition-all text-base mt-4" onClick={completeWorkout}>
            COMPLETE SESSION
          </button>
        </div>
      </section>

      {/* Emergency Strategy Section (Legacy Data Highlight) */}
      <section className="mb-20 px-2">
        <h3 className="text-xs font-black text-dim tracking-[0.2em] mb-4 uppercase pl-2 flex items-center gap-2">
          <AlertCircle size={14} className="text-rose-500" /> Emergency Protocols
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="card p-4 bg-rose-500/5 border-rose-500/20 active:scale-95 transition-all text-left">
            <Flame size={18} className="text-rose-500 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">폭식했을 때</h4>
            <p className="text-[9px] text-dim leading-tight">18시간 단식 전환 및 고강도 공복 유산소 시행</p>
          </button>
          <button className="card p-4 bg-amber-500/5 border-amber-500/20 active:scale-95 transition-all text-left">
            <Activity size={18} className="text-amber-500 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">정체기일 때</h4>
            <p className="text-[9px] text-dim leading-tight">탄수화물 사이클링 및 치팅 데이 처방</p>
          </button>
        </div>
      </section>
    </div>
  );
};

// --- [RecordView] Minimalism Logging ---
const RecordView = () => {
  const { habits, toggleHabit, addDietEntry, carryover } = useRoutine();

  const handleVoiceInput = () => {
    const text = window.prompt("식단 내용을 입력하세요 (예: 닭가슴살 샐러드, 현미밥)");
    if (text) {
      // Fake AI Processing Animation Mock
      const processing = window.confirm(`AI 분석 중: "${text}"\n\n- 칼로리: 350kcal\n- 단백질: 28g\n- 내장지방 영향: 낮음\n\n기록할까요?`);
      if (processing) {
        addDietEntry({ name: text, protein: 28, kcal: 350 });
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.7 }, colors: ['#00E5FF'] });
      }
    }
  };

  const handleCameraInput = () => {
    const mockAnalysis = window.confirm("AI Vision 렌즈 기동...\n\n사진에서 '훈제오리 샐러드'를 감지했습니다.\n- 예상 단백질: 22g\n- 예상 지방: 14g\n\n기록에 추가할까요?");
    if (mockAnalysis) {
      addDietEntry({ name: '훈제오리 샐러드', protein: 22, kcal: 280 });
      confetti({ particleCount: 40, colors: ['#00E5FF'] });
    }
  };

  return (
    <div className="content-wrapper">
      <h2 className="text-2xl font-black mb-8 mt-4 uppercase tracking-tighter">Mission Log</h2>

      <div className="flex gap-4 mb-10 px-2 mt-4">
        <button className="flex-1 py-12 rounded-[28px] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group" onClick={handleCameraInput}>
          <Camera size={32} className="text-electric-blue group-active:text-white" />
          <span className="text-xs font-black tracking-widest uppercase text-dim">AI LENS</span>
        </button>
        <button className="flex-1 py-12 rounded-[28px] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group" onClick={handleVoiceInput}>
          <Mic size={32} className="text-electric-blue group-active:text-white" />
          <span className="text-xs font-black tracking-widest uppercase text-dim">Voice Log</span>
        </button>
      </div>

      <div className="space-y-4 px-2">
        <h3 className="text-[10px] font-black text-dim tracking-widest uppercase pl-2 mb-2">Daily Protein Log (PRD F4)</h3>
        {['점심 식사', '운동 직후', '저녁 식사'].map((meal, idx) => (
          <div key={idx} className="card p-6 flex justify-between items-center group cursor-pointer active:bg-white/5">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ClipboardList size={20} className="text-electric-blue opacity-60" />
              </div>
              <div>
                <h4 className="font-black text-white text-lg tracking-tight">{meal}</h4>
                <p className="text-[10px] text-dim font-bold uppercase tracking-widest">Recommended: 30g+</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg border-2 border-white/20 flex items-center justify-center group-active:border-electric-blue">
              <CheckCircle2 size={16} className="text-electric-blue opacity-0 group-active:opacity-100" />
            </div>
          </div>
        ))}

        <h3 className="text-[10px] font-black text-dim tracking-widest uppercase pl-4 mt-12 mb-2">Habit Stacking</h3>
        {habits.map(habit => (
          <div key={habit.id} className="card p-5 flex justify-between items-center pointer-events-auto" onClick={() => toggleHabit(habit.id)}>
            <div style={{ flex: 1 }}>
              <p className="text-[9px] text-electric-blue font-bold tracking-widest mb-1 italic">#{habit.trigger}</p>
              <h4 className="font-bold text-white text-base">{habit.name}</h4>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-white">{habit.streak}</span>
              <span className="text-[10px] text-dim ml-1">Days</span>
            </div>
          </div>
        ))}

        {/* Carryover Items */}
        {carryover.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-[10px] font-black text-rose-400 tracking-widest uppercase pl-2 mb-2 italic">Carryover Missions</h3>
            {carryover.map((item, i) => (
              <div key={i} className="card p-5 border-rose-500/20 bg-rose-500/5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-base">{item.name}</h4>
                  <p className="text-[9px] text-rose-400 font-bold uppercase tracking-tighter">이월된 항목</p>
                </div>
                <CheckCircle2 size={24} className="text-rose-500 opacity-40" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- [ReportView] Visual SVG Charts ---
const ReportView = () => {
  const { healthData, agScore } = useRoutine();
  const weightPoints = healthData.inbodyHistory.map((d, i) => `${i * 100},${150 - (d.weight - 70) * 10}`).join(' ');

  return (
    <div className="content-wrapper">
      <h2 className="text-2xl font-black mb-8 mt-4 uppercase tracking-tighter">Analytics</h2>

      <div className="card glass mb-6 p-6">
        <div className="flex justify-between items-end mb-6">
          <h4 className="text-sm font-bold text-white italic">InBody Composition</h4>
          <span className="text-[10px] text-dim font-black uppercase tracking-widest">Latest Sync</span>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Skeletal Muscle', val: healthData.inbodyHistory[0]?.skeletalMuscle, target: 35, unit: 'kg', color: 'bg-emerald-500' },
            { label: 'Body Fat', val: healthData.inbodyHistory[0]?.fat, target: 15, unit: '%', color: 'bg-rose-500' },
            { label: 'Visceral Fat', val: healthData.inbodyHistory[0]?.visceralFat, target: 8, unit: 'Level', color: 'bg-amber-500' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-dim uppercase tracking-tighter">{item.label}</span>
                <span className="text-sm font-black text-white italic">{item.val} <span className="text-[10px] text-dim not-italic uppercase">{item.unit}</span></span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000`}
                  style={{ width: `${Math.min(100, (item.val / (item.target * 2)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card glass mb-6 p-6">
        <div className="flex justify-between items-end mb-6">
          <h4 className="text-sm font-bold text-white">Weight Trend</h4>
          <span className="text-[10px] text-dim font-bold">LATEST: {healthData.inbodyHistory[0]?.weight}kg</span>
        </div>
        <div className="h-32 bg-white/2 rounded-2xl p-4 overflow-hidden">
          <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <polyline fill="none" stroke="#00E5FF" strokeWidth="4" points={weightPoints} strokeLinecap="round" strokeLinejoin="round" />
            {healthData.inbodyHistory.map((d, i) => (
              <circle key={i} cx={i * 100} cy={150 - (d.weight - 70) * 10} r="5" fill="#00E5FF" />
            ))}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-[10px] text-dim font-bold uppercase mb-1">Lifetime Badges</p>
          <p className="text-2xl font-black text-white">{healthData.badges.length}</p>
        </div>
        <div className="card p-5 border-electric-blue/20">
          <p className="text-[10px] text-dim font-bold uppercase mb-1">Rank Status</p>
          <p className="text-sm font-black text-electric-blue uppercase">{agScore > 60 ? 'Stellar Voyager' : 'Ground Zero'}</p>
        </div>
      </div>
    </div>
  );
};

// --- [SettingsView] iOS Style Settings + Editable Profile ---
const SettingsView = () => {
  const { profile, updateProfile } = useRoutine();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    updateProfile(tempProfile);
    setIsEditing(false);
    confetti({ particleCount: 50, colors: ['#00E5FF'] });
  };

  return (
    <div className="content-wrapper">
      <h2 className="text-2xl font-black mb-8 mt-4 uppercase tracking-tighter">System</h2>

      <div className="card p-0 overflow-hidden mb-6" onClick={() => { setTempProfile(profile); setIsEditing(true); }}>
        <div className="flex items-center gap-4 p-5 cursor-pointer active:bg-white/5 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-electric-blue/10 flex items-center justify-center text-electric-blue">
            <User />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-white">Profile Identity</div>
            <div className="text-xs text-dim">{profile.name} · {profile.height}cm · {profile.weight}kg</div>
          </div>
          <ChevronRight className="text-dim" size={18} />
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-10">
        {[
          { icon: <Heart size={20} />, label: 'HealthKit Sync', sub: 'Biometric link established' },
          { icon: <Settings size={20} />, label: 'Preference', sub: 'Interface & Notifications' }
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-4 p-5 ${i === 0 ? 'border-b border-white/5' : ''}`}>
            <div className="text-white opacity-60">{item.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">{item.label}</div>
              <div className="text-[11px] text-dim font-medium">{item.sub}</div>
            </div>
            <ChevronRight className="text-dim/50" size={18} />
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[2000] flex flex-col justify-end">
          <div className="bg-[#1E1E1E] rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
            <h3 className="text-xl font-black mb-8">EDIT IDENTITY</h3>
            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-dim tracking-widest uppercase pl-1">Identity Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-electric-blue outline-none transition-all" value={tempProfile.name} onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-dim tracking-widest uppercase pl-1">Height (cm)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-electric-blue outline-none transition-all" value={tempProfile.height} onChange={e => setTempProfile({ ...tempProfile, height: parseFloat(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-dim tracking-widest uppercase pl-1">Weight (kg)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-electric-blue outline-none transition-all" value={tempProfile.weight} onChange={e => setTempProfile({ ...tempProfile, weight: parseFloat(e.target.value) })} />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-4 text-dim font-bold" onClick={() => setIsEditing(false)}>CANCEL</button>
              <button className="flex-[2] btn-primary" onClick={handleSave}>SAVE PROTOCOL</button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] font-black text-dim tracking-[0.4em] uppercase opacity-40">Anti-Gravity // V4.5.0</p>
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
    if (condition.lastRecorded !== today) {
      setTimeout(() => setShowCondition(true), 1000);
    }
  }, [condition.lastRecorded]);

  if (isLocked) return <PinLock onUnlock={() => setIsLocked(false)} />;

  return (
    <div className="bg-space-gray min-h-screen text-white pb-24">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'record' && <RecordView />}
      {activeTab === 'report' && <ReportView />}
      {activeTab === 'settings' && <SettingsView />}

      {showCondition && <ConditionModal onSave={(data) => { updateCondition(data); setShowCondition(false); }} />}

      <nav className="glass-nav">
        {[
          { id: 'home', icon: <Compass size={28} />, label: 'ORBIT' },
          { id: 'record', icon: <Zap size={28} />, label: 'LOG' },
          { id: 'report', icon: <BarChart3 size={28} />, label: 'DATA' },
          { id: 'settings', icon: <Terminal size={28} />, label: 'CMD' }
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
