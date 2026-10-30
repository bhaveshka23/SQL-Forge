function FeatureCard({ icon, title, description }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-xl text-cyan-300">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-6 text-slate-400">{description}</p>
    </article>
  )
}

export default FeatureCard
