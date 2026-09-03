"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lock, FileText, ArrowLeft, RefreshCw, ChevronDown, ChevronUp, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === "00347") {
      setIsAuthorized(true);
      fetchApplications();
    } else {
      alert("비밀번호가 일치하지 않습니다!");
      setPassword("");
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("데이터를 불러오는데 실패했습니다. 파이어베이스 권한을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF7EC] p-6 selection:bg-bread selection:text-white">
        <div className="bg-white border-4 border-foreground rounded-[2rem] p-10 max-w-sm w-full shadow-[8px_8px_0_0_#5D3A20] text-center">
          <div className="w-20 h-20 bg-bread-light rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-foreground shadow-[4px_4px_0_0_#5D3A20]">
            <Lock size={40} className="text-foreground" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-bread mb-2" style={{ textShadow: '2px 2px 0 #5D3A20, -2px -2px 0 #5D3A20, 2px -2px 0 #5D3A20, -2px 2px 0 #5D3A20, 0 4px 0 #5D3A20' }}>
            관리자 로그인
          </h1>
          <p className="text-foreground/70 mb-8 font-bold text-lg">빵실빵실 회장단 전용 페이지입니다.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FDF7EC] border-4 border-foreground rounded-2xl p-4 text-2xl outline-none focus:bg-white transition-colors focus:border-bread shadow-inner tracking-widest text-center"
              placeholder="비밀번호"
            />
            <button 
              type="submit"
              className="w-full py-4 bg-bread border-4 border-foreground text-white rounded-2xl font-bold text-xl shadow-[4px_4px_0_0_#5D3A20] active:translate-y-[4px] active:shadow-none transition-all mt-2"
            >
              입장하기
            </button>
          </form>
          
          <div className="mt-8">
             <a href="/" className="text-foreground/50 hover:text-foreground font-bold flex items-center justify-center gap-2">
               <ArrowLeft size={20} /> 메인으로 돌아가기
             </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF7EC] p-6 pb-32 selection:bg-bread selection:text-white">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-10 pt-4">
        <div className="flex items-center gap-4">
          <a 
            href="/"
            className="flex items-center justify-center w-14 h-14 bg-white border-4 border-foreground text-foreground rounded-full shadow-[4px_4px_0_0_#5D3A20] hover:bg-bread-light active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <ArrowLeft size={28} strokeWidth={3} />
          </a>
          <h2 
            className="text-4xl md:text-5xl font-bold text-bread drop-shadow-sm"
            style={{ textShadow: '2px 2px 0 #5D3A20, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff' }}
          >
            지원서 보관함 🍞
          </h2>
        </div>
        
        <button 
          onClick={fetchApplications}
          className="flex items-center gap-2 bg-white border-4 border-foreground text-foreground px-6 py-3 rounded-full font-bold shadow-[4px_4px_0_0_#5D3A20] hover:bg-bread-light active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <RefreshCw size={24} strokeWidth={3} className={cn(loading && "animate-spin")} />
          <span className="hidden md:inline">새로고침</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="bg-white border-4 border-foreground rounded-[2rem] p-6 md:p-10 shadow-[8px_8px_0_0_#5D3A20] min-h-[500px]">
          <div className="flex justify-between items-center mb-8 border-b-4 border-foreground pb-6 border-dashed">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={28} className="text-bread-dark" />
              총 <span className="text-bread">{applications.length}</span>명의 예비 부원이 기다리고 있어요!
            </h3>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
               <RefreshCw size={48} className="animate-spin mb-4" />
               <p className="text-xl font-bold">지원서를 불러오는 중입니다...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 text-foreground/50">
               <User size={64} className="mx-auto mb-4 opacity-50" />
               <p className="text-2xl font-bold">아직 접수된 지원서가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {applications.map((app, index) => {
                const isExpanded = expandedId === app.id;
                
                // Format matrix schedule if it exists
                const renderSchedule = (schedule: any) => {
                  if (!schedule) return "없음";
                  const days = Object.keys(schedule);
                  if (days.length === 0) return "없음";
                  return days.map(day => `${day}(${schedule[day].join(', ')})`).join(' / ');
                };
                
                // Format Date
                const dateString = app.submittedAt 
                  ? new Date(app.submittedAt.seconds * 1000).toLocaleString('ko-KR')
                  : '날짜 알 수 없음';
                
                return (
                  <div key={app.id} className="border-4 border-foreground rounded-2xl overflow-hidden transition-all duration-300">
                    <div 
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between p-6 cursor-pointer hover:bg-bread-light/50 transition-colors gap-4",
                        isExpanded ? "bg-bread-light border-b-4 border-foreground border-dashed" : "bg-white"
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className="w-14 h-14 bg-bread border-4 border-foreground rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-[2px_2px_0_0_#5D3A20]">
                          {applications.length - index}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-2xl font-bold">{app.name || '이름 없음'}</h4>
                            <span className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0_0_#5D3A20]">
                              {app.gender || '성별미상'}
                            </span>
                          </div>
                          <p className="text-foreground/70 font-bold text-lg">
                            {app.age ? `${app.age}세` : '나이미상'} • {app.job || '직업미상'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                         <span className="text-foreground/50 font-bold text-sm bg-white px-3 py-1 rounded-lg border-2 border-foreground/20">
                           {dateString}
                         </span>
                         <div className="w-10 h-10 bg-white border-4 border-foreground rounded-full flex items-center justify-center shadow-[2px_2px_0_0_#5D3A20]">
                           {isExpanded ? <ChevronUp strokeWidth={3} /> : <ChevronDown strokeWidth={3} />}
                         </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="bg-white p-6 sm:p-8 animate-in slide-in-from-top-4 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">학교 / 직장 🏫</p>
                              <p className="text-xl font-bold p-4 bg-[#FDF7EC] border-4 border-foreground rounded-xl">{app.school || '-'}</p>
                            </div>

                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">전공 / 직무 📚</p>
                              <p className="text-xl font-bold p-4 bg-[#FDF7EC] border-4 border-foreground rounded-xl">{app.major || '-'}</p>
                            </div>

                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">가까운 지하철역 🚇</p>
                              <p className="text-xl font-bold p-4 bg-[#FDF7EC] border-4 border-foreground rounded-xl">{app.subway || '-'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">지원 동기 🥐</p>
                              <p className="text-lg font-bold p-4 bg-[#FDF7EC] border-4 border-foreground rounded-xl whitespace-pre-line">{app.reason || '-'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">나만 아는 빵집 🗺️</p>
                              <p className="text-lg font-bold p-4 bg-[#FDF7EC] border-4 border-foreground rounded-xl whitespace-pre-line">{app.gem || '-'}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">기대하는 분위기 🤍</p>
                              <p className="text-lg font-bold p-4 bg-[#FDF7EC] border-4 border-foreground rounded-xl whitespace-pre-line">{app.atmosphere || '-'}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">좋아하는 빵 종류 🍰</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(app.favorite || []).map((item: string) => (
                                  <span key={item} className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0_0_#5D3A20]">{item}</span>
                                ))}
                                {(!app.favorite || app.favorite.length === 0) && <span className="text-foreground/50">-</span>}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">빵집 고를 때 기준 👀</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(app.important || []).map((item: string) => (
                                  <span key={item} className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0_0_#5D3A20]">{item}</span>
                                ))}
                                {(!app.important || app.important.length === 0) && <span className="text-foreground/50">-</span>}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">해보고 싶은 활동 🧁</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(app.activities || []).map((item: string) => (
                                  <span key={item} className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0_0_#5D3A20]">{item}</span>
                                ))}
                                {(!app.activities || app.activities.length === 0) && <span className="text-foreground/50">-</span>}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">활동 가능 지역 📍</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(app.area || []).map((item: string) => (
                                  <span key={item} className="bg-white border-2 border-foreground px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0_0_#5D3A20]">{item}</span>
                                ))}
                                {(!app.area || app.area.length === 0) && <span className="text-foreground/50">-</span>}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold text-bread-dark mb-1">활동 가능 일정 📅</p>
                              <p className="text-lg font-bold p-4 bg-bread-light border-4 border-foreground rounded-xl">{renderSchedule(app.schedule)}</p>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
