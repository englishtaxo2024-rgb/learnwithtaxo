const CACHE_VERSION = '20260607b';
const SERVICES_IMAGE = `/assets/services/student-services-5-cards.png?v=${CACHE_VERSION}`;
const LIVE_MOMENTS_IMAGE = `/assets/live-sessions/live-class-moments.png?v=${CACHE_VERSION}`;
const FEEDBACK_IMAGES = [
  '/assets/feedback/feedback-01.png?v=20260607b',
  '/assets/feedback/feedback-02.png?v=20260607b',
  '/assets/feedback/feedback-03.png?v=20260607b',
  '/assets/feedback/feedback-04.png?v=20260607b',
  '/assets/feedback/feedback-05.png?v=20260607b',
  '/assets/feedback/feedback-06.png?v=20260607b',
  '/assets/feedback/feedback-07.png?v=20260607b',
  '/assets/feedback/feedback-08.png?v=20260607b',
  '/assets/feedback/feedback-09.png?v=20260607b',
  '/assets/feedback/feedback-10.png?v=20260607b',
  '/assets/feedback/feedback-11.png?v=20260607b',
  '/assets/feedback/feedback-12.png?v=20260607b',
  '/assets/feedback/feedback-13.png?v=20260607b',
  '/assets/feedback/feedback-14.png?v=20260607b',
  '/assets/feedback/feedback-15.png?v=20260607b',
  '/assets/feedback/feedback-16.png?v=20260607b',
  '/assets/feedback/feedback-17.png?v=20260607b',
  '/assets/feedback/feedback-18.png?v=20260607b',
  '/assets/feedback/feedback-19.png?v=20260607b',
  '/assets/feedback/feedback-20.png?v=20260607b',
];

function createImage(src, alt, className) {
  if (!src || !src.startsWith('/assets/')) {
    throw new Error('A valid absolute asset path is required.');
  }

  const image = document.createElement('img');
  image.setAttribute('src', src);
  image.setAttribute('alt', alt);
  if (className) image.className = className;
  return image;
}

function createHeading(title, subtitle) {
  const heading = document.createElement('div');
  heading.className = 'section-heading';

  const label = document.createElement('p');
  label.textContent = subtitle;
  const titleElement = document.createElement('h2');
  titleElement.textContent = title;

  heading.append(label, titleElement);
  return heading;
}

function createSection(className) {
  const section = document.createElement('section');
  section.className = `section ${className}`;
  section.dataset.homepageEnhancement = 'true';
  return section;
}

function insertReplacement(original, replacement) {
  original.hidden = true;
  original.dataset.homepageOriginal = 'hidden';

  const existing = original.nextElementSibling;
  if (existing?.dataset.homepageEnhancement === 'true') existing.remove();
  original.insertAdjacentElement('afterend', replacement);
}

function replaceServicesSection() {
  const showcase = document.querySelector('.course-showcase');
  const original = showcase?.closest('section');
  if (!original || original.dataset.homepageOriginal === 'hidden') return;

  const section = createSection('section-white homepage-image-section');
  const container = document.createElement('div');
  container.className = 'container';
  container.append(createImage(
    SERVICES_IMAGE,
    'Five student services included with Learn with Taxo',
    'homepage-design-image',
  ));
  section.append(container);
  insertReplacement(original, section);
}

function findSectionByTitle(title) {
  return [...document.querySelectorAll('.section-heading h2')]
    .find((heading) => heading.textContent.trim() === title)
    ?.closest('section');
}

function replaceLiveMomentsSection() {
  const original = findSectionByTitle('Kids English moments');
  if (!original || original.dataset.homepageOriginal === 'hidden') return;

  const section = createSection('section-pale homepage-image-section');
  const container = document.createElement('div');
  container.className = 'container';
  container.append(
    createHeading('Live Class Moments', 'Real moments from our online English classes'),
    createImage(
      LIVE_MOMENTS_IMAGE,
      'Live Class Moments from Learn with Taxo online English classes',
      'homepage-design-image',
    ),
  );
  section.append(container);
  insertReplacement(original, section);
}

function createFeedbackCard(src, index, duplicate) {
  const card = document.createElement('figure');
  card.className = 'feedback-card';
  if (duplicate) card.setAttribute('aria-hidden', 'true');

  const image = createImage(src, duplicate ? '' : `Community feedback ${index + 1}`, '');
  image.loading = 'lazy';
  card.append(image);
  return card;
}

function replaceFeedbackSection() {
  const original = findSectionByTitle('Phonics learning path');
  if (!original || original.dataset.homepageOriginal === 'hidden') return;

  const section = createSection('section-white feedback-section');
  const container = document.createElement('div');
  container.className = 'container';
  container.append(createHeading('Real Feedback from Our Community', 'آراء أولياء الأمور والطلاب'));

  const subtitle = document.createElement('p');
  subtitle.className = 'feedback-subtitle';
  subtitle.textContent = 'Genuine messages and reviews from English Taxo parents and students.';
  container.append(subtitle);

  const carousel = document.createElement('div');
  carousel.className = 'feedback-carousel';
  carousel.setAttribute('aria-label', 'Community feedback screenshots');
  const track = document.createElement('div');
  track.className = 'feedback-track';

  [...FEEDBACK_IMAGES, ...FEEDBACK_IMAGES].forEach((src, index) => {
    track.append(createFeedbackCard(src, index % FEEDBACK_IMAGES.length, index >= FEEDBACK_IMAGES.length));
  });
  carousel.append(track);
  section.append(container, carousel);
  insertReplacement(original, section);
}

function applyHomepageEnhancements() {
  replaceServicesSection();
  replaceLiveMomentsSection();
  replaceFeedbackSection();
}

export function installHomepageEnhancements() {
  const root = document.getElementById('root');
  if (!root) return;

  const observer = new MutationObserver(applyHomepageEnhancements);
  observer.observe(root, { childList: true, subtree: true });
  queueMicrotask(applyHomepageEnhancements);
}
