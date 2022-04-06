import mm from 'micromatch';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import preprocess from 'svelte-preprocess';
import fs from 'fs';
import examples from 'mdsvexamples/vite';
export const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf8'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer(), cssnano()]
		}
	}),
	compilerOptions: {
		generate: 'ssr',
		hydratable: true
	},
	kit: {
		package: {
			exports: (filepath) => {
				if (filepath.endsWith('.d.ts')) return false;
				return !mm.contains(filepath, '**_');
			},
			files: mm.matcher('!**/*.test.{ts, js}')
		},
		/** @type {import('vite').UserConfig} */
		vite: {
			plugins: [examples],
			test: {
				globals: true,
				environment: 'jsdom'
			}
		}
	}
};

export default config;
