## todo

- [ ] find people to test it with different latex engines and report back any issues
- [ ] lualatex support (untested, needs verification)
- [ ] add a debug mode with DEBUG=1
- [ ] add my sample AGENTS.md (include in readme)
- [ ] youtube: re-record demo video
- [ ] youtube: edit and upload video
- [ ] youtube: update readme to uncomment and link to the video


## roadmap

- [ ] katex support with .md?
- [ ] add experimental mode to autosetup a page using python, opencv 

## done

- [x] update keywords
- [x] make all images/gifs permalinks so it works on github and npm
- [x] need to add badges to readme
- [x] update opengraph image for the repo
- [x] make repo public
- [x] publish on npm!!
- [x] latex: pad=0 property for \textbox should not mess with the size of the box, just add inner padding 
- [x] latex: empty \textbox should not have zero width
- [x] fix readme spacing a bit
- [x] add a footer
- [x] add a MIT license
- [x] write readme
- [x] add dev setup as well
- [x] make `annotate-dev` point to the linked binary for dev, and
      `annotate` to point to the installed version of the binary. this way we can
      test the installed version more easily.
- [x] need to create repo art
- [x] write readme: list features, engines supported, and languages supported
- [x] write readme: document built-in macros in style.sty
- [x] write readme: include warnings about not having tested other latex engines yet
- [x] write readme: add engine table comparing engines, languages, tested status, with note
- [x] write readme: usage instructions with clean sections & screenshots/gifs
- [x] write readme: improve image alt text
- [x] write readme: mention the examples folder with example projects for latex and typst
- [x] write readme: note how to work with images, and requiring pdftoppm/mutool for it to work
- [x] write readme: add dev setup
- [x] remove slop readme
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
- [x] add some indication in the watch page that we are also generating images.
- [x] add some indication in the watch page which language we are using (page-*.tex/typ).
- [x] fix bug with `--images` not working with `annotate watch` (not generating img/
      folder). it now works with both create project and watch.
- [x] when generating images for the pages it should not generating every image from scratch but rather generating only the image of the page that changed.
- [x] add an indication to show the last compiled page with a small time icon
- [x] create an --agents flag which auto creates a AGENTS.md, CLAUDE.md and auto enables the --images flag
- [x] update homepage to to show usage with the --agents flag
