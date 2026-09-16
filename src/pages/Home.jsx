import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <main className="home-page">
      <section className="home-container">
        
        {/* Sol Taraf: Metin ve Buton */}
        <div className="hero-content">
          <h1>
            Unlock your potential with the best <span className="highlight-text">language</span> tutors
          </h1>
          <p>
            Embark on an Exciting Language Journey with Expert Language Tutors: Elevate your language proficiency to new heights by connecting with highly qualified and experienced tutors.
          </p>
          <Link to="/teachers" className="btn-primary">
            Get started
          </Link>
        </div>

        {/* Sağ Taraf: Görsel */}
        <div className="hero-image-wrapper">
          <img 
            src="/block.png" 
            alt="Language Tutor" 
            className="hero-image" 
          />
        </div>

      </section>

      {/* Alt Taraf: Kesik Çizgili İstatistik Alanı */}
      <section className="stats-section">
        <ul className="stats-list">
          <li>
            <strong>32,000 +</strong>
            <span>Experienced<br/>tutors</span>
          </li>
          <li>
            <strong>300,000 +</strong>
            <span>5-star tutor<br/>reviews</span>
          </li>
          <li>
            <strong>120 +</strong>
            <span>Subjects<br/>taught</span>
          </li>
          <li>
            <strong>200 +</strong>
            <span>Tutor<br/>nationalities</span>
          </li>
        </ul>
      </section>
    </main>
  );
};