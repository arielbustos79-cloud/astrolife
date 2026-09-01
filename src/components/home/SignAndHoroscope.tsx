"use client";

import { useEffect, useState } from "react";
import { ZODIAC_SIGNS, getZodiacSign } from "@/lib/zodiac";
import { getDailyHoroscope } from "@/lib/mock-content";

const STORAGE_KEY = "astrolife:sign";
const DEFAULT_SIGN = "libra";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type HoroscopeData = {
  text: string;
  chips: string[];
};

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-08-30"
}

function getCached(signName: string): HoroscopeData | null {
  try {
    const key = `astrolife:horoscopo:${signName}:${todayKey()}`;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as {
      data: HoroscopeData;
      timestamp: number;
    };
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      window.localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(signName: string, data: HoroscopeData) {
  try {
    const key = `astrolife:horoscopo:${signName}:${todayKey()}`;
    window.localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // storage quota — ignore
  }
}

function getFallback(signId: string): HoroscopeData {
  const h = getDailyHoroscope(signId);
  return { text: h.text, chips: h.aspects };
}

export function SignAndHoroscope() {
  const [signId, setSignId] = useState(DEFAULT_SIGN);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setSignId(stored);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sign = getZodiacSign(signId);

    const cached = getCached(sign.name);
    if (cached) {
      setHoroscope(cached);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch("/api/horoscopo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signo: sign.name }),
    })
      .then((res) => res.json())
      .then((data: { texto?: string; aspectos?: string[]; planeta?: string; error?: string }) => {
        if (cancelled) return;
        if (data.error || !data.texto) {
          const fallback = getFallback(signId);
          setHoroscope(fallback);
          return;
        }
        const normalized: HoroscopeData = {
          text: data.texto,
          chips: [
            data.planeta ? `${data.planeta} activo` : "",
            ...(data.aspectos ?? []),
          ].filter(Boolean),
        };
        setCache(sign.name, normalized);
        setHoroscope(normalized);
      })
      .catch(() => {
        if (!cancelled) setHoroscope(getFallback(signId));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [signId]);

  function selectSign(id: string) {
    setSignId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  const sign = getZodiacSign(signId);

  return (
    <>
      <section className="mb-5 px-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4A4540]">
          Tu signo
        </p>
        <div className="grid w-full grid-cols-6 grid-rows-2 gap-2">
          {ZODIAC_SIGNS.map((s) => {
            const active = s.id === signId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => selectSign(s.id)}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] text-[20px] text-[#1A1020] transition-all ${
                    active
                      ? "border-gold bg-white shadow-[0_0_12px_rgba(200,169,110,0.35)]"
                      : "border-[#C8C0B4] bg-white"
                  }`}
                >
                  {s.symbol}
                </span>
                <span
                  className={`text-[9px] ${
                    active ? "font-medium text-gold" : "text-[#6B6560]"
                  }`}
                >
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-5 mb-5 rounded-card border border-[#D4CEC4] bg-white p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[2.2rem] leading-none">{sign.symbol}</span>
            <div>
              <p className="font-display text-lg font-semibold text-[#1A1020]">
                {sign.name}
              </p>
              <p className="text-[11px] text-[#6B6560]">{sign.dateRange}</p>
            </div>
          </div>
          <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[11px] text-gold-dim">
            Hoy
          </span>
        </div>

        {loading ? (
          <>
            <div className="mb-4 space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded-full bg-[#E8E4DC]" />
              <div className="h-3.5 w-[90%] animate-pulse rounded-full bg-[#E8E4DC]" />
              <div className="h-3.5 w-[75%] animate-pulse rounded-full bg-[#E8E4DC]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[80, 100, 70].map((w) => (
                <div
                  key={w}
                  className="h-6 animate-pulse rounded-full bg-[#E8E4DC]"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm leading-[1.7] text-[#2A2020]">
              {horoscope?.text}
            </p>
            <div className="flex flex-wrap gap-2">
              {horoscope?.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#00000018] bg-[#F3EFE8] px-2.5 py-1 text-[11px] text-[#2A2020]/75"
                >
                  {chip}
                </span>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
