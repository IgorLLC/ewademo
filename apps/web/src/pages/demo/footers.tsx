import React from 'react';
import { Button } from '@ewa/ui';
import { Mail, MapPin, Phone, Instagram, Linkedin, Twitter } from 'lucide-react';

interface FooterVariant {
  id: string;
  title: string;
  description?: string;
  layout:
    | 'classic'
    | 'cta-bar'
    | 'centered'
    | 'social'
    | 'metrics'
    | 'map'
    | 'newsletter'
    | 'minimal'
    | 'statement'
    | 'boxed';
}

const variants: FooterVariant[] = [
  {
    id: 'footer-1',
    title: 'Classic columnas',
    description: 'Versión base con tres columnas y enlaces rápidos.',
    layout: 'classic',
  },
  {
    id: 'footer-2',
    title: 'Barra de CTA superior',
    description: 'Ideal para campañas que empujan un CTA principal.',
    layout: 'cta-bar',
  },
  {
    id: 'footer-3',
    title: 'Centro alineado',
    description: 'Pensado para landing pages minimalistas con marca centrada.',
    layout: 'centered',
  },
  {
    id: 'footer-4',
    title: 'Social-first',
    description: 'Promueve redes y contenido generado por usuarios.',
    layout: 'social',
  },
  {
    id: 'footer-5',
    title: 'Métricas de impacto',
    description: 'Comparte resultados ambientales junto al contacto.',
    layout: 'metrics',
  },
  {
    id: 'footer-6',
    title: 'Mapa interactivo',
    description: 'Ubicaciones destacadas para puntos de entrega.',
    layout: 'map',
  },
  {
    id: 'footer-7',
    title: 'Newsletter hero',
    description: 'Captura leads con enfoque en contenido.',
    layout: 'newsletter',
  },
  {
    id: 'footer-8',
    title: 'Minimal empresarial',
    description: 'Version reducida para dashboards o apps web.',
    layout: 'minimal',
  },
  {
    id: 'footer-9',
    title: 'Statement ESG',
    description: 'Texto largo y misión para páginas corporativas.',
    layout: 'statement',
  },
  {
    id: 'footer-10',
    title: 'Card boxed',
    description: 'Footer en tarjeta para landings con fondo claro.',
    layout: 'boxed',
  },
];

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="space-y-1">
    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    {description && <p className="text-sm text-slate-500">{description}</p>}
  </div>
);

const SocialIcons = () => (
  <div className="flex gap-3 text-white/80">
    <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
      <Instagram className="h-4 w-4" />
    </a>
    <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
      <Linkedin className="h-4 w-4" />
    </a>
    <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
      <Twitter className="h-4 w-4" />
    </a>
  </div>
);

const CTAButton: React.FC<{ label: string; style: 'primary' | 'ghost' | 'outline' }> = ({ label, style }) => {
  const base = 'rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  if (style === 'primary') {
    return <button className={`${base} bg-sky-500 text-slate-900 hover:bg-sky-400 focus:ring-sky-500`}>{label}</button>;
  }
  if (style === 'outline') {
    return <button className={`${base} border border-white/30 text-white/80 hover:border-sky-400 hover:text-white focus:ring-sky-400`}>{label}</button>;
  }
  return <button className={`${base} border border-white/20 text-white/80 hover:border-sky-400 hover:text-white focus:ring-sky-400`}>{label}</button>;
};

