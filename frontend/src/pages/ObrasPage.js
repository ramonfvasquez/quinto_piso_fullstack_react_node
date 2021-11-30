import axios from 'axios';
import { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import '../styles/components/pages/ObrasPage.css';
import Button from '../components/layout/Button';

function ObrasPage() {
  const [loading, setLoading] = useState(false);
  const [plays, setPlays] = useState([]);

  useEffect(() => {
    const loadPlays = async () => {
      setLoading(true);

      const response = await axios.get('http://localhost:3000/api/obras');
      setPlays(response.data);
      setLoading(false);
    };

    loadPlays();
  }, []);

  const mapPlays = () => {
    if (plays.length > 0) {
      return plays.map((play, indexPlay) => {
        const staff = () => {
          return <ul className="staff">{mapActors(play)}</ul>;
        };
        return (
          <div className="play" key={indexPlay}>
            <h1 className="play-title">{play.PlayTitle}</h1>
            <p className="play-subtitle">{`${play.PlayAuthor} [${
              play.PlayFirstYear
            }${
              play.PlayFirstYear !== play.PlayLastYear
                ? `  - ${play.PlayLastYear}`
                : ''
            }]`}</p>
            <ImageGallery
              items={play.photos.map((photo) => {
                return {
                  original: `http://localhost:3000/images/plays/${photo.fileName}`,
                  originalHeight: 300,
                };
              })}
              showThumbnails={false}
              showFullscreenButton={false}
              useBrowserFullscreen={false}
              showPlayButton={false}
            />
            <div className="play-btn-container">
              <Button
                text="Concepción"
                playTitle={play.PlayTitle}
                content={play.PlayConception}
                className="play-btn"
              />
              <Button
                text="Puesta en escena"
                playTitle={play.PlayTitle}
                content={play.PlayStaging}
                className="play-btn"
              />
              <Button
                text="Equipo"
                playTitle={play.PlayTitle}
                content={staff}
                className="play-btn"
              />
            </div>
          </div>
        );
      });
    } else {
      return <h1>Estamos trabajando para mejorar el sitio.</h1>;
    }
  };

  const mapActors = (play) => {
    if (play.actors) {
      let actorsMap = play.actors.map((actor, indexActor) => {
        return (
          <li className="staff-member" key={indexActor}>
            <h3 className="staff-member-name">{actor.ActorFullName}</h3>
            {actor.ActorProfilePhoto ? (
              <img
                src={`http://localhost:3000/images/actors/${actor.ActorProfilePhoto}`}
                alt={actor.ActorFullName}
                className="staff-member-img"
              />
            ) : (
              ''
            )}
            <p className="staff-member-cv">{actor.ActorCurriculumVitae}</p>
          </li>
        );
      });

      return actorsMap;
    } else {
      return '';
    }
  };

  return (
    <div className="obraspage-container">
      <div className="section-header obraspage-header">
        <h1>Obras</h1>
        <p>Espectáculos que estrenamos.</p>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="section-body obraspage-body">{mapPlays()}</div>
      )}
    </div>
  );
}

export default ObrasPage;
