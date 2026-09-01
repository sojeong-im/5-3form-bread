"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Croissant, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QUESTIONS = [
  { id: 'name', type: 'text', title: '1. 이름을 알려주세요!', placeholder: '이름을 입력해주세요' },
  { id: 'gender', type: 'single', title: '2. 성별을 알려주세요.', options: ['남성', '여성'] },
  { id: 'age', type: 'text', title: '3. 나이를 알려주세요.', placeholder: '예) 20' },
  { id: 'job', type: 'single', title: '4. 현재 하고 있는 일을 알려주세요.', options: ['대학생', '휴학생', '취업준비생', '직장인', '기타'] },
  { id: 'subway', type: 'text', title: '5. 현재 거주하거나 주로 활동하는 곳과 가까운 지하철역을 알려주세요. 🚇', description: '예) 홍대입구역 / 건대입구역 / 신림역', placeholder: '지하철역 이름' },
  { id: 'reason', type: 'textarea', title: '6. 빵실빵실에 지원하게 된 이유는 무엇인가요? 🥐', description: '부담 없이 편하게 적어주세요!' },
  { id: 'favorite', type: 'multiple', title: '7. 평소 어떤 종류의 빵이나 디저트를 가장 좋아하시나요? 🍰', description: '복수 선택 가능', options: ['베이글', '소금빵', '크루아상·페이스트리', '케이크', '쿠키·구움과자', '도넛', '식사빵·샌드위치', '전통빵·동네빵집 스타일', '신상 디저트라면 일단 먹어보는 편', '딱히 가리지 않아요!', '기타'] },
  { id: 'gem', type: 'textarea', title: '8. 나만 알고 있거나 꼭 한번 가보고 싶은 빵집이 있다면 알려주세요! 🗺️', description: '없다면 최근 맛있게 먹었던 빵이나 디저트도 좋아요. (선택)' },
  { id: 'important', type: 'multiple', max: 2, title: '9. 빵집을 고를 때 가장 중요하게 보는 것은 무엇인가요? 👀', description: '최대 2개 선택', options: ['빵이 맛있는 곳', '유명한 핫플', '숨겨진 동네 빵집', '공간이나 인테리어가 예쁜 곳', '사진이 잘 나오는 곳', '가성비가 좋은 곳', '독특한 메뉴가 있는 곳', '웨이팅이 적고 편하게 갈 수 있는 곳'] },
  { id: 'activities', type: 'multiple', title: '10. 빵실빵실에서 해보고 싶은 활동을 골라주세요! 🧁', description: '복수 선택 가능', options: ['유명 베이커리 핫플 투어', '숨은 동네 빵집 탐방', '빵 여러 개 사서 1/N 빵파티', '신상 디저트 도장깨기', '베이킹·쿠킹 클래스', '빵지순례 코스 짜서 돌아보기', '카페·피크닉 등 번개 모임', '멤버 추천 빵집 방문', '기타'] },
  { id: 'schedule', type: 'matrix', title: '11. 활동 가능한 요일과 시간대를 모두 선택해주세요. 📅', description: '요일별 복수 선택 가능', rows: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'], cols: ['오전', '오후', '저녁'] },
  { id: 'area', type: 'multiple', title: '12. 서울에서 활동 가능한 지역을 모두 선택해주세요. 📍', description: '복수 선택 가능', options: ['홍대·연남·망원', '문래·영등포', '성수·건대', '안국·종로·혜화', '강남·잠실', '신림·서울대입구', '마곡·발산', '서울이라면 지역 상관없어요!', '기타'] },
  { id: 'atmosphere', type: 'textarea', title: '13. 빵실빵실에서 어떤 분위기의 모임을 기대하시나요? 🤍', description: '예) 편하게 수다 떨 수 있는 분위기 / 빵 맛집을 열심히 찾아다니는 모임 / 소수로 친해지는 분위기 등' },
  { id: 'consent', type: 'consent', title: '지원 전 확인해주세요 ✓', description: '필수 체크 / 모두 동의해야 제출 가능', options: ['모임별 디저트 비용은 1/N로 부담하는 것을 확인했습니다.', '소규모 모임 특성상 약속한 일정에는 책임감 있게 참여하겠습니다.', '정치·종교·시민단체와 무관하며 다단계·포교·연애 목적의 참여는 제한되는 것을 확인했습니다.', '당일 노쇼 및 타인에게 불편을 주는 행동 시 활동이 제한될 수 있음에 동의합니다.'] },
  { id: 'outro', type: 'outro', title: '지원해주셔서 감사합니다! 🎉', description: '제출이 완료되었습니다. 결과는 개별적으로 안내해 드릴게요.' }
];

