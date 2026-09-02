type SectionHeadingProps = {
  title: string;
  id?: string;
};

export default function SectionHeading({ title, id }: SectionHeadingProps) {
  return (
    <div className="mb-9 flex items-center gap-5 sm:mb-11">
      <span className="h-8 w-1.5 rounded-pill bg-accent sm:h-[30px]" aria-hidden="true" />
      <h2 id={id} className="font-core text-[28px] font-semibold tracking-[0.02em] text-ink sm:text-[34px]">{title}</h2>
    </div>
  );
}
