## todo

- [ ] need to create repo art
- [ ] write readme
  - [ ] list features, engines supported, and languages supported
  - [ ] document built in macros in style.sty
  - [ ] include example for working with diagrams/figures
  - [ ] mention the examples folder with example projects for latex and typst
  - [ ] include warnings about not having tested other latex engines yet
  - [ ] basic install instructions for tectonic?
  - [ ] usage instructions with clean sections & screenshots/gifs
  - [ ] note how to work with images, and requiring pdftoppm/mutool for it to work.
  - [ ] add dev setup as well
    - [ ] make `annotate-dev` point to the linked binary for dev, and
          `annotate` to point to the installed version of the binary. this way we can
          test the installed version more easily.
- [ ] find people to test it with different latex engines and report back any issues
- [ ] add a debug mode with DEBUG=1
- [ ] fix bug with `--images` not working sometimes (not generating img/
      folder). it should work with both create project and compile
- [ ] add some indication in the watch page that we are also generating images.
- [ ] add some indication in the wathc page which language we are using (maybe page-n.tex/typ)

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
- [x] there's a slight margin in a \textbox which is good for text but not for figures. maybe add a \figbox which is the same as \textbox but with no margin?
- [x] complete latex example homework
- [x] complete typst example homework
- [x] make the default annotation color more contrasting from black text.

## roadmap
- [ ] katex support with .md?
