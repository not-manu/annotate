## todo

- [ ] custom help page
- [ ] add a quote/callout component
- [ ] display success message when project is created
- [ ] write readme
  - [ ] list features, engines supported, and languages supported
  - [ ] include example for working with diagrams/figures
  - [ ] include warnings about not having tested other latex engines yet
  - [ ] basic install instructions for tectonic?
  - [ ] usage instructions with clean sections & screenshots/gifs
  - [ ] note how to work with images, and requiring pdftoppm/mutool for it to work.
- [ ] find people to test it with different latex engines and report back any issues
- [ ] add a debug mode with DEBUG=1

## done

- [x] custom `AnnotateError` with `message` and `hint` fields
- [x] helpful error output with paths and context
- [x] graceful exit on `q` and `ctrl+c`
- [x] add example pdf in `examples/`
- [x] auto-redirect to project folder when watching a `.pdf`
- [x] auto-watch pdf when creating project in folder with existing pdf
- [x] default `style.sty` generated at project root (latex + typst)
- [x] overlay pdf page size matches original pdf page size (latex + typst)
- [x] tectonic support
- [x] typst support
- [x] add helper macros in style files (text box, image box positioned at specific location)
  - [x] should be able to toggle borders for debugging
- [x] generate images in `img/` for each page
  - [x] this is disabled by default, but can be enabled with a flag
- [x] pdflatex support
- [x] xelatex support
- [x] latexmk support
- [x] open error.log with `e` and file with `o` in user's default editor (watch mode)
  - [x] current e to open is kinda broken.
  - [x] c to copy -> ce copy error and cs -> copy source
- [x] copying is not working fix this.
- [x] copy fails -> show in red
- [x] fix toolbar wrapping
- [x] when the cli starts there is a loading state where nothing is shown during the first compile. it would be better to show a loading ui instead of nothing.
- [x] improve error ui
- [x] improve error messages
- [x] improve quickstart


## roadmap
- [ ] katex support with .md?
