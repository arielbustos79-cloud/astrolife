"use client";

import { useState } from "react";
import { BIRTHPLACES } from "@/lib/astro/birthplaces";
import type { BirthInput } from "@/lib/astro/ephemeris";

export type BirthFormData = BirthInput & { name: string };

const LABEL_CLASS = "mb-1.5 block text-[13px] font-medium text-ink";
const INPUT_CLASS =
  "w-full rounded-btn border-[1.5px] border-line bg-surface px-4 py-3 font-ui text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-gold";

type BirthDataFormProps = {
  onSubmit: (data: BirthFormData) => void;
  submitting?: boolean;
  initial?: Partial<BirthFormData>;
};

export function BirthDataForm({ onSubmit, submitting, initial }: BirthDataFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [placeId, setPlaceId] = useState("santiago");
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  const [utcOffsetHours, setUtcOffsetHours] = useState(
    initial?.utcOffsetHours ?? -4,
  );

  const isCustomPlace = placeId === "otra";
  const selectedPlace = BIRTHPLACES.find((p) => p.id === placeId);

  function handlePlaceChange(id: string) {
    setPlaceId(id);
    const place = BIRTHPLACES.find((p) => p.id === id);
    if (place && id !== "otra") setUtcOffsetHours(place.utcOffsetHours);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) return;

    const latitude = isCustomPlace ? Number(customLat) : (selectedPlace?.latitude ?? 0);
    const longitude = isCustomPlace ? Number(customLon) : (selectedPlace?.longitude ?? 0);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    onSubmit({ name: name.trim(), date, time, utcOffsetHours, latitude, longitude });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4">
      <div>
        <label className={LABEL_CLASS} htmlFor="name">
          Tu nombre (opcional)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="María José"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-3 min-[480px]:flex-row">
        <div className="flex-1">
          <label className={LABEL_CLASS} htmlFor="date">
            Fecha de nacimiento
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${INPUT_CLASS} [color-scheme:dark]`}
          />
        </div>
        <div className="flex-1">
          <label className={LABEL_CLASS} htmlFor="time">
            Hora de nacimiento
          </label>
          <input
            id="time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`${INPUT_CLASS} [color-scheme:dark]`}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS} htmlFor="place">
          Lugar de nacimiento
        </label>
        <select
          id="place"
          value={placeId}
          onChange={(e) => handlePlaceChange(e.target.value)}
          className={INPUT_CLASS}
        >
          {BIRTHPLACES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {isCustomPlace && (
        <div className="flex flex-col gap-3 min-[480px]:flex-row">
          <div className="flex-1">
            <label className={LABEL_CLASS} htmlFor="lat">
              Latitud
            </label>
            <input
              id="lat"
              type="number"
              step="0.0001"
              required
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              placeholder="-33.4489"
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex-1">
            <label className={LABEL_CLASS} htmlFor="lon">
              Longitud
            </label>
            <input
              id="lon"
              type="number"
              step="0.0001"
              required
              value={customLon}
              onChange={(e) => setCustomLon(e.target.value)}
              placeholder="-70.6693"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      )}

      <div>
        <label className={LABEL_CLASS} htmlFor="offset">
          Huso horario al nacer (offset UTC)
        </label>
        <input
          id="offset"
          type="number"
          step="0.5"
          value={utcOffsetHours}
          onChange={(e) => setUtcOffsetHours(Number(e.target.value))}
          className={INPUT_CLASS}
        />
        <p className="mt-1.5 text-xs leading-[1.5] text-ink-muted">
          Chile continental es UTC-4 (o UTC-3 en horario de verano). Ajusta si
          naciste en horario de verano o en otro país.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full rounded-full bg-gold px-6 py-3.5 text-[15px] font-semibold text-bg transition-opacity hover:opacity-[.88] disabled:opacity-50"
      >
        {submitting ? "Calculando…" : "Calcular mi carta natal"}
      </button>
    </form>
  );
}
