import React, { createContext, useContext, useState, useEffect } from 'react';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
    // 1. 습관 및 스태킹 데이터
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('pfp_habits');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: '아침 공복 물 한 잔', streak: 0, trigger: '기상하자마자', history: [] },
            { id: 2, name: '심근력 머신 운동', streak: 0, trigger: '퇴근 후 바로', history: [] },
            { id: 3, name: '단백질 위주 식사', streak: 0, trigger: '점심/저녁 식사 시', history: [] }
        ];
    });

    // 2. HealthKit 및 프로필 데이터
    const [profile, setProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('pfp_profile');
            return saved ? JSON.parse(saved) : {
                name: 'Junsemi',
                age: 52,
                height: 178, // 추정치, 인바디 기반
                weight: 77.3,
                gender: '남성',
                level: 1,
                xp: 0,
                nextLevelXp: 100
            };
        } catch (e) {
            console.error("Profile load error", e);
            return { name: 'Junsemi', age: 52, height: 178, weight: 77.3, gender: '남성', level: 1, xp: 0, nextLevelXp: 100 };
        }
    });

    const [healthKit, setHealthKit] = useState({
        steps: 8400,
        sleepHours: 6.5,
        heartRate: 68, // RHR
        lastUpdate: new Date().toISOString()
    });

    // 3. 인바디 & PT 세션 & 식단 (Protein Tracker)
    const [healthData, setHealthData] = useState(() => {
        const saved = localStorage.getItem('pfp_health');
        return saved ? JSON.parse(saved) : {
            weightHistory: [{ date: '2025-11-29', value: 77.3 }],
            inbodyHistory: [
                {
                    date: '2025-11-29',
                    weight: 77.3,
                    fat: 25.3,
                    muscle: 64.4, // 근육(%) -> 64.4%, 골격근량 30.1kg
                    skeletalMuscle: 30.1,
                    bmr: 1429,
                    visceralFat: 14,
                    bodyWater: 51.2,
                    protein: 13.8
                }
            ],
            dietLogs: [],
            badges: []
        };
    });

    // 4. 주간 PT 플랜 및 회복 모드
    const [ptPlan, setPtPlan] = useState(() => {
        const saved = localStorage.getItem('pfp_pt_plan');
        return saved ? JSON.parse(saved) : {
            week: 1,
            currentMode: 'Normal', // Normal, Recovery, Overload, Bridge, Reset
            recommendations: [
                { id: 1, name: '체스트 프레스 (머신)', weight: 20, reps: 10, sets: 3, area: 'Chest' },
                { id: 2, name: '레그 프레스 (머신)', weight: 40, reps: 12, sets: 3, area: 'Legs' },
                { id: 3, name: '랫 풀 다운 (머신)', weight: 25, reps: 10, sets: 3, area: 'Back' }
            ],
            dailyGoals: {
                calories: 1800,
                protein: 100,
                cardio: '20분 유산소'
            },
            fasting: {
                protocol: '16:8',
                startTime: '20:00'
            },
            lastWorkoutDate: null,
            streak: 0
        };
    });

    // 5. 데일리 컨디션 및 플래그 (Junsemi PRD)
    const [condition, setCondition] = useState(() => {
        const saved = localStorage.getItem('pfp_condition');
        return saved ? JSON.parse(saved) : {
            fatigue: 5,
            pain: { back: 0, knee: 0 },
            sleepQuality: 5,
            alcoholFlag: false,
            sodiumFlag: false,
            motivation: 5,
            lastRecorded: null
        };
    });

    // 6. 이월된 운동 (Carryover)
    const [carryover, setCarryover] = useState(() => {
        const saved = localStorage.getItem('pfp_carryover');
        return saved ? JSON.parse(saved) : [];
    });

    // 6. 로컬 저장
    useEffect(() => { localStorage.setItem('pfp_habits', JSON.stringify(habits)); }, [habits]);
    useEffect(() => { localStorage.setItem('pfp_health', JSON.stringify(healthData)); }, [healthData]);
    useEffect(() => { localStorage.setItem('pfp_pt_plan', JSON.stringify(ptPlan)); }, [ptPlan]);
    useEffect(() => { localStorage.setItem('pfp_carryover', JSON.stringify(carryover)); }, [carryover]);
    useEffect(() => { localStorage.setItem('pfp_condition', JSON.stringify(condition)); }, [condition]);

    // --- 핵심 로직: Anti-Gravity 엔진 ---
    const calculateAGScore = () => {
        const latestInBody = healthData.inbodyHistory[0];
        if (!latestInBody) return 0;

        // 체중 대비 근육량 (중력 극복 핵심 지표) + 습관 연속 점수
        const baseScore = (latestInBody.muscle / latestInBody.weight) * 100;
        const habitBonus = habits.reduce((acc, h) => acc + h.streak, 0) * 0.5;

        return Math.min(100, Math.round(baseScore + habitBonus));
    };

    const updateRecoveryStatus = () => {
        let mode = 'Normal';

        // 1. 컨디션 및 플래그 기반 강제 조정
        if (condition.fatigue > 7 || condition.pain.back > 3 || condition.pain.knee > 3 || condition.alcoholFlag || healthKit.sleepHours < 5) {
            mode = 'Recovery';
        }
        // 2. 장기 공백 시 Reset 모드 (PRD F3/준세미 특정)
        else if (ptPlan.lastWorkoutDate) {
            const daysSinceLast = (new Date() - new Date(ptPlan.lastWorkoutDate)) / (24 * 60 * 60 * 1000);
            if (daysSinceLast >= 7) mode = 'Reset'; // 일주일 이상이면 리셋
            else if (daysSinceLast >= 3) mode = 'Bridge'; // 3일 이상이면 브릿지
        }
        // 3. 성실 수행 시 Overload
        else if (ptPlan.streak >= 3) {
            mode = 'Overload';
        }

        if (ptPlan.currentMode !== mode) {
            setPtPlan(prev => ({ ...prev, currentMode: mode }));
        }
    };

    const analysis = React.useMemo(() => {
        const history = [...healthData.inbodyHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = history[0];
        const prev = history[1];
        if (!latest) return null;

        const weightTrend = prev ? (latest.weight > prev.weight ? 'up' : 'down') : 'stable';
        const muscleTrend = prev ? (latest.muscle > prev.muscle ? 'up' : 'down') : 'stable';
        const fatTrend = prev ? (latest.fat > prev.fat ? 'up' : 'down') : 'stable';

        const muscleRatio = (latest.muscle / latest.weight) * 100;

        const visceralFatTrend = latest.visceralFat > 10 ? 'high' : 'stable';
        const waterTrend = latest.bodyWater < 55 ? 'low' : 'stable';

        // Junsemi Specific Interpretation Logic
        if (latest.visceralFat >= 14) {
            interpretation = "내장지방 지수가 매우 높습니다(14). 유산소 운동과 저탄수화물 식단이 최우선입니다!";
            status = "warning";
        } else if (weightTrend === 'up' && muscleTrend === 'up') {
            interpretation = "긍정적 체질량 증가! 에너지가 충만합니다. 고중량에 도전하기 좋은 상태입니다.";
            status = "positive";
        } else if (fatTrend === 'up') {
            interpretation = "체지방률 상승 감지. 전날 염분 과다나 수분 정체일 수 있으니 식단을 점검하세요.";
            status = "caution";
        } else if (waterTrend === 'low') {
            interpretation = "수분율이 낮습니다. 대사 활성화를 위해 물 섭취량을 대폭 늘려주세요!";
            status = "caution";
        } else {
            interpretation = "다이어트 궤도 유지 중. 근육을 보존하며 체지방을 걷어내는 데 집중하세요.";
            status = "normal";
        }

        let recommendedFasting = '16:8';
        if (latest.fat > 25 || latest.visceralFat > 12) recommendedFasting = '18:6';
        else if (latest.skeletalMuscle < 30) recommendedFasting = '14:10';

        const targetProtein = Math.round(latest.weight * 1.6); // 120g+ 목표
        const cardioMinutes = latest.visceralFat > 10 ? 45 : 20;

        const firstDate = new Date(history[history.length - 1].date);
        const diffDays = Math.max(0, Math.ceil((new Date() - firstDate) / (24 * 60 * 60 * 1000)));
        const week = Math.min(12, Math.ceil(diffDays / 7) || 1);

        // Supplements Schedule (Junsemi PRD)
        const supplements = {
            pre: "L-카르니틴 (지방 연소 가속)",
            intra: "충분한 수분 + BCAA",
            post: "유청 단백질 (근육 보호)"
        };

        return {
            recommendedFasting,
            targetProtein,
            cardioMinutes,
            week,
            agScore: calculateAGScore(),
            interpretation,
            status,
            supplements,
            muscleTrend,
            xpProgress: (profile.xp / profile.nextLevelXp) * 100
        };
    }, [healthData, habits, profile.xp]);

    const updatePlanBasedOnAnalysis = () => {
        if (!analysis) return;

        const newGoals = {
            calories: Math.round(profile.weight * 25),
            protein: analysis.targetProtein,
            cardio: `${analysis.cardioMinutes}분 유산소`
        };

        if (JSON.stringify(ptPlan.dailyGoals) !== JSON.stringify(newGoals) || ptPlan.week !== analysis.week) {
            setPtPlan(prev => ({
                ...prev,
                week: analysis.week,
                dailyGoals: newGoals,
                fasting: { ...prev.fasting, protocol: analysis.recommendedFasting }
            }));
        }
    };

    useEffect(() => {
        updateRecoveryStatus();
        updatePlanBasedOnAnalysis();
    }, [analysis, healthKit, profile]);

    // 식단 추가 (음성/AI 렌즈 연동점)
    const addDietEntry = (entry) => {
        setHealthData(prev => ({
            ...prev,
            dietLogs: [{ ...entry, id: Date.now(), date: new Date().toISOString() }, ...prev.dietLogs]
        }));
    };

    const addInBodyData = (data) => {
        // OCR 정합성 체크 (Phase 3 로직 유지 및 강화)
        if (data.weight < 30 || data.muscle < 10 || data.fat < 3) return "비정상적인 수치입니다. 다시 확인해주세요.";

        setHealthData(prev => ({
            ...prev,
            inbodyHistory: [{ ...data, date: new Date().toISOString() }, ...prev.inbodyHistory]
        }));
        return null;
    };

    const gainXp = (amount) => {
        setProfile(prev => {
            let newXp = prev.xp + amount;
            let newLevel = prev.level;
            let newNextLevelXp = prev.nextLevelXp;

            if (newXp >= prev.nextLevelXp) {
                newLevel += 1;
                newXp -= prev.nextLevelXp;
                newNextLevelXp = Math.round(prev.nextLevelXp * 1.2);
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#00E5FF', '#FFFFFF'] });
            }
            return { ...prev, level: newLevel, xp: newXp, nextLevelXp: newNextLevelXp };
        });
    };

    const toggleHabit = (id) => {
        setHabits(prev => prev.map(habit => {
            const today = new Date().toDateString();
            if (habit.id === id && habit.lastCompleted !== today) {
                const newStreak = habit.streak + 1;
                gainXp(20); // 습관 완료 시 XP 획득
                if (newStreak === 3) {
                    setHealthData(curr => ({ ...curr, badges: [...curr.badges, { id: Date.now(), name: `${habit.name} 3일 달성!`, date: today }] }));
                }
                return { ...habit, streak: newStreak, lastCompleted: today };
            }
            return habit;
        }));
    };

    const completeWorkout = () => {
        const today = new Date().toISOString();
        gainXp(50); // 운동 완료 시 XP 획득
        setPtPlan(prev => {
            const shouldIncrease = analysis?.muscleTrend === 'up' && prev.currentMode === 'Normal';
            const intensity = prev.currentMode === 'Reset' ? 0.7 : shouldIncrease ? 1.025 : 1.0;

            const newRecs = prev.recommendations.map(ex => ({
                ...ex,
                weight: parseFloat((ex.weight * intensity).toFixed(1)),
                reps: shouldIncrease ? ex.reps + 1 : ex.reps
            }));

            return {
                ...prev,
                lastWorkoutDate: today,
                recommendations: newRecs,
                streak: prev.streak + 1
            };
        });
    };

    const updateCondition = (newCondition) => {
        setCondition(prev => ({
            ...prev,
            ...newCondition,
            lastRecorded: new Date().toISOString()
        }));
    };

    useEffect(() => { localStorage.setItem('pfp_profile', JSON.stringify(profile)); }, [profile]);

    const updateProfile = (newProfile) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
    };

    return (
        <RoutineContext.Provider value={{
            profile, updateProfile,
            agScore: analysis?.agScore || 0,
            habits, toggleHabit,
            healthKit, setHealthKit,
            healthData, addInBodyData, addDietEntry,
            ptPlan,
            analysis,
            carryover, setCarryover,
            condition, updateCondition,
            completeWorkout
        }}>
            {children}
        </RoutineContext.Provider>
    );
};
