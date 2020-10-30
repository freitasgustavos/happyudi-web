import React, { useCallback, useState, ChangeEvent, useRef } from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { toast } from "react-toastify";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import { FiPlus } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Input from "../components/Input";
import InputMask from "../components/InputMask";
import Textarea from "../components/Textarea";

import mapIcon from "../utils/mapIcon";
import getValidationErros from "../utils/getValidationErros";
import api from "../services/api";

import "../styles/pages/create-orphanage.css";

export default function CreateOrphanage() {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [error, setError] = useState(false);
  const [errImg, setErrImg] = useState(false);
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleMapClick = useCallback((event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Por favor digite o nome do orfanato"),
          phone: Yup.string()
            .min(11, "Desculpe! Telefone incorreto")
            .required("Por favor digite o telefone do orfanato"),
          about: Yup.string().required(
            "Por favor digite informações sobre o orfanato"
          ),
          instructions: Yup.string().required(
            "Por favor digite as instruções de visita do orfanato"
          ),
          opening_hours: Yup.string().required(
            "Por favor digite horário de visita do orfanato"
          ),
        });

        const { latitude, longitude } = position;

        await schema.validate(data, {
          abortEarly: false,
        });

        if (latitude === 0) {
          setError(true);
          window.location.hash = "#location";
          return;
        } else {
          setError(false);
        }

        if (images.length < 1) {
          setErrImg(true);
          window.location.hash = "#photo";
          return;
        } else {
          setErrImg(false);
        }

        const send = new FormData();

        send.append("name", data.name);
        send.append("phone", data.phone.replace(/\D+/g, ""));
        send.append("about", data.about);
        send.append("latitude", String(latitude));
        send.append("longitude", String(longitude));
        send.append("instructions", data.instructions);
        send.append("opening_hours", data.opening_hours);
        send.append("open_on_weekends", String(open_on_weekends));

        images.forEach((image) => {
          send.append("images", image);
        });

        await api.post("/orphanages", send);

        toast.success("Cadastro realizado enviado para liberação");

        history.push("/app");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
      }
    },
    [history, images, open_on_weekends, position]
  );

  const handleSelectImages = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }
      const selectedImages = Array.from(event.target.files);
      setImages(selectedImages);

      const selectedImagesPreview = selectedImages.map((image) => {
        return URL.createObjectURL(image);
      });

      setPreviewImages(selectedImagesPreview);
    },
    []
  );
  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="create-orphanage-form"
        >
          <fieldset>
            <legend>Dados</legend>

            <Map
              id="location"
              center={[-18.9176259, -48.3029653]}
              style={{ width: "100%", height: 280 }}
              zoom={11}
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>
            {error && position.latitude === 0 && (
              <span className="error">
                Por favor selecione a localização do orfanato
              </span>
            )}

            <div className="input-block" id="name">
              <label htmlFor="name">Nome</label>
              <Input name="name" />
            </div>

            <div className="input-block" id="phone">
              <label htmlFor="name">Telefone (Whatsapp)</label>
              <InputMask name="phone" mask="(99) 99999-9999" />
            </div>

            <div className="input-block" id="about">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <Textarea name="about" maxLength={300} />
            </div>

            <div className="input-block" id="photo">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => {
                  return <img key={image} src={image} alt="HappyUdi" />;
                })}
                {previewImages.length < 5 && (
                  <label htmlFor="image[]" className="new-image">
                    <FiPlus size={24} color="#15b6d6" />
                  </label>
                )}
              </div>
              {errImg && (
                <span>Por favor selecione pelo menos uma foto do orfanato</span>
              )}
              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                id="image[]"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block" id="instructions">
              <label htmlFor="instructions">Instruções</label>
              <Textarea name="instructions" />
            </div>

            <div className="input-block" id="opening_hours">
              <label htmlFor="opening_hours">Horário das visitas</label>
              <Input name="opening_hours" />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? "active" : ""}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </Form>
      </main>
    </div>
  );
}
