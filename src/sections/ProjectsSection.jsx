import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import FadeContent from '../components/FadeContent';
import SectionHeader from '../components/SectionHeader';
import ProjectMedia from '../components/ProjectMedia';
import ImageLightbox from '../components/ImageLightbox';
import projects from '../data/projects';
import '../styles/shared.css';
import './ProjectsSection.css';

const loadProjectModelViewer = () => import('../components/ProjectModelViewer');
const ProjectModelViewer = lazy(loadProjectModelViewer);

function ProjectCard({ project, index, isEven, onImageClick, onOpenModel }) {
  return (
    <FadeContent threshold={0.08} duration={0.65} delay={index * 0.08}>
      <article className={`pcard ${isEven ? 'pcard-even' : ''}`} aria-labelledby={`project-${project.id}`}>
        <div className="pcard-num" style={{ color: project.color }} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="pcard-body">
          <div className="pcard-media">
            <ProjectMedia
              project={project}
              accent={project.color}
              onOpenLightbox={(activeIndex) => onImageClick(index, activeIndex)}
            />
          </div>

          <div className="pcard-info">
            <div className="pcard-topline">
              <span className="pcard-badge" style={{ color: project.color, borderColor: project.color }}>
                {project.category}
              </span>
              {project.featured && <span className="pcard-featured">重点项目</span>}
            </div>

            <h3 id={`project-${project.id}`} className="pcard-title">{project.title}</h3>
            <p className="pcard-title-en">{project.subtitle}</p>

            <div className="pcard-role">
              <span className="pcard-role-dot" style={{ background: project.color }} aria-hidden="true" />
              <span>{project.role}</span>
              <time className="pcard-role-date">{project.duration}</time>
            </div>

            {project.model?.src && (
              <div className="pcard-actions">
                <button
                  type="button"
                  className="pcard-model-launch"
                  onClick={() => onOpenModel(project)}
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3 4.5 7.25v8.5L12 20l7.5-4.25v-8.5L12 3Z" />
                    <path d="m4.5 7.25 7.5 4.25 7.5-4.25M12 11.5V20" />
                  </svg>
                  <span>
                    查看 3D 模型
                    <small>FULLSCREEN VIEWER</small>
                  </span>
                </button>
              </div>
            )}

            <div className="pcard-divider" style={{ background: `linear-gradient(to right, ${project.color}, transparent)` }} />
            <p className="pcard-desc">{project.description}</p>

            <ul className="pcard-details">
              {project.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>

            <div className="pcard-result">
              <span className="pcard-result-icon" aria-hidden="true">◆</span>
              {project.result}
            </div>

            <div className="pcard-tags" aria-label={`${project.title} 技术关键词`}>
              {project.highlights.map((highlight) => (
                <span key={highlight} className="ptag">
                  <span className="ptag-dot" style={{ background: project.color }} aria-hidden="true" />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </FadeContent>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const [lightbox, setLightbox] = useState({ projectIdx: null, imageIdx: null });
  const [modelProject, setModelProject] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || navigator.connection?.saveData || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      loadProjectModelViewer();
      observer.disconnect();
    }, { rootMargin: '320px 0px' });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const openLightbox = useCallback((projectIdx, imageIdx) => {
    setLightbox({ projectIdx, imageIdx });
  }, []);

  const closeLightbox = useCallback((newImageIdx) => {
    if (newImageIdx !== null && newImageIdx !== undefined) {
      setLightbox((previous) => ({ ...previous, imageIdx: newImageIdx }));
    } else {
      setLightbox({ projectIdx: null, imageIdx: null });
    }
  }, []);

  const openModel = useCallback((project) => setModelProject(project), []);
  const closeModel = useCallback(() => setModelProject(null), []);

  const activeProject = lightbox.projectIdx !== null ? projects[lightbox.projectIdx] : null;

  return (
    <section ref={sectionRef} id="projects" className="projects section-base" aria-labelledby="projects-title">
      <div className="section-inner">
        <SectionHeader
          eyebrow="02 / SELECTED ENGINEERING WORK"
          title="重点项目"
          subtitle="以机构、传动和样机落地为核心，呈现我在机械系统中的具体职责与工程输出。"
          titleId="projects-title"
        />

        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isEven={index % 2 === 1}
              onImageClick={openLightbox}
              onOpenModel={openModel}
            />
          ))}
        </div>
      </div>

      {activeProject && (
        <ImageLightbox
          images={activeProject.images}
          activeIndex={lightbox.imageIdx}
          title={activeProject.title}
          onClose={closeLightbox}
        />
      )}

      {modelProject && (
        <Suspense fallback={<div className="model-launch-fallback" role="status">正在打开 3D 查看器…</div>}>
          <ProjectModelViewer
            key={modelProject.id}
            model={modelProject.model}
            projectTitle={modelProject.title}
            accent={modelProject.color}
            onClose={closeModel}
          />
        </Suspense>
      )}
    </section>
  );
}
