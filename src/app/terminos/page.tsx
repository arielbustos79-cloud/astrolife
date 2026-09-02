import { NavHeader } from "@/components/ui/NavHeader";

export const metadata = { title: "Términos de uso — AstroLife" };

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ background: "#100A1A", color: "#F0EDE8" }}>
      <NavHeader variant="dark" />
      <div
        className="mx-auto px-4 py-10"
        style={{ maxWidth: "680px", fontSize: "15px", lineHeight: "1.7" }}
      >
        <p className="mb-1 text-[13px]" style={{ color: "#888880" }}>Última actualización: Septiembre 2026</p>
        <h1 className="font-display mb-8 text-[2rem] font-bold" style={{ color: "#F0EDE8" }}>
          Términos de uso
        </h1>

        <Section title="1. Aceptación de los términos">
          <p>Al acceder y utilizar AstroLife.cl, usted acepta quedar vinculado por los presentes Términos de Uso. Si no está de acuerdo con alguna de estas condiciones, le solicitamos que no utilice el servicio.</p>
        </Section>

        <Section title="2. Descripción del servicio">
          <p className="mb-3">AstroLife.cl es una plataforma digital de astrología occidental con inteligencia artificial, que ofrece:</p>
          <ul className="list-disc space-y-1 pl-5" style={{ color: "#D0CAE0" }}>
            <li>Horóscopo diario personalizado</li>
            <li>Cálculo e interpretación de carta natal</li>
            <li>Conversaciones con Astrid, asistente astrológica con inteligencia artificial</li>
            <li>Información sobre tránsitos planetarios</li>
          </ul>
        </Section>

        <Section title="3. Requisitos de uso">
          <p>El uso de AstroLife.cl está reservado exclusivamente para personas mayores de 18 años. Al registrarse, el usuario declara tener la edad requerida.</p>
        </Section>

        <Section title="4. Naturaleza del servicio">
          <p>AstroLife.cl ofrece contenido de carácter informativo y de entretenimiento basado en astrología occidental. Las interpretaciones y mensajes generados por Astrid no constituyen asesoría profesional de ningún tipo — médica, psicológica, financiera, legal ni de otra índole. Las decisiones que el usuario tome basándose en el contenido de la plataforma son de su exclusiva responsabilidad.</p>
        </Section>

        <Section title="5. Registro y cuenta">
          <p>El usuario se registra mediante su dirección de correo electrónico. Es responsabilidad del usuario mantener la confidencialidad de su acceso y notificar a AstroLife.cl ante cualquier uso no autorizado de su cuenta.</p>
        </Section>

        <Section title="6. Propiedad intelectual">
          <p>Todo el contenido de AstroLife.cl — incluyendo textos, diseño, código, marca y logo — es propiedad de LongViva SpA y está protegido por la legislación chilena e internacional de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
        </Section>

        <Section title="7. Publicidad">
          <p>AstroLife.cl puede mostrar publicidad de terceros a través de Google AdSense. Dicha publicidad está sujeta a las políticas de Google y es independiente del contenido editorial de la plataforma.</p>
        </Section>

        <Section title="8. Limitación de responsabilidad">
          <p>LongViva SpA no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del servicio.</p>
        </Section>

        <Section title="9. Modificaciones">
          <p>LongViva SpA se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados mediante la actualización de la fecha indicada al inicio de este documento.</p>
        </Section>

        <Section title="10. Ley aplicable">
          <p>Los presentes términos se rigen por la legislación de la República de Chile. Cualquier controversia será sometida a los tribunales competentes de la ciudad de Santiago.</p>
        </Section>

        <footer className="mt-10 border-t pt-6 text-[13px]" style={{ borderColor: "#2A1F3D", color: "#888880" }}>
          <p>LongViva SpA — Santiago, Chile</p>
          <p>Contacto: <a href="mailto:hola@astrolife.cl" className="hover:text-gold" style={{ color: "#C8A96E" }}>hola@astrolife.cl</a></p>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="font-display mb-3 text-[1.1rem] font-semibold" style={{ color: "#C8A96E" }}>
        {title}
      </h2>
      <div style={{ color: "#D0CAE0" }}>{children}</div>
    </section>
  );
}
