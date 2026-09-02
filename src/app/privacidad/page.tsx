import { NavHeader } from "@/components/ui/NavHeader";

export const metadata = { title: "Política de privacidad — AstroLife" };

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ background: "#100A1A", color: "#F0EDE8" }}>
      <NavHeader variant="dark" />
      <div
        className="mx-auto px-4 py-10"
        style={{ maxWidth: "680px", fontSize: "15px", lineHeight: "1.7" }}
      >
        <p className="mb-1 text-[13px]" style={{ color: "#888880" }}>Última actualización: Septiembre 2026</p>
        <h1 className="font-display mb-8 text-[2rem] font-bold" style={{ color: "#F0EDE8" }}>
          Política de privacidad
        </h1>

        <Section title="1. Responsable del tratamiento">
          <p>LongViva SpA, empresa constituida en Chile, es responsable del tratamiento de los datos personales recopilados a través de AstroLife.cl.</p>
          <p className="mt-2">Contacto: <a href="mailto:hola@astrolife.cl" style={{ color: "#C8A96E" }}>hola@astrolife.cl</a></p>
        </Section>

        <Section title="2. Datos que recopilamos">
          <p className="mb-3">Al utilizar AstroLife.cl, recopilamos los siguientes datos:</p>

          <p className="mb-1 font-semibold" style={{ color: "#F0EDE8" }}>Datos de registro:</p>
          <ul className="mb-4 list-disc space-y-1 pl-5">
            <li>Dirección de correo electrónico</li>
          </ul>

          <p className="mb-1 font-semibold" style={{ color: "#F0EDE8" }}>Datos de carta natal:</p>
          <ul className="mb-4 list-disc space-y-1 pl-5">
            <li>Nombre (opcional)</li>
            <li>Fecha de nacimiento</li>
            <li>Hora de nacimiento</li>
            <li>Lugar de nacimiento</li>
          </ul>

          <p className="mb-1 font-semibold" style={{ color: "#F0EDE8" }}>Datos de uso:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Conversaciones con Astrid (mensajes enviados y recibidos)</li>
            <li>Signo zodiacal seleccionado</li>
            <li>Cookies de sesión necesarias para el funcionamiento del servicio</li>
          </ul>
        </Section>

        <Section title="3. Finalidad del tratamiento">
          <p className="mb-3">Los datos recopilados se utilizan para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Crear y gestionar su cuenta de usuario</li>
            <li>Calcular e interpretar su carta natal</li>
            <li>Personalizar las respuestas de Astrid</li>
            <li>Mantener su sesión activa en la plataforma</li>
            <li>Mostrar publicidad relevante (Google AdSense)</li>
            <li>Mejorar el servicio</li>
          </ul>
        </Section>

        <Section title="4. Uso de cookies">
          <p>AstroLife.cl utiliza cookies estrictamente necesarias para el funcionamiento del servicio, específicamente para mantener la sesión del usuario autenticado. No utilizamos cookies de rastreo propias. Sin embargo, Google AdSense puede utilizar cookies de terceros para mostrar publicidad personalizada.</p>
        </Section>

        <Section title="5. Compartición de datos con terceros">
          <p className="mb-4">Para el funcionamiento del servicio, sus datos pueden ser procesados por los siguientes terceros:</p>

          <div className="space-y-4">
            <ThirdParty name="Anthropic (Estados Unidos)">
              Los mensajes que usted envía a Astrid son procesados por la API de Claude de Anthropic para generar respuestas. Anthropic puede procesar estos datos según su propia política de privacidad disponible en anthropic.com.
            </ThirdParty>
            <ThirdParty name="Google (Estados Unidos)">
              A través de Google AdSense, Google puede recopilar datos de comportamiento para mostrar publicidad personalizada. Puede gestionar sus preferencias en adssettings.google.com.
            </ThirdParty>
            <ThirdParty name="Supabase (Estados Unidos)">
              Base de datos y autenticación. Sus datos son almacenados de forma segura en servidores de Supabase.
            </ThirdParty>
            <ThirdParty name="Vercel (Estados Unidos)">
              Plataforma de alojamiento web que procesa las solicitudes del servicio.
            </ThirdParty>
          </div>
        </Section>

        <Section title="6. Seguridad">
          <p>Implementamos medidas técnicas de seguridad para proteger sus datos, incluyendo cifrado en tránsito (HTTPS) y políticas de acceso restringido en la base de datos (Row Level Security).</p>
        </Section>

        <Section title="7. Retención de datos">
          <p>Sus datos se conservan mientras mantenga una cuenta activa en AstroLife.cl. Si desea eliminar su cuenta y datos asociados, puede solicitarlo a <a href="mailto:hola@astrolife.cl" style={{ color: "#C8A96E" }}>hola@astrolife.cl</a>.</p>
        </Section>

        <Section title="8. Derechos del usuario">
          <p className="mb-3">De conformidad con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile, usted tiene derecho a:</p>
          <ul className="mb-3 list-disc space-y-1 pl-5">
            <li>Acceder a sus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al tratamiento de sus datos</li>
          </ul>
          <p>Para ejercer estos derechos, escríbanos a <a href="mailto:hola@astrolife.cl" style={{ color: "#C8A96E" }}>hola@astrolife.cl</a>.</p>
        </Section>

        <Section title="9. Modificaciones">
          <p>Esta política puede ser actualizada periódicamente. La fecha de última modificación se indica al inicio del documento.</p>
        </Section>

        <footer className="mt-10 border-t pt-6 text-[13px]" style={{ borderColor: "#2A1F3D", color: "#888880" }}>
          <p>LongViva SpA — Santiago, Chile</p>
          <p className="mt-6 pb-8 text-center text-[12px]">© 2026 LongViva SpA</p>
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

function ThirdParty({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] px-4 py-3" style={{ background: "#18102A", border: "1px solid #2A1F3D" }}>
      <p className="mb-1 font-semibold text-[14px]" style={{ color: "#F0EDE8" }}>{name}</p>
      <p className="text-[13px]">{children}</p>
    </div>
  );
}
