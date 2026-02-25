import React, { createContext, useContext, useState, useEffect } from 'react';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
    // --- 1. NEW ROBUST STATE STRUCTURE (Refactored) ---

    // [User & Goals]
    const [user, setUser] = useState(() => {
        const defaultUser = {
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

        const saved = localStorage.getItem('ag_user');
        if (!saved) return defaultUser;

        const parsed = JSON.parse(saved);
        // Simple merge
        return {
            ...defaultUser,
            ...parsed,
            profile: { ...defaultUser.profile, ...parsed.profile },
            goals: { ...defaultUser.goals, ...parsed.goals },
            aiCoaching: { ...defaultUser.aiCoaching, ...parsed.aiCoaching }
        };
    });

    // [Diet & Nutrition]
    const [diet, setDiet] = useState(() => {
        const saved = localStorage.getItem('ag_diet');
        if (saved) return JSON.parse(saved);

        // Dummy Data explicitly injected to prevent NaN and show UI functionality (User request)
        return {
            logs: [
                { id: '1', items: [{ name: '연어 포케 샐러드', protein: 32, kcal: 450 }] },
                { id: '2', items: [{ name: '그릭 요거트 & 오트밀', protein: 18, kcal: 320 }] }
            ],
            stats: {
                todayTotalKcal: 1250,
                todayCarb: 110,
                todayProtein: 85,
                todayFat: 45
            }
        };
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
            inbodyHistory: [
                { date: '2023-11-01', weight: 70.8, muscleMass: 32.5, fat: 12.8, visceralFat: 6 },
                { date: '2023-10-15', weight: 71.5, muscleMass: 32.2, fat: 13.5, visceralFat: 7 },
                { date: '2023-10-01', weight: 72.1, muscleMass: 31.8, fat: 14.1, visceralFat: 7 },
                { date: '2023-09-15', weight: 72.8, muscleMass: 31.5, fat: 14.9, visceralFat: 8 },
                { date: '2023-09-01', weight: 73.5, muscleMass: 31.0, fat: 15.8, visceralFat: 8 }
            ],
            bodyPhotos: []
        };
    });

    // [Lifestyle & Habits]
    const [lifestyle, setLifestyle] = useState(() => {
        const legacyHabits = localStorage.getItem('pfp_habits');
        const defaultHabits = legacyHabits ? JSON.parse(legacyHabits) : [
            { id: 1, name: '아침 공복 물 한 잔', streak: 0, trigger: '기상하자마자' },
            { id: 2, name: '심근력 머신 운동', streak: 0, trigger: '퇴근 후 바로' },
            { id: 3, name: '단백질 위주 식사', streak: 0, trigger: '점심/저녁 식사 시' }
        ];

        const defaultLifestyle = {
            fasting: { protocol: '16:8', startTime: '20:00', isActive: true },
            waterRecords: [],
            water: { intake: 4, target: 8 },
            supplements: [
                { id: 1, name: '멀티 비타민', amount: '1 Tablet', lastCompleted: null },
                { id: 2, name: '오메가3', amount: '2 Capsules', lastCompleted: null },
                { id: 3, name: '유산균', amount: '1 Sachet', lastCompleted: null }
            ],
            sleep: { duration: 6.5, quality: 'Good' },
            habits: defaultHabits,
            condition: { lastRecorded: null }
        };

        const saved = localStorage.getItem('ag_lifestyle');
        if (!saved) return defaultLifestyle;

        const parsed = JSON.parse(saved);
        return {
            ...defaultLifestyle,
            ...parsed,
            water: parsed.water || defaultLifestyle.water,
            supplements: parsed.supplements || defaultLifestyle.supplements,
            fasting: { ...defaultLifestyle.fasting, ...parsed.fasting }
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
                    { id: 1, name: '체스트 프레스', weight: 30, reps: 12, sets: 3, area: 'Chest', intensity: 7, completedSets: [] },
                    { id: 2, name: '레그 프레스', weight: 60, reps: 15, sets: 3, area: 'Legs', intensity: 8, completedSets: [] },
                    { id: 3, name: '랫 풀 다운', weight: 25, reps: 12, sets: 3, area: 'Back', intensity: 7, completedSets: [] }
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
        let bodyInsightTitle = '안정적인 체성분 유지 중';
        let bodyInsightText = '현재 골격근량과 체지방량이 균형을 이루고 있습니다. 지금의 루틴을 유지하세요.';

        // BMI Calculation
        const heightM = user.profile.height / 100;
        const bmi = parseFloat((latest.weight / (heightM * heightM)).toFixed(1));

        let bmiStatus = 'Normal';
        if (bmi < 18.5) bmiStatus = 'Underweight';
        else if (bmi >= 23 && bmi < 25) bmiStatus = 'Overweight';
        else if (bmi >= 25 && bmi < 30) bmiStatus = 'Obese I';
        else if (bmi >= 30) bmiStatus = 'Obese II';

        if (prev) {
            const muscleDiff = latest.muscleMass - prev.muscleMass;
            const weightDiff = latest.weight - prev.weight;
            const fatDiff = latest.fat - prev.fat;

            // Insight logic based on changes
            if (fatDiff > 0.5 && muscleDiff <= 0) {
                bodyInsightTitle = '체지방 주의 요망';
                bodyInsightText = `골격근량 변화 없이 체지방이 ${fatDiff.toFixed(1)}kg 증가했습니다. 유산소 비율을 높이세요.`;
            } else if (muscleDiff > 0.3 && fatDiff < 0) {
                bodyInsightTitle = '이상적인 근성장';
                bodyInsightText = `근육량이 ${muscleDiff.toFixed(1)}kg 증가하고 체지방이 감소했습니다. 완벽한 린매스업 상태입니다!`;
            } else if (weightDiff < -1.5 && muscleDiff < -0.5) {
                bodyInsightTitle = '경고: 근손실 발생';
                bodyInsightText = `체중 감량 속도가 너무 빠릅니다. 근육이 ${Math.abs(muscleDiff).toFixed(1)}kg 감소했으니 단백질 섭취를 20% 늘려주세요.`;
            }

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

        // Calorie & Macro Status
        const bmr = latest.weight * 24; // Simplified BMR
        const tdee = Math.round(bmr * user.profile.activityLevel);
        const intake = diet.stats.todayTotalKcal;
        const remainingKcal = Math.max(0, tdee - intake);

        const targetMacros = {
            carb: Math.round((tdee * user.goals.macrosRatio.carb) / 100 / 4),
            protein: Math.round((tdee * user.goals.macrosRatio.protein) / 100 / 4),
            fat: Math.round((tdee * user.goals.macrosRatio.fat) / 100 / 9)
        };

        const currentMacros = {
            carb: diet.stats.todayCarb,
            protein: diet.stats.todayProtein,
            fat: diet.stats.todayFat
        };

        return {
            currentMode: newMode,
            reason,
            bmr,
            tdee,
            intake,
            remainingKcal,
            targetMacros,
            currentMacros,
            bmi,
            bmiStatus,
            bodyInsight: { title: bodyInsightTitle, text: bodyInsightText },
            agScore: calculateAGScore(),
            targetProtein: targetMacros.protein,
            xpProgress: (user.profile.xp / user.profile.nextLevelXp) * 100,
            interpretation: reason,
            status,
            week: coaching.ptPlan.week,
            supplements: {
                pre: newMode === 'OverloadProgress' ? "부스터" : "L-카르니틴",
                intra: "BCAA",
                post: "유청 단백질"
            },
            fasting: {
                protocol: "16:8",
                hoursPassed: 14,
                totalHours: 16,
                state: "Fat Burning",
                timer: "02:14:35"
            }
        };
    }, [body.inbodyHistory, user.aiCoaching.currentMode, user.profile, diet.stats, coaching.ptPlan, lifestyle.habits]);

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
            const today = new Date().toDateString();
            const newLogs = [newEntry, ...prev.logs];

            // Only count logs from today for current status
            const stats = newLogs.filter(log => new Date(log.timestamp).toDateString() === today)
                .reduce((acc, log) => {
                    log.items.forEach(item => {
                        const kcal = item.kcal || (item.protein * 4 + item.carb * 4 + item.fat * 9) || 0;
                        acc.todayTotalKcal += kcal;
                        acc.todayCarb += item.carb || Math.round((kcal * 0.4) / 4);
                        acc.todayProtein += item.protein || Math.round((kcal * 0.3) / 4);
                        acc.todayFat += item.fat || Math.round((kcal * 0.3) / 9);
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

        setActivity(prev => {
            const today = new Date().toDateString();
            const newWorkouts = [newEntry, ...prev.workouts];

            // Re-calculate activeEnergy based on today's workouts only
            const todayEnergy = newWorkouts
                .filter(w => new Date(w.timestamp).toDateString() === today)
                .reduce((acc, w) => acc + (w.totalBurntKcal || 0), 0);

            return {
                ...prev,
                workouts: newWorkouts,
                activeEnergy: todayEnergy
            };
        });
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

    const toggleSet = (exerciseId, setIndex) => {
        setCoaching(prev => {
            const newRecommendations = prev.ptPlan.recommendations.map(ex => {
                if (ex.id === exerciseId) {
                    const completed = [...(ex.completedSets || [])];
                    if (completed.includes(setIndex)) {
                        completed.splice(completed.indexOf(setIndex), 1);
                    } else {
                        completed.push(setIndex);
                        gainXp(5); // Small reward per set
                    }
                    return { ...ex, completedSets: completed };
                }
                return ex;
            });
            return { ...prev, ptPlan: { ...prev.ptPlan, recommendations: newRecommendations } };
        });
    };

    const completeWorkout = () => {
        const totalCompletedSets = coaching.ptPlan.recommendations.reduce((acc, ex) => acc + (ex.completedSets?.length || 0), 0);

        if (totalCompletedSets > 0) {
            const totalVolume = coaching.ptPlan.recommendations.reduce((acc, ex) => acc + ((ex.completedSets?.length || 0) * ex.weight * ex.reps), 0);
            const durationMin = totalCompletedSets * 3; // roughly 3 mins per set incl. rest
            const burntKcal = durationMin * 6; // roughly 6 kcal/min for weight training

            addExerciseEntry({
                category: "Weight Training",
                duration: durationMin,
                burntKcal: burntKcal,
                exercises: coaching.ptPlan.recommendations.filter(ex => ex.completedSets?.length > 0).map(ex => ({
                    name: ex.name,
                    setsCompleted: ex.completedSets.length,
                    volume: ex.completedSets.length * ex.weight * ex.reps
                }))
            });
            gainXp(50);

            // Reset sets for next session
            setCoaching(prev => ({
                ...prev,
                ptPlan: {
                    ...prev.ptPlan,
                    lastWorkoutDate: new Date().toISOString(),
                    streak: (prev.ptPlan.streak || 0) + 1,
                    recommendations: prev.ptPlan.recommendations.map(ex => ({ ...ex, completedSets: [] }))
                }
            }));

            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#00E5FF', '#FFFFFF'] });
        }
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

    const addInbodyEntry = (newEntry) => {
        setHealthData(prev => ({
            ...prev,
            inbodyHistory: [{
                id: Date.now(),
                date: new Date().toISOString(),
                ...newEntry
            }, ...prev.inbodyHistory]
        }));
        gainXp(100);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: ['#00E5FF', '#FF00E5'] });
    };

    const trackWater = () => {
        setLifestyle(prev => {
            if (prev.water.intake >= prev.water.target) return prev;
            gainXp(10);
            return {
                ...prev,
                water: { ...prev.water, intake: prev.water.intake + 1 }
            };
        });
    };

    const toggleSupplement = (id) => {
        setLifestyle(prev => {
            const today = new Date().toDateString();
            const newSupplements = prev.supplements.map(sup => {
                if (sup.id === id) {
                    const isCompleted = sup.lastCompleted === today;
                    if (!isCompleted) gainXp(15);
                    return { ...sup, lastCompleted: isCompleted ? null : today };
                }
                return sup;
            });
            return { ...prev, supplements: newSupplements };
        });
    };

    const removeDietEntry = (id) => {
        setDiet(prev => {
            const today = new Date().toDateString();
            const newLogs = prev.logs.filter(log => log.id !== id);

            const stats = newLogs.filter(log => new Date(log.timestamp).toDateString() === today)
                .reduce((acc, log) => {
                    log.items.forEach(item => {
                        const kcal = item.kcal || (item.protein * 4 + item.carb * 4 + item.fat * 9) || 0;
                        acc.todayTotalKcal += kcal;
                        acc.todayCarb += item.carb || Math.round((kcal * 0.4) / 4);
                        acc.todayProtein += item.protein || Math.round((kcal * 0.3) / 4);
                        acc.todayFat += item.fat || Math.round((kcal * 0.3) / 9);
                    });
                    return acc;
                }, { todayTotalKcal: 0, todayCarb: 0, todayProtein: 0, todayFat: 0 });

            return { logs: newLogs, stats };
        });
    };

    const removeExerciseEntry = (id) => {
        setActivity(prev => {
            const today = new Date().toDateString();
            const newWorkouts = prev.workouts.filter(w => w.id !== id);
            const todayEnergy = newWorkouts
                .filter(w => new Date(w.timestamp).toDateString() === today)
                .reduce((acc, w) => acc + (w.totalBurntKcal || 0), 0);

            return { ...prev, workouts: newWorkouts, activeEnergy: todayEnergy };
        });
    };

    return (
        <RoutineContext.Provider value={{
            user, diet, activity, body, lifestyle, coaching,
            profile: user.profile, // Shorthand for backward compatibility
            agScore: analysis?.agScore || 0,
            habits: lifestyle.habits,
            healthKit: { steps: activity.steps, sleepHours: lifestyle.sleep.duration, heartRate: 68 }, // Wrapped kit
            healthData, analysis, ptPlan: coaching.ptPlan,
            condition: lifestyle.condition,
            carryover: [],
            addDietEntry, removeDietEntry, addExerciseEntry, removeExerciseEntry,
            addInbodyEntry, trackWater, toggleSupplement, updateCondition, updateProfile,
            toggleSet, completeWorkout, gainXp, toggleHabit
        }}>
            {children}
        </RoutineContext.Provider>
    );
};
