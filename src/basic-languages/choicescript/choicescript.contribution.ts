import { registerLanguage, registerTheme } from '../_.contribution';
import { csDark, csLight } from './choicescript.themes';

registerTheme('cs-dark', csDark);
registerTheme('cs-light', csLight);

registerLanguage({
	id: 'choicescript',
	extensions: ['.txt'],
	aliases: ['ChoiceScript', 'cs'],
	loader: () => import('./choicescript')
});
