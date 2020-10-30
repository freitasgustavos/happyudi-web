import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {FiPlus, FiArrowRight} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import mapMarkerImg from '../images/map-marker.svg';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

import '../styles/pages/orphanages-map.css';

interface Orphanege {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

function OrphanagerMap() {
  const [orphanages, setOrphanages] = useState<Orphanege[]>([]);

  useEffect(()=>{
    api.get('/orphanages').then(response =>{
      setOrphanages(response.data);
    });
  },[]);

  return (
    <div id="page-map">
      <aside>
        <header>
          <Link to="/">
            <img src={mapMarkerImg} alt="Happy Udi"/>
          </Link>

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Uberlândia</strong>
          <span>Minas Gerais</span>
        </footer>
      </aside>

      <Map center={[-18.9176259,-48.3029653]}
        zoom={12}
        style={{width: '100%', height: '100%'}}
      >
      {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
      <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
      {orphanages.map(orphanage => {
        return (
          <Marker 
            key={orphanage.id}
            icon={mapIcon}
            position={[orphanage.latitude, orphanage.longitude]}
          >
            <Popup closeButton={false} maxWidth={170} minWidth={170} className="map-popup">
              {orphanage.name}
              <Link to={`/${orphanage.id}`}>
                <FiArrowRight size={20} color="#fff"/>
              </Link>
            </Popup>
          </Marker>
        )
      })}
      </Map>

      <Link to="/create" className="create-orphanage">
        <FiPlus size={32} color="#fff" />
      </Link>
    </div>
  );
}

export default OrphanagerMap;