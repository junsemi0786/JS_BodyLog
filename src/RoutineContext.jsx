import React, { createContext, useContext, useState, useEffect } from 'react';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
    // --- 1. NEW ROBUST STATE STRUCTURE (Refactored) ---

    // [User & Goals]
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('ag_user');
        if (saved) return JSON.parse(saved);

        return {
            profile: { id: 'user_1', name: 'Junsemi', age: 29, height: 178, gender: 'M', activityLevel: 1.55, level: 1, xp: 0, nextLevelXp: 100 },
            metrics: { bmr: 1750, tdee: 2400 },
            goals: {
                targetWeight: 72.0,
                dietType: 'HighProtein',
                macrosRatio: { carb: 30, protein: 40, fat: 30 }
            },
            aiCoaching: {
                currentMode: 'OverloadProgress',
                lastUpdated: new Date().toISOString(),
                reason: "초기 설정: 근력 향상 및 체력 증진 모드로 시작합니다."
            }
        };
    });

    // [Diet & Nutrition]
    const [diet, setDiet] = useState(() => {
        const saved = localStorage.getItem('ag_diet');
        if (saved) return JSON.parse(saved);

        // Migration from legacy 'pfp_health' logs
        const legacy = localStorage.getItem('pfp_health');
        const logs = legacy ? JSON.parse(legacy).dietLogs || [] : [];
        return { logs, stats: { todayTotalKcal: 0, todayCarb: 0, todayProtein: 0, todayFat: 0 } };
    });

    // [Activity & Workouts]
    const [activity, setActivity] = useState(() => {
        const saved = localStorage.getItem('ag_activity');
        if (saved) return JSON.parse(saved);
        return {
            workouts: [],
            steps: 8400,
            activeEnergy: 450
        };
    });

    // [Body Metrics]
    const [body, setBody] = useState(() => {
        const saved = localStorage.getItem('ag_body');
        if (saved) return JSON.parse(saved);
        return {
            weightHistory: [{ date: '2025-11-20', value: 77.3 }],
            inbodyHistory: [
                { date: '2025-11-29', weight: 77.3, fat: 25.3, muscleMass: 35.5, skeletalMuscle: 30.1, visceralFat: 14 }
            ],
            bodyPhotos: []
        };
    });

    // [Lifestyle & Habits]
    const [lifestyle, setLifestyle] = useState(() => {
        const saved = localStorage.getItem('ag_lifestyle');
        if (saved) return JSON.parse(saved);

        // Migration from legacy 'pfp_habits' & 'pfp_condition'
        const legacyHabits = localStorage.getItem('pfp_habits');
        const habits = legacyHabits ? JSON.parse(legacyHabits) : [
            { id: 1, name: '아침 공복 물 한 잔', streak: 0, trigger: '기상하자마자' },
            { id: 2, name: '심근력 머신 운동', streak: 0, trigger: '퇴근 후 바로' },
            { id: 3, name: '단백질 위주 식사', streak: 0, trigger: '점심/저녁 식사 시' }
        ];
        const legacyCond = localStorage.getItem('pfp_condition');
        const cond = legacyCond ? JSON.parse(legacyCond) : { lastRecorded: null };

        return {
            fasting: { protocol: '16:8', startTime: '20:00', isActive: true },
            waterRecords: [],
            sleep: { duration: 6.5, quality: 'Good' },
            habits,
            condition: cond // Carry over condition for the daily sync modal
        };
    });

    // [Coaching & Analysis]
    const [coaching, setCoaching] = useState(() => {
        const saved = localStorage.getItem('ag_coaching');
        if (saved) return JSON.parse(saved);
        return {
            aiSchedule: {
                weekStarting: new Date().toISOString(),
                dailyPlans: {} // "YYYY-MM-DD" mapping
            },
            ptPlan: {
                week: 1,
                currentMode: 'Overload', // Default mode for PT Plan
                recommendations: [
                    { id: 1, name: '체스트 프레스', weight: 30, reps: 12, sets: 3, area: 'Chest', intensity: 7 },
                    { id: 2, name: '레그 프레스', weight: 60, reps: 15, sets: 3, area: 'Legs', intensity: 8 },
                    { id: 3, name: '랫 풀 다운', weight: 25, reps: 12, sets: 3, area: 'Back', intensity: 7 }
                ]
            }
        };
    });

    // --- 2. PERSISTENCE ---
    useEffect(() => { localStorage.setItem('ag_user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('ag_diet', JSON.stringify(diet)); }, [diet]);
    useEffect(() => { localStorage.setItem('ag_activity', JSON.stringify(activity)); }, [activity]);
    useEffect(() => { localStorage.setItem('ag_body', JSON.stringify(body)); }, [body]);
    useEffect(() => { localStorage.setItem('ag_lifestyle', JSON.stringify(lifestyle)); }, [lifestyle]);
    useEffect(() => { localStorage.setItem('ag_coaching', JSON.stringify(coaching)); }, [coaching]);

    // --- 3. COMPUTED ANALYSIS ENGINE ---
    const calculateAGScore = () => {
        const latestInBody = body.inbodyHistory[0];
        if (!latestInBody) return 0;
        // Gravity Score: (Muscle Mass / Weight) * 200 (Mock normalization)
        const baseScore = (latestInBody.muscleMass / latestInBody.weight) * 200;
        const habitBonus = lifestyle.habits.reduce((acc, h) => acc + (h.streak || 0), 0) * 0.2;
        return Math.min(100, Math.round(baseScore + habitBonus));
    };

    const analysis = React.useMemo(() => {
        const history = [...body.inbodyHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = history[0];
        const prev = history[1];
        if (!latest) return null;

        // 4 KEY AI COACHING LOGIC
        let newMode = user.aiCoaching.currentMode;
        let reason = user.aiCoaching.reason;
        let status = 'normal';

        if (prev) {
            const muscleDiff = latest.muscleMass - prev.muscleMass;
            const weightDiff = latest.weight - prev.weight;
            const fatDiff = latest.fat - prev.fat;

            // 1. MuscleGuard (근손실 방지)
            if (weightDiff < -0.5 && muscleDiff < -0.2) {
                newMode = 'MuscleGuard';
                reason = "급격한 체중 감량으로 인한 근손실이 감지되었습니다. 단백질 비중을 높이고 저강도 근력 운동으로 전환합니다.";
                status = 'warning';
            }
            // 2. PlateauBreaker (정체기 돌파)
            else if (Math.abs(weightDiff) < 0.1 && Math.abs(fatDiff) < 0.1) {
                newMode = 'PlateauBreaker';
                reason = "7일간 체성분 변화가 미미합니다. 탄수화물 사이클링과 고강도 인터벌 운동으로 대사를 자극합니다.";
                status = 'caution';
            }
            // 3. SkinElasticity (피부 탄력 방지)
            else if (weightDiff < -1.5) {
                newMode = 'SkinElasticity';
                reason = "주당 감량 폭이 너무 큽니다. 피부 탄력 저하를 막기 위해 감량 속도를 조절하고 수분 및 영양 공급을 강화합니다.";
                status = 'warning';
            }
            // 4. OverloadProgress (점진적 과부하)
            else if (muscleDiff >= 0 && weightDiff <= 0) {
                newMode = 'OverloadProgress';
                reason = "안정적인 근육 유지 및 체지방 감소 중입니다. 운동 강도를 높여 점진적 과부하를 적용할 적기입니다.";
                status = 'positive';
            }
        }

        const bmr = Math.round(10 * latest.weight + 6.25 * user.profile.height - 5 * user.profile.age + (user.profile.gender === 'M' ? 5 : -161));
        const tdee = Math.round(bmr * user.profile.activityLevel);

        return {
            currentMode: newMode,
            reason,
            bmr,
            tdee,
            agScore: calculateAGScore(),
            targetProtein: Math.round(latest.weight * (newMode === 'MuscleGuard' ? 2.0 : 1.6)),
            xpProgress: (user.profile.xp / user.profile.nextLevelXp) * 100,
            interpretation: reason,
            status,
            week: coaching.ptPlan.week,
            supplements: {
                pre: newMode === 'OverloadProgress' ? "부스터" : "L-카르니틴",
                intra: "BCAA",
                post: "유청 단백질"
            }
        };
    }, [body.inbodyHistory, user.aiCoaching.currentMode, user.profile]);

    // --- 4. ACTION DISPATCHERS ---
    const addDietEntry = (meal) => {
        // meal: { type, items: [{name, kcal, carb, protein, fat}], photoUrl, isAiAnalyzed }
        const newEntry = {
            id: `diet_${Date.now()}`,
            timestamp: new Date().toISOString(),
            mealType: meal.type,
            items: meal.items || [],
            aiAnalysis: {
                isPhotoAnalyzed: meal.isAiAnalyzed || false,
                photoUrl: meal.photoUrl || null,
                feedback: meal.feedback || "AI가 성분을 분석했습니다."
            }
        };

        setDiet(prev => {
            const newLogs = [newEntry, ...prev.logs];
            const stats = newLogs.reduce((acc, log) => {
                log.items.forEach(item => {
                    acc.todayTotalKcal += item.kcal || 0;
                    acc.todayCarb += item.carb || 0;
                    acc.todayProtein += item.protein || 0;
                    acc.todayFat += item.fat || 0;
                });
                return acc;
            }, { todayTotalKcal: 0, todayCarb: 0, todayProtein: 0, todayFat: 0 });

            return { logs: newLogs, stats };
        });
        gainXp(30);
    };

    const addExerciseEntry = (workout) => {
        // workout: { category, exercises: [{name, sets, reps, weight, intensity}] }
        const newEntry = {
            id: `ex_${Date.now()}`,
            timestamp: new Date().toISOString(),
            category: workout.category,
            exercises: workout.exercises || [],
            totalDurationMin: workout.duration || 30,
            totalBurntKcal: workout.burntKcal || 200
        };

        setActivity(prev => ({
            ...prev,
            workouts: [newEntry, ...prev.workouts],
            activeEnergy: prev.activeEnergy + newEntry.totalBurntKcal
        }));
        gainXp(50);
    };

    const gainXp = (amount) => {
        setUser(prev => {
            const p = { ...prev.profile };
            p.xp += amount;
            if (p.xp >= p.nextLevelXp) {
                p.level += 1;
                p.xp -= p.nextLevelXp;
                p.nextLevelXp = Math.round(p.nextLevelXp * 1.2);
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#00E5FF', '#FFFFFF'] });
            }
            return { ...prev, profile: p };
        });
    };

    const toggleHabit = (id) => {
        setLifestyle(prev => {
            const today = new Date().toDateString();
            const newHabits = prev.habits.map(h => {
                if (h.id === id && h.lastCompleted !== today) {
                    gainXp(20);
                    return { ...h, streak: (h.streak || 0) + 1, lastCompleted: today };
                }
                return h;
            });
            return { ...prev, habits: newHabits };
        });
    };

    const completeWorkout = () => {
        gainXp(50);
        setCoaching(prev => ({
            ...prev,
            ptPlan: { ...prev.ptPlan, lastWorkoutDate: new Date().toISOString(), streak: (prev.ptPlan.streak || 0) + 1 }
        }));
    };

    const updateCondition = (data) => {
        setLifestyle(prev => ({
            ...prev,
            condition: { ...prev.condition, ...data, lastRecorded: new Date().toISOString() }
        }));
    };

    const updateProfile = (newProfile) => {
        setUser(prev => ({ ...prev, profile: { ...prev.profile, ...newProfile } }));
    };

    return (
        <RoutineContext.Provider value={{
            user, diet, activity, body, lifestyle, coaching,
            profile: user.profile, // Shorthand for backward compatibility
            agScore: analysis?.agScore || 0,
            habits: lifestyle.habits,
            healthKit: { steps: activity.steps, sleepHours: lifestyle.sleep.duration, heartRate: 68 }, // Wrapped kit
            healthData: { inbodyHistory: body.inbodyHistory, badges: [] },
            ptPlan: coaching.ptPlan,
            analysis,
            condition: lifestyle.condition,
            carryover: [],
            addDietEntry, addExerciseEntry, toggleHabit, completeWorkout, updateCondition, updateProfile
        }}>
            {children}
        </RoutineContext.Provider>
    );
};