export default function Form() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const currentQ = QUESTIONS[step];
  
  const handleNext = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };
  
  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  const isNextDisabled = () => {
    if (currentQ.type === 'outro') return false;
    if (currentQ.id === 'gem') return false; // optional
    const ans = answers[currentQ.id];
    if (currentQ.type === 'consent') {
      return !ans || ans.length !== currentQ.options?.length;
    }
    if (currentQ.type === 'multiple' && currentQ.max) {
       return !ans || ans.length === 0 || ans.length > currentQ.max;
    }
    if (Array.isArray(ans)) return ans.length === 0;
    return !ans || String(ans).trim() === '';
  };

  const renderInput = () => {
    const val = answers[currentQ.id] || '';
    switch (currentQ.type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full text-3xl md:text-5xl bg-white border-4 border-foreground rounded-2xl outline-none p-6 placeholder-foreground/30 text-foreground shadow-[4px_4px_0px_0px_#5D3A20] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            placeholder={currentQ.placeholder}
            value={val}
            onChange={(e) => handleAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isNextDisabled() && handleNext()}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="w-full text-2xl md:text-3xl bg-white border-4 border-foreground rounded-2xl outline-none p-6 placeholder-foreground/30 text-foreground resize-none min-h-[160px] shadow-[4px_4px_0px_0px_#5D3A20] focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
            placeholder="자유롭게 작성해주세요..."
            value={val}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        );
      case 'single':
        return (
          <div className="flex flex-col gap-4">
            {currentQ.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => { handleAnswer(opt); setTimeout(handleNext, 300); }}
                className={cn(
                  "text-left p-5 rounded-2xl border-4 transition-all duration-200 text-xl md:text-2xl shadow-[4px_4px_0px_0px_#5D3A20] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none bg-white",
                  val === opt 
                    ? "border-foreground bg-bread-light text-foreground font-bold" 
                    : "border-foreground hover:bg-bread/10"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case 'multiple':
        const selected = (val as string[]) || [];
        const toggleMulti = (opt: string) => {
          if (selected.includes(opt)) {
            handleAnswer(selected.filter(i => i !== opt));
          } else {
            if (currentQ.max && selected.length >= currentQ.max) return;
            handleAnswer([...selected, opt]);
          }
        };
        return (
          <div className="flex flex-wrap gap-4">
            {currentQ.options?.map((opt) => {
              const isSelected = selected.includes(opt);
              const disabled = !isSelected && currentQ.max && selected.length >= currentQ.max;
              return (
                <button
                  key={opt}
                  onClick={() => toggleMulti(opt)}
                  disabled={disabled as boolean}
                  className={cn(
                    "px-6 py-4 rounded-full border-4 transition-all duration-200 text-xl md:text-2xl bg-white",
                    isSelected 
                      ? "border-foreground bg-bread text-white font-bold shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.2)] shadow-none translate-x-[4px] translate-y-[4px]" 
                      : disabled 
                        ? "border-foreground/30 text-foreground/30 shadow-[4px_4px_0px_0px_rgba(93,58,32,0.3)] cursor-not-allowed"
                        : "border-foreground hover:bg-bread/10 shadow-[4px_4px_0px_0px_#5D3A20] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );
      case 'matrix':
        const matrixVal = (val as Record<string, string[]>) || {};
        const toggleMatrix = (row: string, col: string) => {
          const rowSelected = matrixVal[row] || [];
          const newRowSelected = rowSelected.includes(col)
            ? rowSelected.filter(c => c !== col)
            : [...rowSelected, col];
          handleAnswer({ ...matrixVal, [row]: newRowSelected });
        };
        return (
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[500px] border-collapse bg-white border-4 border-foreground rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#5D3A20]">
              <thead>
                <tr className="bg-bread-light border-b-4 border-foreground">
                  <th></th>
                  {currentQ.cols?.map(col => (
                    <th key={col} className="p-3 text-foreground font-bold text-xl">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentQ.rows?.map((row, idx) => (
                  <tr key={row} className={cn("border-foreground", idx !== (currentQ.rows?.length || 1) - 1 && "border-b-4")}>
                    <td className="p-4 font-bold text-center border-r-4 border-foreground bg-bread-light/50">{row}</td>
                    {currentQ.cols?.map((col, cIdx) => {
                      const isChecked = (matrixVal[row] || []).includes(col);
                      return (
                        <td key={col} className={cn("p-2 text-center", cIdx !== (currentQ.cols?.length || 1) - 1 && "border-r-4 border-foreground")}>
                          <button
                            onClick={() => toggleMatrix(row, col)}
                            className={cn(
                              "w-10 h-10 rounded-xl border-4 mx-auto flex items-center justify-center transition-all",
                              isChecked ? "bg-bread border-foreground text-white shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)]" : "bg-white border-foreground/30 hover:border-foreground"
                            )}
                          >
                            {isChecked && <Check size={20} strokeWidth={4} />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'consent':
        const consentVal = (val as string[]) || [];
        const toggleConsent = (opt: string) => {
          if (consentVal.includes(opt)) {
            handleAnswer(consentVal.filter(i => i !== opt));
          } else {
            handleAnswer([...consentVal, opt]);
          }
        };
        return (
          <div className="flex flex-col gap-4">
             {currentQ.options?.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleConsent(opt)}
                  className={cn(
                    "flex items-center text-left gap-4 p-5 rounded-2xl border-4 transition-all bg-white",
                    consentVal.includes(opt) 
                      ? "border-foreground shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.1)] bg-bread-light/50" 
                      : "border-foreground/30 hover:border-foreground shadow-sm"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border-4 transition-colors",
                    consentVal.includes(opt) ? "bg-bread border-foreground text-white" : "border-foreground/30 bg-white"
                  )}>
                    {consentVal.includes(opt) && <Check size={20} strokeWidth={4} />}
                  </div>
                  <span className={cn("text-xl font-bold", consentVal.includes(opt) ? "text-foreground" : "text-foreground/80")}>{opt}</span>
                </button>
             ))}
          </div>
        );
      case 'outro':
         return (
           <div className="text-center pt-12">
             <div className="w-32 h-32 bg-white border-4 border-foreground rounded-full mx-auto flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#5D3A20] relative">
               <Croissant size={64} className="text-bread-dark animate-bounce relative z-10" />
               <div className="absolute inset-0 bg-bread-light rounded-full scale-50 opacity-50 blur-xl"></div>
             </div>
             <p className="text-3xl font-bold text-foreground">곧 만나서 함께 빵투어 해요! 🥐</p>
             <p className="text-xl text-foreground/80 mt-4">꼼꼼하게 읽어보고 연락드릴게요!</p>
           </div>
         );
    }
  };

  const progress = (step / (QUESTIONS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col selection:bg-bread selection:text-white">
      {/* Header Progress */}
      {step < QUESTIONS.length - 1 && (
        <header className="fixed top-0 left-0 w-full p-6 z-10">
          <div className="max-w-3xl mx-auto flex items-center gap-4 bg-white border-4 border-foreground rounded-2xl p-4 shadow-[4px_4px_0px_0px_#5D3A20]">
            <button 
              onClick={handlePrev} 
              className={cn("p-2 text-foreground hover:bg-bread-light rounded-xl transition-colors", step === 0 && "invisible")}
            >
               <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <div className="flex-1 h-6 bg-bread-light border-4 border-foreground rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-bread"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-foreground text-sm z-10" style={{ mixBlendMode: 'difference', color: '#fff' }}>
                {Math.round(progress)}% 완료
              </div>
            </div>
            <span className="text-xl font-bold text-foreground w-16 text-right">
              {step + 1}/{QUESTIONS.length - 1}
            </span>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto px-6 py-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-bread tracking-wide" style={{ textShadow: '2px 2px 0 #5D3A20, -2px -2px 0 #5D3A20, 2px -2px 0 #5D3A20, -2px 2px 0 #5D3A20, 0 4px 0 #5D3A20' }}>
                {currentQ.title.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </h1>
              {currentQ.description && (
                <p className="text-xl md:text-2xl text-foreground/80 whitespace-pre-line flex items-center gap-2 mt-4 bg-white/50 inline-flex px-4 py-2 rounded-2xl border-2 border-foreground/10 border-dashed">
                  {currentQ.type === 'outro' ? null : <Info size={20} className="shrink-0" />}
                  {currentQ.description}
                </p>
              )}
            </div>

            <div className="min-h-[120px]">
              {renderInput()}
            </div>
            
            {/* Action Buttons for non-outro */}
            {currentQ.type !== 'outro' && currentQ.type !== 'single' && (
              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={cn(
                    "flex items-center gap-2 px-8 py-4 rounded-2xl border-4 text-2xl font-bold transition-all",
                    isNextDisabled()
                      ? "bg-foreground/10 border-foreground/20 text-foreground/30 shadow-[4px_4px_0px_0px_rgba(93,58,32,0.2)] cursor-not-allowed"
                      : "bg-bread border-foreground text-white shadow-[4px_4px_0px_0px_#5D3A20] hover:bg-bread-dark active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                  )}
                >
                  {step === QUESTIONS.length - 2 ? '제출하기' : '다음으로'}
                  {step < QUESTIONS.length - 2 && <ChevronRight size={28} strokeWidth={3} />}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none opacity-[0.03] flex justify-between px-10 -mb-10 text-[150px]">
        🥐 🥨 🥖
      </div>
    </div>
  );
}
