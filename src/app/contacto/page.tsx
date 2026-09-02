import { NavHeader } from "@/components/ui/NavHeader";
import Link from "next/link";

export const metadata = { title: "Contacto — AstroLife" };

const FAQ = [
  {
    q: "¿Cómo elimino mi cuenta?",
    a: 'Escríbenos a hola@astrolife.cl con el asunto "Eliminar cuenta" desde el correo con el que te registraste.',
  },
  {
    q: "¿Cómo edito mi carta natal?",
    a: 'Ingresa a la sección Carta Natal y selecciona "Editar datos".',
  },
  {
    q: "¿Astrid recuerda mis conversaciones anteriores?",
    a: "Sí, siempre que estés registrado e ingresado con tu cuenta.",
  },
  {
    q: "¿El servicio es gratuito?",
    a: "Sí, AstroLife.cl es completamente gratuito. El servicio se financia mediante publicidad.",
  },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen" style={{ background: "#100A1A", color: "#F0EDE8" }}>
      <NavHeader variant="dark" />
      <div
        className="mx-auto px-4 py-10"
        style={{ maxWidth: "680px", fontSize: "15px", lineHeight: "1.7" }}
      >
        <h1 className="font-display mb-3 text-[2rem] font-bold" style={{ color: "#F0EDE8" }}>
          Contacto
        </h1>
        <p className="mb-10" style={{ color: "#A898A8" }}>
          Estamos disponibles para ayudarte con cualquier pregunta sobre el servicio, tu cuenta o el uso de la plataforma.
        </p>

        {/* Contact info cards */}
        <div className="mb-10 flex flex-col gap-3">
          <InfoCard icon="✉️" label="Correo electrónico">
            <a
              href="mailto:hola@astrolife.cl"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "#C8A96E" }}
            >
              hola@astrolife.cl
            </a>
          </InfoCard>
          <InfoCard icon="🏢" label="Empresa">
            <span style={{ color: "#D0CAE0" }}>LongViva SpA — Santiago, Chile</span>
          </InfoCard>
          <InfoCard icon="⏱️" label="Tiempo de respuesta">
            <span style={{ color: "#D0CAE0" }}>Respondemos en un plazo máximo de 48 horas hábiles.</span>
          </InfoCard>
        </div>

        {/* FAQ */}
        <h2 className="font-display mb-5 text-[1.3rem] font-semibold" style={{ color: "#C8A96E" }}>
          Consultas frecuentes
        </h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-[12px] px-5 py-4"
              style={{ background: "#18102A", border: "1px solid #2A1F3D" }}
            >
              <p className="mb-1 font-semibold text-[15px]" style={{ color: "#F0EDE8" }}>{item.q}</p>
              <p className="text-[14px]" style={{ color: "#A898A8" }}>{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[13px]" style={{ color: "#888880" }}>
          <Link href="/" className="hover:text-ink" style={{ color: "#C8A96E" }}>
            ← Volver a AstroLife
          </Link>
          <p className="mt-6 pb-8 text-[12px]">© 2026 LongViva SpA</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-4 rounded-[12px] px-5 py-4"
      style={{ background: "#18102A", border: "1px solid #2A1F3D" }}
    >
      <span className="mt-0.5 text-xl">{icon}</span>
      <div>
        <p className="mb-0.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "#888880" }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
