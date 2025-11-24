import Image from "next/image";
import Link from "next/link";

const brandLogos = [
  { name: "XCMG", src: "/assets/logos/XCMG.png" },
  { name: "Weichai", src: "/assets/logos/weichai.png" },
  { name: "Volvo", src: "/assets/logos/volvo.png" },
  { name: "Komatsu", src: "/assets/logos/komatsu.png" },
  { name: "Cummins", src: "/assets/logos/cummins.png" },
  { name: "Sany", src: "/assets/logos/sany.png" },
  { name: "SDLG", src: "/assets/logos/sdlg.png" },
  { name: "Dressta", src: "/assets/logos/dressta.png" },
  { name: "LiuGong", src: "/assets/logos/liugong.png" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between bg-white px-4 py-4 shadow-sm sm:px-10">
        <Image
          src="/assets/logos/AIMM.png"
          alt="AIMM logo"
          width={180}
          height={52}
          className="h-12 w-auto object-contain"
          priority
        />
        <Link
          href="https://wa.me/56976204924"
          className="font-bold text-[#10456f] transition hover:underline text-xl"
        >
          Contacto
        </Link>
      </nav>

      <section className="relative w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/retros.png"
            alt="Cargadores frontales en faena"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-[#0b2d56]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/70 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-[1200px] flex-col justify-center px-4 py-10 sm:px-10 md:py-12">
          <div className="max-w-3xl space-y-6 text-white">
            <h1 className="fade-in-up text-3xl font-semibold leading-tight sm:text-4xl md:text-[42px]">
              Asegura el funcionamiento de tus equipos; contáctanos para una{" "}
              <span className="font-bold">
                gestión de repuestos rápida y confiable.
              </span>
            </h1>
            <Link
              href="/catalog"
              className="fade-in-up inline-flex w-fit items-center justify-center rounded-md bg-[#10456f] px-8 py-2 font-bold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-[#0b2d56] hover:shadow-xl text-xl"
              style={{ animationDelay: "120ms" }}
            >
              Ir al catálogo
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-10 pt-4 sm:px-10 sm:pb-14 sm:pt-6">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 place-items-center gap-8 sm:grid-cols-3 md:grid-cols-5">
          {brandLogos.map((logo) => (
            <div key={logo.name} className="h-14 w-32 sm:h-16 sm:w-40">
              <Image
                src={logo.src}
                alt={logo.name}
                width={180}
                height={64}
                className="h-full w-full object-contain grayscale saturate-0 opacity-20 transition hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
