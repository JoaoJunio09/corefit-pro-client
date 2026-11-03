import { useState } from "react";
import { ImageOff, VideoOff } from "lucide-react";
import { safeMediaUrl, youtubeEmbedUrl } from "../utils/exerciseMedia";

export default function ExerciseMedia({
  photo,
  video,
  name,
}: {
  photo?: string | null;
  video?: string | null;
  name: string;
}) {
  const [photoError, setPhotoError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const imageUrl = safeMediaUrl(photo);
  const videoUrl = safeMediaUrl(video);
  const embed = videoUrl ? youtubeEmbedUrl(videoUrl) : null;
  return (
    <div className="cf-exercise-media">
      <div className="cf-exercise-photo">
        {imageUrl && !photoError ? (
          <img
            src={imageUrl}
            alt={`Demonstração de ${name}`}
            loading="lazy"
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="cf-media-placeholder">
            <ImageOff size={25} />
            <span>
              {photoError
                ? "Imagem indisponível"
                : "Sem imagem de demonstração"}
            </span>
          </div>
        )}
      </div>
      {videoUrl && (
        <div className="cf-exercise-video">
          {videoError ? (
            <div className="cf-media-placeholder">
              <VideoOff size={25} />
              <span>Vídeo indisponível no momento</span>
            </div>
          ) : embed ? (
            <iframe
              src={embed}
              title={`Vídeo de ${name}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              controls
              preload="metadata"
              src={videoUrl}
              poster={imageUrl ?? undefined}
              onError={() => setVideoError(true)}
            >
              Seu navegador não suporta este vídeo.
            </video>
          )}
        </div>
      )}
    </div>
  );
}
