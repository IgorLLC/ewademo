import React from 'react';
import { Button } from '@ewa/ui';

const CTASection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-24 text-white">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="wave-pattern" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/35 via-cyan-500/20 to-transparent mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/30 to-slate-950/80" />
      <div className="absolute -left-20 bottom-10 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="absolute -right-16 top-8 h-32 w-32 rounded-full bg-cyan-300/30 blur-2xl" />

      <div className="relative container mx-auto px-4">
        <div className="grid gap-12 rounded-[36px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-[0_40px_80px_-32px_rgba(13,148,136,0.45)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Únete al cambio</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Agenda una sesión de descubrimiento con nuestro equipo y actívate en menos de 10 días.
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
              Analizamos tus consumos, diseñamos el plan ideal y coordinamos logística para tu primer delivery piloto. Sin costo ni compromisos.
            </p>
            <form
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const emailInput = form.querySelector<HTMLInputElement>('[name=contactEmail]');
                if (emailInput && emailInput.value) {
                  window.open(`mailto:hola@ewa.com?subject=Quiero%20activar%20EWA&body=Hola%20equipo,%20quisiera%20agendar%20una%20sesión.%20Mi%20correo%20es%20${encodeURIComponent(emailInput.value)}.`);
                } else {
                  window.open('mailto:hola@ewa.com', '_blank');
                }
              }}
            >
              <div className="flex-1">
                <label htmlFor="cta-email" className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  Correo corporativo
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 focus-within:border-sky-400 focus-within:bg-white/10">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l9 5 9-5"
                    />
                  </svg>
                  <input
                    id="cta-email"
                    name="contactEmail"
                    type="email"
                    required
                    placeholder="tu@empresa.com"
                    className="h-10 w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="whitespace-nowrap bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
              >
                Agendar llamada
              </Button>
            </form>
            <button
              onClick={() => window.open('https://cal.com', '_blank')}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5">
                <svg className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16l-4-4m0 0l4-4m-4 4h14" />
                </svg>
              </span>
              Descargar brochure operativo
            </button>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
            <div className="rounded-2xl bg-slate-900/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Resultados promedio</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-4xl font-semibold text-white">-64%</p>
                  <p className="mt-1 text-sm text-white/60">Menos plástico de un solo uso</p>
                </div>
                <div>
                  <p className="text-4xl font-semibold text-white">+32%</p>
                  <p className="mt-1 text-sm text-white/60">Aumento en consumo de agua por persona</p>
                </div>
              </div>
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                <p className="font-semibold text-white">Incluye:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Diagnóstico de consumo gratuito
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Implementación en 10 días con equipo dedicado
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reporte de impacto personalizado
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
