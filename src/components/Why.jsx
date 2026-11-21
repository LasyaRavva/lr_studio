import { reasons, testimonials } from '../data.js'

export default function Why() {
  return (
    <section className="section section--light section--tight" id="why">
      <div className="section__head rv"><h2>Why clients work with us</h2></div>
      <div className="why rv">
        {reasons.map((r, i) => (
          <div key={r.title} className={`why__item why__item--${i}`}>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
      {testimonials.length > 0 && (
        <div className="quotes">
          {testimonials.map((t) => (
            <figure key={t.name}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>{t.name}, {t.role}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
