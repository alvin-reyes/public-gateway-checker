/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/semi */
import Countly from 'countly-sdk-web';

const metricsConsent = localStorage.getItem('metrics_consent');

const metricsNotificationModal = document.querySelector(
  '.js-metrics-notification-modal'
);
const metricsAgreementContent = document.querySelector('.js-metrics-agreement')
const metricsManagePreferencesContent = document.querySelector('.js-metrics-preferences')

const closeNotificationModalX = document.querySelector('.js-modal-close')
const confirmMetricNoticeBtn = document.querySelector('.js-metrics-notification-confirm');

const saveMetricPreferencesBtn = document.querySelector('.js-metrics-notification-preferences-save')

const managePreferencesBtn = document.querySelector(
  '.js-metrics-notification-manage'
);
const necessaryMetricsToggle = document.querySelector('.js-necessary-toggle') as HTMLInputElement
const metricsModalToggle = document.querySelector(
  '.js-metrics-modal-toggle'
);

function addConsent (consent: string[]): void {
  Countly.add_consent(consent);

  if (Array.isArray(consent)) {
    localStorage.setItem('metrics_consent', JSON.stringify(consent));
  } else {
    localStorage.setItem(
      'metrics_consent',
      JSON.stringify([consent])
    );
  }
}

function addConsentEventHandler (): void {
  metricsNotificationModal?.classList.add('hidden');

  addConsent(['all']);
}

function updateMetricPreferences (): void {
  console.log('chane metrics', necessaryMetricsToggle.checked)
  const necessaryMetricsAccepted = necessaryMetricsToggle.checked
  if (necessaryMetricsAccepted) {
    addConsent(['all'])
  } else {
    addConsent(['necessary'])
  }
}

function initMetricsModal (): void {
  metricsNotificationModal?.classList.remove('hidden');
  confirmMetricNoticeBtn?.classList.remove('hidden')
  managePreferencesBtn?.classList.remove('hidden')
  metricsAgreementContent?.classList.remove('hidden')
  closeNotificationModalX?.addEventListener('click', hideMetricsModal)
  confirmMetricNoticeBtn?.addEventListener('click', addConsentEventHandler);
  managePreferencesBtn?.addEventListener('click', managePreferencesClicked);
}

function hideMetricsModal (): void {
  metricsNotificationModal?.classList.add('hidden');
  metricsManagePreferencesContent?.classList.add('hidden')
  metricsAgreementContent?.classList.remove('hidden')
}

function managePreferencesClicked (): void {
  const metricsConsent = localStorage.getItem('metrics_consent');
  if (metricsConsent != null) necessaryMetricsToggle.checked = JSON.parse(metricsConsent)[0] === 'all'
  metricsAgreementContent?.classList.add('hidden')
  saveMetricPreferencesBtn?.classList.remove('hidden')
  metricsManagePreferencesContent?.classList.remove('hidden')

  necessaryMetricsToggle.addEventListener('click', updateMetricPreferences)
  saveMetricPreferencesBtn?.addEventListener('click', hideMetricsModal)
}

function metricsModalToggleEventHandler (): void {
  initMetricsModal();
}

function loadCountly (): void {
  metricsModalToggle?.addEventListener('click', metricsModalToggleEventHandler);
  Countly.init({
    app_key: '3c2c0819434074fc4d339ddd8e112a1e741ecb72',
    url: 'https://countly.ipfs.io',
    require_consent: true // this true means consent is required
  });
  /**
   * @see https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript-#features-for-consent
   */

  const minimalFeatures = ['sessions', 'views', 'events'];
  const performanceFeatures = ['crashes', 'apm'];
  const uxFeatures = ['scrolls', 'clicks', 'forms']
  const feedbackFeatures = ['star-rating', 'feedback']
  const locationFeatures = ['location']

  Countly.group_features({
    all: [
      ...minimalFeatures,
      ...performanceFeatures,
      ...uxFeatures,
      ...feedbackFeatures,
      ...locationFeatures
    ],
    minimal: minimalFeatures,
    performance: performanceFeatures,
    ux: uxFeatures,
    feedback: feedbackFeatures,
    location: locationFeatures
  });

  /**
   * we can call all the helper methods we want, they won't record until consent is provided for specific features
   */
  //
  Countly.track_clicks();
  Countly.track_errors();
  Countly.track_forms();
  Countly.track_links();
  Countly.track_pageview();
  Countly.track_scrolls();
  Countly.track_sessions();
  Countly.track_view();

  if (metricsConsent != null) {
    addConsent(JSON.parse(metricsConsent))
  }
}

export { loadCountly, Countly };