const FooterVariantBlock: React.FC<{ variant: FooterVariant }> = ({ variant }) => {
  switch (variant.layout) {
    case 'classic':
      return (
        <footer className="overflow-hidden rounded-3xl bg-slate-950 px-8 py-12 text-white">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold">ewa</h3>
              <p className="mt-3 text-sm text-white/70">
                Logística circular que elimina plástico y entrega métricas accionables para tu negocio.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Recursos</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><a href="/plans" className="hover:text-white">Planes</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/stores" className="hover:text-white">Puntos EWA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Contacto</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (787) 555-0101</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hola@ewa.com</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> San Juan, PR</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
            © {new Date().getFullYear()} EWA Box Water. Todos los derechos reservados.
          </div>
        </footer>
      );
    case 'cta-bar':
      return (
        <footer className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="bg-sky-500 px-8 py-10 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Lista para activar logística circular?</h3>
                <p className="text-sm text-white/70">Configura tu piloto en menos de 10 días con nuestro equipo.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-white text-slate-900 hover:bg-slate-100">Agendar workshop</Button>
                <Button className="border border-white/50 bg-transparent text-white hover:bg-white/10">Descargar one pager</Button>
              </div>
            </div>
          </div>
          <div className="grid gap-6 px-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <SectionTitle title="Dirección" />
              <p className="mt-2 text-sm text-slate-600">Calle Loíza 123, San Juan, PR 00911</p>
            </div>
            <div>
              <SectionTitle title="Soporte" />
              <p className="mt-2 text-sm text-slate-600">support@ewa.com</p>
              <p className="text-sm text-slate-600">(787) 555-0101</p>
            </div>
            <div>
              <SectionTitle title="Recursos" />
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li><a href="/products" className="hover:text-slate-900">Catálogo</a></li>
                <li><a href="/blog" className="hover:text-slate-900">Historias</a></li>
              </ul>
            </div>
            <div>
              <SectionTitle title="Síguenos" />
              <SocialIcons />
            </div>
          </div>
        </footer>
      );
    case 'centered':
      return (
        <footer className="overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
          <h3 className="text-3xl font-semibold">ewa</h3>
          <p className="mt-4 text-sm text-white/70">
            Reducimos plástico de un solo uso con logística inteligente, cajas reutilizables y reportes en tiempo real.
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm text-white/70">
            <a href="/plans" className="hover:text-white">Planes</a>
            <a href="/products" className="hover:text-white">Productos</a>
            <a href="/stores" className="hover:text-white">Puntos EWA</a>
            <a href="/blog" className="hover:text-white">Blog</a>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <SocialIcons />
          </div>
          <p className="mt-8 text-xs text-white/50">© {new Date().getFullYear()} EWA. Hidratación circular desde Puerto Rico.</p>
        </footer>
      );
    case 'social':
      return (
        <footer className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid gap-8 px-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center">
            <div className="space-y-4">
              <SectionTitle title="Comparte tu experiencia EWA" description="Etiqueta @ewa.hydration y #EWAimpact" />
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Instagram</span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">LinkedIn</span>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">TikTok</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <img src="/images/products/250ml/2.png" alt="EWA social 1" className="h-32 w-full rounded-2xl object-cover" />
              <img src="/images/products/500ml/3.png" alt="EWA social 2" className="h-32 w-full rounded-2xl object-cover" />
              <img src="/images/products/1000ml/5.png" alt="EWA social 3" className="h-32 w-full rounded-2xl object-cover" />
            </div>
          </div>
        </footer>
      );
    case 'metrics':
      return (
        <footer className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-8 py-12 text-white">
          <SectionTitle title="Impacto de nuestra comunidad" description="Resultados del último trimestre" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Plástico evitado</p>
              <p className="mt-2 text-2xl font-semibold">-72,400 botellas</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Cajas rotan</p>
              <p className="mt-2 text-2xl font-semibold">94% devueltas</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Clientes</p>
              <p className="mt-2 text-2xl font-semibold">+1,800 activos</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Satisfacción</p>
              <p className="mt-2 text-2xl font-semibold">4.9 / 5</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton label="Descargar reporte ESG" style="primary" />
            <CTAButton label="Agenda consultoría" style="ghost" />
          </div>
        </footer>
      );
    case 'map':
      return (
        <footer className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)]">
            <div className="space-y-4 px-8 py-10">
              <SectionTitle title="Puntos EWA" description="Coordina pick-up o lockers 24/7" />
              <div className="space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-500" /> San Juan Hub</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-500" /> Ponce Fulfillment</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-500" /> Mayagüez Pickup</p>
              </div>
              <Button className="bg-sky-500 text-white hover:bg-sky-400">Ver mapa interactivo</Button>
            </div>
            <div className="relative">
              <img
                src={`https://imfin.it/api/generate?prompt=${encodeURIComponent(
                  'isometric map of puerto rico with ewa logistics hubs, vibrant, minimal, brand colors',
                )}&model=gemini`}
                alt="Mapa puntos EWA"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            </div>
          </div>
        </footer>
      );
    case 'newsletter':
      return (
        <footer className="overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <SectionTitle
                title="Hidrata tu bandeja de entrada"
                description="Historias de clientes, lanzamiento de productos y tips de logística circular."
              />
            </div>
            <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="tu@empresa.com"
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              />
              <Button className="rounded-full bg-sky-500 text-slate-900 hover:bg-sky-400">Suscribirme</Button>
            </form>
          </div>
          <div className="mt-8 text-xs text-white/60">
            Prometemos no enviar spam. Solo historias reales de marcas que hidratan sin plástico.
          </div>
        </footer>
      );
    case 'minimal':
      return (
        <footer className="overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">© {new Date().getFullYear()} EWA Box Water</div>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
              <a href="/plans" className="hover:text-slate-600">Planes</a>
              <a href="/blog" className="hover:text-slate-600">Blog</a>
              <a href="/stores" className="hover:text-slate-600">Puntos</a>
              <a href="mailto:hola@ewa.com" className="hover:text-slate-600">Contacto</a>
            </div>
          </div>
        </footer>
      );
    case 'statement':
      return (
        <footer className="overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-white">
          <h3 className="text-2xl font-semibold">Nuestra promesa ESG</h3>
          <p className="mt-4 max-w-3xl text-sm text-white/70">
            Operamos con energía renovable certificada, reutilizamos el 95% del agua en planta y acompañamos a nuestros clientes con reportes ESG listos para auditorías. Cada caja, botella y locker EWA se monitorea para asegurar ciclos cerrados.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
            <span className="rounded-full bg-white/10 px-4 py-2">carbon neutral logistics</span>
            <span className="rounded-full bg-white/10 px-4 py-2">datos en tiempo real</span>
            <span className="rounded-full bg-white/10 px-4 py-2">alianzas locales</span>
          </div>
        </footer>
      );
    case 'boxed':
      return (
        <footer className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white p-10 shadow-lg">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-slate-900">ewa</h3>
              <p className="text-sm text-slate-600">
                Nuestra logística circular equipa a tu marca con cajas reutilizables, botellas premium y dashboard predictivo.
              </p>
              <Button className="bg-sky-500 text-white hover:bg-sky-400">Hablar con ventas</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <h4 className="font-semibold text-slate-900">Recursos</h4>
                <ul className="mt-2 space-y-1">
                  <li><a href="/products" className="hover:text-slate-900">Catálogo</a></li>
                  <li><a href="/about" className="hover:text-slate-900">Equipo</a></li>
                  <li><a href="/blog" className="hover:text-slate-900">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Contacto</h4>
                <ul className="mt-2 space-y-1">
                  <li>hola@ewa.com</li>
                  <li>(787) 555-0101</li>
                  <li>San Juan, PR</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      );
    default:
      return null;
  }
};

const DemoFootersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Variaciones de Footer EWA</h1>
          <p className="mt-2 text-sm text-slate-600">
            Experimenta con diferentes composiciones de pie de página para campañas, landings y dashboards.
          </p>
        </header>

        <div className="space-y-16">
          {variants.map((variant) => (
            <section key={variant.id}>
              <SectionTitle title={variant.title} description={variant.description} />
              <div className="mt-4">
                <FooterVariantBlock variant={variant} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoFootersPage;
