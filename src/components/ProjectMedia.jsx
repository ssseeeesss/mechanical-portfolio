import ImageGallery from './ImageGallery';

export default function ProjectMedia({ project, accent, onOpenLightbox }) {
  return (
    <ImageGallery
      images={project.images}
      projectTitle={project.title}
      accent={accent}
      onOpenLightbox={onOpenLightbox}
    />
  );
}
