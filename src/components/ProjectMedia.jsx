import ImageGallery from './ImageGallery';
import './ProjectMedia.css';

export default function ProjectMedia({ project, accent, onOpenLightbox }) {
  if (!project.images?.length) {
    return (
      <div className="project-media-placeholder" style={{ '--accent': accent }}>
        <div className="project-media-placeholder-grid" aria-hidden="true" />
        <div className="project-media-placeholder-content">
          <span className="project-media-placeholder-code">MEDIA PACK / PENDING</span>
          <strong>{project.title}</strong>
          <p>{project.mediaNote || '项目图片暂未公开'}</p>
        </div>
        <div className="project-media-placeholder-spec">
          <span>IMAGES</span>
          <strong>0</strong>
        </div>
      </div>
    );
  }

  return (
    <ImageGallery
      images={project.images}
      projectTitle={project.title}
      accent={accent}
      onOpenLightbox={onOpenLightbox}
    />
  );
}
