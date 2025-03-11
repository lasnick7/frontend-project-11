/* eslint-disable no-param-reassign */
// eslint-disable-next-line default-case

function rssInputValidationHandler(elements, i18next, state, value) {
  console.log('url validation status changed: ', value);
  console.log('current url validation error', state.rssInput.error);
  switch (value) {
    case true:
      elements.input.classList.remove('is-invalid');
      break;
    case false:
      elements.input.classList.add('is-invalid');

      elements.feedback.textContent = i18next.t(`errors.${state.rssInput.error}`);
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      break;
  }
}

function loadingProcessValidationHandler(elements, i18next, state, value) {
  console.log('current loading process error: ', state.loadingProcess.error);
  switch (value) {
    case 'success':
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('success.uploaded');
      elements.button.disabled = false;

      // // elements.feedback.textContent = i18next.t('success.uploaded');
      // elements.feedback.classList.remove('text-danger');
      // elements.feedback.classList.add('text-success');
      break;
    case 'loading':
      elements.button.disabled = true;
      elements.feedback.textContent = '';
      break;
    case 'failed':
      elements.button.disabled = false;

      elements.feedback.textContent = i18next.t(`errors.${state.loadingProcess.error}`);
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      break;
  }
}

export { rssInputValidationHandler, loadingProcessValidationHandler };
