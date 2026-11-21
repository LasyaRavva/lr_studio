export default function SnapDots({ count, index, go, label }) {
  if (count < 2) return null
  return (
    <div className="dots" role="group" aria-label={`${label} navigation`}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} className={i === index ? 'on' : ''} onClick={() => go(i)} aria-label={`Show ${label} ${i + 1} of ${count}`} aria-current={i === index} />
      ))}
    </div>
  )
}
