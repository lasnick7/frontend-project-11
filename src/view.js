import onChange from "on-change";

export default function(elements, i18next, state) {
    function render(path, value) {
        console.log('render on change init')
        switch (path) {
            case 'feeds':
                console.log('feed added: ', value);
                elements.input.value = '';
                elements.input.focus();
                break
            case 'rssInput.error':
                console.log('errors added: ', value)
                break
            case 'rssInput.status':
                console.log('status changed: ', value)
                switch (value) {
                    case 'sent':
                        if (state.rssInput.error !== null) {
                            elements.input.classList.add('is-invalid');
                        } else {
                            elements.input.classList.remove('is-invalid');
                        }
                        break
                    case 'filling':
                        break
                }
                break
        }
    }

    const watchedState = onChange(state, render);

    return watchedState;
}