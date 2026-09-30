import {
  Gauge,
  Layers,
  LayoutDashboard,
  Plug,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "@/data/services";
import type { ServiceIcon } from "@/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  layout: LayoutDashboard,
  layers: Layers,
  cart: ShoppingCart,
  plug: Plug,
  responsive: Smartphone,
  gauge: Gauge,
};

export function Services() {
  return (
    <Section
      id="services"
      title="What I Can Build"
      subtitle="Six things I take on, from the first component to the interface people actually use."
      centered
      className="border-t border-[var(--line)] py-16 sm:py-20"
    >
      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = ICONS[service.icon];

          return (
            <Reveal
              as="li"
              key={service.number}
              delay={index * 0.04}
              className="group bg-[var(--shell)] p-7 transition-colors duration-300 hover:bg-[#eef8f7]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[0.75rem] tabular-nums tracking-[0.12em] text-[var(--ink-faint)]">
                  {service.number}
                </span>
                <Icon
                  size={20}
                  aria-hidden
                  className="text-[var(--ink-faint)] transition-colors duration-300 group-hover:text-[var(--ink)]"
                />
              </div>

              <h3 className="mt-7 text-[1.05rem] font-medium tracking-tight text-[var(--ink)]">
                {service.title}
              </h3>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-[var(--ink-soft)]">
                {service.description}
              </p>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
